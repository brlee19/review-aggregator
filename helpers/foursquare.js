const id = require('../config.js').foursquare_id;
const secret = require('../config.js').foursquare_secret;
const axios = require('axios');
const request = require('request');
const querystring = require('querystring');

const getNearbyPlaces = (coords, query) => {
  const qs = {
    client_id: id,
    client_secret: secret,
    ll: `${coords.latitude},${coords.longitude}`,
    limit: 10,
    v: '20180323',
    query: query
  };
  console.log('qs are', qs);
  return axios.get(`https://api.foursquare.com/v2/venues/search`, {params: qs})
    .then((resp) => console.log('resp from 4square is', resp.data.response.venues))
    .catch((err) => console.log(err));
}

exports.getNearbyPlaces = getNearbyPlaces;