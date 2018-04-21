const express = require('express');
const bodyParser = require('body-parser');

const google = require('../helpers/google.js');
const yelp = require('../helpers/yelp.js');
const foursquare = require('../helpers/foursquare.js');
const apis = require('../helpers/utils.js');
const db = require('../database/index.js');

const app = express();
const port = 3000;
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
  const combinedData = {}; //closure variable to house all the data sent back to client

  const yelpPromise = yelp.getReviewExcerpts(id) //this promise will be the same regardless of db contents
                            .then(reviews => combinedData.yelpReviews = reviews);
  let reviewSitePromises = [yelpPromise]; //use Promise.all once this is filled in with google and foursquare
  db.getIdsByYelpId(id)
    .then(res => { //construct promises based on whether data exists in the db
      if (!res || !res.google) {
        console.log('inside the no google block');
        reviewSitePromises[1] = apis.getGoogleDetailsFromYelpData(req.body)
                                  .then(googleDetails => combinedData.googleDetails = googleDetails);
      };
      if (!res || !res.foursquare) {
        console.log('inside the no foursquare block');
        reviewSitePromises[2] = foursquare.getMatchingPlaceId(coordinates, {name: name, phone: phone})
                                            .then(foursquareId => foursquare.getPlaceDetails(foursquareId))
                                            .then(foursquareData => combinedData.foursquareDetails = foursquareData);
      };
      if (res && res.google) {
        console.log('inside the yes google block');
        reviewSitePromises[1] = google.getPlaceDetails(res.google) //lookup directly by id since it exists in the db
                                        .then(googleDetails => combinedData.googleDetails = googleDetails);
      };
      if (res && res.foursquare) {
        console.log('inside the yes foursquare block');
        reviewSitePromises[2] = foursquare.getPlaceDetails(res.foursquare) //can skip a step if id is in db
                                            .then(foursquareData => combinedData.foursquareDetails = foursquareData);
      };
    })
    .then(() => {
      console.log('review site promises are', reviewSitePromises);
      Promise.all(reviewSitePromises)
      .then(() => res.send(combinedData))
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

app.get('/__testdb', (req, res) => {
  // db.addIds({yelp: 'testYelp', google:'testGoogle', foursquare:'testFoursquare'})
  //   .then((res) => console.log(res));
  // db.getIdsByYelpId('testYelp')
  //   .then(res => console.log(res.rows[0].google))
  //   .catch(err => console.log(err));
  db.reset()
    .then(resp => res.send('db reset'))
    .catch(err => res.send(err))
})