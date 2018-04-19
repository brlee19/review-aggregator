const express = require('express');
const bodyParser = require('body-parser');
const google = require('../helpers/google.js');
const yelp = require('../helpers/yelp.js');
const apis = require('../helpers/utils.js');
const port = 3000;

const app = express();
app.listen(port, () => console.log(`listening on port ${port}!`));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/dist'));

app.post('/search', (req, res) => {
  const userQuery = req.body.data;
  // console.log('userQuery is', userQuery);

  google.convertAddressToCoords(userQuery.address)
    .then((coords) => { 
      const yelpQuery = yelp.mapQuery(userQuery);
      return yelp.searchPlacesByCoords(coords, yelpQuery);
    })
    .then((yelpData) => {
      yelpData.sort((a, b) => b.rating - a.rating);
      res.send(yelpData);
    })
    .then(() => { //chain together any additional API calls that use lat/long
      // console.log('I should probably start adding this data to the DB huh'); //TODO
    })
    .catch(err => {
      console.log('err in search is', err);
      res.send('sorry, error');
    });
});

app.post('/details', (req, res) => {
  const yelpId = req.body.id;
  const combinedData = {};

  yelp.getReviewExcerpts(yelpId)
    .then((reviews) => {
      combinedData.yelpReviews = reviews;
    })
    .then(() => {
      return apis.getGoogleDetailsFromYelpId(yelpId);
    })
    .then((googleDetails) => {
      console.log('google details are', googleDetails);
      combinedData.googleDetails = googleDetails;
      // console.log('combinedData is now', combinedData);
      res.send(combinedData);
    })
    // .then(() => res.send('ok'))
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