const express = require('express');
const bodyParser = require('body-parser');
const google = require('../helpers/google.js');
const yelp = require('../helpers/yelp.js');
const foursquare = require('../helpers/foursquare.js');
const apis = require('../helpers/utils.js');
const db = require('../database/index.js');
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

  const googlePromise = apis.getGoogleDetailsFromYelpData(req.body) //if google id exists, can just use that instead
                            .then(googleDetails => combinedData.googleDetails = googleDetails);

  const foursquarePromise = foursquare.getMatchingPlaceId(coordinates, {name: name, phone: phone}) //unnecessary if 4sq id exists in db
                                      .then(foursquareId => foursquare.getPlaceDetails(foursquareId))
                                      .then(foursquareData => combinedData.foursquareDetails = foursquareData);

  Promise.all([yelpPromise, googlePromise, foursquarePromise])
    .then(() => res.send(combinedData))
    .then(() => { //save ids to db if they aren't already there
      const combinedIds = {yelp: id,
                           google: combinedData.googleDetails.place_id,
                           foursquare: combinedData.foursquareDetails.id};
      db.addIds(combinedIds); 
    })
    .catch((err) => console.log('error is', err));
});

app.get('/testdb', (req, res) => {
  // db.addIds({yelp: 'testYelp', google:'testGoogle', foursquare:'testFoursquare'})
  //   .then((res) => console.log(res));
  db.getIdsByYelpId('testYelp')
    .then(res => console.log(res.rows[0].google))
    .catch(err => console.log(err));
})