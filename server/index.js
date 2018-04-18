const express = require('express');
const bodyParser = require('body-parser');
const google = require('../helpers/google.js');
const yelp = require('../helpers/yelp.js');
const apiHelpers = require('../helpers/utils.js');
const port = 3000;

const app = express();
app.listen(port, () => console.log(`listening on port ${port}!`));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/dist'));

app.get('/testgoogle', (req, res) => {
  // google.searchPlacesByAddress('350 E 30th Street New york', {type: 'restaurant', keyword: 'sushi'})
  //   .then(places => {
  //     // console.log('places are', places);
  //     res.send(places);
  //   })
  //   .catch(err => res.send(err));
  // google.getPlaceDetails("ChIJoxGBgFhYwokRbkjQZYUSTQY")
  //   .then(results => {res.send(results)})
  //   .catch(err => res.send(err));
  // console.log(apiHelpers.convertGoogleAddressToYelp('test'));
    // .then((address) => {res.send(address)})
    // .catch((err) => {res.send(err)})

  // const testId = "ChIJ3VhbOeVYwokRck8jQGsiwec";
  // apiHelpers.getYelpDetailsFromGoogleId(testId)
  //   .then((result) => res.send(result))
  //   .catch((err) => res.send(err));
    google.searchPlacesByAddress('Montgomery AL', {type: 'restaurant', keyword: 'sushi'})
      .then(data => {
        console.log(`there are ${data.length} results`);
        res.send(data);
      })
      .catch(err => res.send(err));
});

app.get('/testyelp', (req, res) => {
  google.convertAddressToCoords('Montgomery AL')
    .then((coords => {
      yelp.searchPlacesByCoords(coords, {categories: 'restaurants', term: 'sushi'})
        .then(results => res.send(results))
        .catch(err => res.send(err))
    }))
});