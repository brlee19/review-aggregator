const express = require('express');
const bodyParser = require('body-parser');

const google = require('../helpers/google.js');
const yelp = require('../helpers/yelp.js');
const foursquare = require('../helpers/foursquare.js');
const apis = require('../helpers/apis.js');
const utils = require('../helpers/utils.js');
const db = require('../database/index.js');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}!`));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/dist'));

app.post('/search', (req, res) => {
  const userQuery = req.body.data;
  google.convertAddressToCoords(userQuery.address)
    .then((coords) => { 
      const yelpQuery = yelp.mapQuery(userQuery);
      return yelp.searchPlacesByCoords(coords, yelpQuery);
    })
    .then((yelpData) => {
      yelpData.sort((a, b) => b.rating - a.rating);
      res.send(yelpData);
    })
    .catch(err => {
      console.log('err in yelp search is', err);
      res.send('sorry, error');
    });
});

app.post('/details', (req, res) => {
  console.log('req.body is', req.body);
  const {id, name, phone, coordinates} = req.body;
  const combinedData = {}; //closure variable to house all the data sent back to client
  combinedData.yelp = req.body;

  const yelpPromise = yelp.getReviewExcerpts(id) //this promise will be the same regardless of db contents
    .then(reviews => {
      combinedData.yelpReviews = reviews; //delete this eventually
      combinedData.yelp.reviews = reviews;
    });

  let reviewSitePromises = [yelpPromise]; //use Promise.all once this is filled in with google and foursquare
  db.getIdsByYelpId(id)
    .then(res => { //construct promises based on whether data exists in the db
      if (!res || !res.google) {
        reviewSitePromises[1] = apis.getGoogleDetailsFromYelpData(req.body)
          .then(googleDetails => combinedData.googleDetails = googleDetails);
      };
      if (!res || !res.foursquare) {
        reviewSitePromises[2] = foursquare.getMatchingPlaceId(coordinates, {name: name, phone: phone})
          .then(foursquareId => foursquare.getPlaceDetails(foursquareId))
          .then(foursquareData => combinedData.foursquareDetails = foursquareData);
      };
      if (res && res.google) {
        reviewSitePromises[1] = google.getPlaceDetails(res.google) //lookup directly by id since it exists in the db
          .then(googleDetails => combinedData.googleDetails = googleDetails);
      };
      if (res && res.foursquare) {
        reviewSitePromises[2] = foursquare.getPlaceDetails(res.foursquare) //can skip a step if id is in db
          .then(foursquareData => combinedData.foursquareDetails = foursquareData);
      };
    })
    .then(() => {
      // console.log('review site promises are', reviewSitePromises);
      Promise.all(reviewSitePromises)
      .then(() => {
        console.log('organized place data is', utils.organizePlacesData(combinedData));
        res.send(combinedData);
      })
      .then(() => { //save ids to db if they aren't already there
        const combinedIds = {yelp: id,
                             google: combinedData.googleDetails.place_id,
                             foursquare: combinedData.foursquareDetails.id};
        db.addIds(combinedIds);
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});