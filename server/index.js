const express = require('express');
const bodyParser = require('body-parser');
const google = require('../helpers/google.js');
const yelp = require('../helpers/yelp.js');
const foursquare = require('../helpers/foursquare.js');
const apis = require('../helpers/utils.js');
const port = 3000;

const app = express();
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
      console.log('err in search is', err);
      res.send('sorry, error');
    });
});

app.post('/details', (req, res) => {
  const yelpId = req.body.id;
  const name = req.body.name;
  const phone = req.body.phone;
  const coords = req.body.coordinates;
  const combinedData = {};

  yelp.getReviewExcerpts(yelpId) //TODO: Promise.all the api calls that don't rely on each other
    .then((reviews) => {
      combinedData.yelpReviews = reviews;
      return apis.getGoogleDetailsFromYelpData(req.body);
    })
    .then((googleDetails) => {
      combinedData.googleDetails = googleDetails;
    })
    .then(() => {
      return foursquare.getMatchingPlaceId(coords, {
        name: name,
        phone: phone
      })
    })
    .then((foursquareId) => {
      return foursquare.getPlaceDetails(foursquareId);
    })
    .then((foursquareData) => {
      combinedData.foursquareDetails = foursquareData;
    })
    .then(() => res.send(combinedData))
    .catch((err) => console.log('error is', err));
});

app.get('/testgoogle', (req, res) => {
  google.convertAddressToCoords('350 E 30th Street, New York NY')
    .then((coords) => {
      coordinates = Object.assign({}, coords);
      return google.searchPlacesByCoords(coords, {type: 'restaurant'}); //try util function that searches both g and y
    })
    .then((googleData) => {
      res.send(googleData.places[0]);
    })
});

app.get('/testyelp', (req, res) => {
  apis.getGoogleDetailsFromYelpId('FsuJ7VC5vxX3wcLhFrb97Q')
    .then((results) => res.send(results[0]))
    .catch(err => res.send(err))
});

app.get('/testfoursquare', (req, res) => {
  const coordinates = {
    latitude: 40.74662,
    longitude: -73.98539
  };
  const query = 'korean';
  foursquare.getNearbyPlaces(coordinates, query);
});