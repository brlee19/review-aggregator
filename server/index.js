const express = require('express');
const bodyParser = require('body-parser');
const google = require('../helpers/google.js');
const yelp = require('../helpers/yelp.js');
const port = 3000;

const app = express();
app.listen(port, () => console.log(`listening on port ${port}!`));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
  // google.searchPlacesByAddress('350 E 30th Street New york', {type: 'restaurant', keyword: 'sushi'})
  //   .then(places => {
  //     console.log('places are', places)
  //     res.send(places);
  //   })
  //   .catch(err => res.send(err));
  google.convertAddressToCoords('350 E 30th St, New York NY')
    .then((coords => {
      yelp.searchPlacesByCoords(coords, {categories: 'restaurants', term: 'sushi'})
        .then(results => res.send(results))
        .catch(err => res.send(err))
    }))
})