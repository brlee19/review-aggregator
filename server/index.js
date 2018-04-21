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
  const {id, name, phone, coordinates} = req.body;
  const combinedData = {}; //closure variable

  const yelpPromise = yelp.getReviewExcerpts(id)
                          .then(reviews => combinedData.yelpReviews = reviews);

  const googlePromise = apis.getGoogleDetailsFromYelpData(req.body)
                            .then(googleDetails => combinedData.googleDetails = googleDetails);

  const foursquarePromise = foursquare.getMatchingPlaceId(coordinates, {name: name, phone: phone})
                                      .then(foursquareId => foursquare.getPlaceDetails(foursquareId))
                                      .then(foursquareData => combinedData.foursquareDetails = foursquareData);

  Promise.all([yelpPromise, googlePromise, foursquarePromise])
    .then(() => res.send(combinedData))
    .catch((err) => console.log('error is', err));
});