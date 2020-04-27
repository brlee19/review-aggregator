const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { google, yelp, foursquare, utils, apis } = require('./apiHelpers');
const db = require('./database/index.js');

const app = express();
const port = process.env.PORT || 3000;
const redis = require('redis');

const client = redis.createClient();
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on('connect', function () {
  console.log('Connected to Redis...');
});

app.listen(port, () => console.log(`listening on port ${port}!`));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/dist'));

app.get('/search', (req, res) => {
  const userQuery = req.query;
  google
    .convertAddressToCoords(userQuery.address)
    .then((coords) => {
      const yelpQuery = yelp.mapQuery(userQuery);
      return yelp.searchPlacesByCoords(coords, yelpQuery);
    })
    .then((yelpData) => {
      yelpData.sort((a, b) => b.rating - a.rating);
      res.send(yelpData);
    })
    .catch((err) => {
      console.log('err in yelp search is', err);
      res.send('sorry, error');
    });
});

app.get('/details', async (req, res) => {
  const { id, name, phone, coordinates } = req.query;

  const redisResults = await getAsync(id);
  if (redisResults) {
    console.log('sending results from redis');
    res.send(redisResults);
    return;
  }

  console.log('not found in redis, going to hit APIs');
  const combinedData = {};
  let organizedData = {};
  combinedData.yelp = req.query;

  const yelpPromise = yelp.getReviewExcerpts(id).then((reviews) => {
    combinedData.yelp.reviews = reviews;
  });

  let reviewSitePromises = [yelpPromise];
  db.getIdsByYelpId(id)
    .then((res) => {
      if (!res || !res.google) {
        reviewSitePromises[1] = apis
          .getGoogleDetailsFromYelpData({ id, name, phone, coordinates })
          .then(
            (googleDetails) => (combinedData.googleDetails = googleDetails)
          );
      }
      if (!res || !res.foursquare) {
        reviewSitePromises[2] = foursquare
          .getMatchingPlaceId(coordinates, { name: name, phone: phone })
          .then((foursquareId) => foursquare.getPlaceDetails(foursquareId))
          .then(
            (foursquareData) =>
              (combinedData.foursquareDetails = foursquareData)
          );
      }
      if (res && res.google) {
        reviewSitePromises[1] = google
          .getPlaceDetails(res.google) //lookup directly by id since it exists in the db
          .then(
            (googleDetails) => (combinedData.googleDetails = googleDetails)
          );
      }
      if (res && res.foursquare) {
        reviewSitePromises[2] = foursquare
          .getPlaceDetails(res.foursquare) //can skip a step if id is in db
          .then(
            (foursquareData) =>
              (combinedData.foursquareDetails = foursquareData)
          );
      }
    })
    .then(() => {
      return Promise.all(reviewSitePromises);
    })
    .then(() => {
      organizedData = utils.organizePlacesData(combinedData);
      res.send(organizedData);
      return JSON.stringify(organizedData);
    })
    .then((restaurantDetails) => {
      return setAsync(id, restaurantDetails, 'EX', 60 * 60 * 24); // cache expires after 24 hours
    })
    .then(() => {
      const combinedIds = {
        yelp: organizedData.yelpId,
        google: organizedData.googleId,
        foursquare: organizedData.foursquareId,
      };
      db.addIds(combinedIds);
    })
    .catch((err) => console.log(err));
});
