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

const getMatchingPlaceId = (coords, query) => {
  const qs = {
    client_id: id,
    client_secret: secret,
    name: query.name,
    ll: `${coords.latitude},${coords.longitude}`,
    limit: 1,
    intent: 'match',
    phone: query.phone,
    v: '20180323'
  };
  console.log('qs are', qs);
  return axios.get(`https://api.foursquare.com/v2/venues/search`, {params: qs})
    .then((resp) => {
      // console.log('data from 4sq is', resp.data.response.venues)
      return resp.data.response.venues[0].id;
    })
    .catch((err) => console.log(err));
}

const getPlaceDetails = (foursquareId) => {
  const qs = {
    VENUE_ID: foursquareId,
    client_id: id,
    client_secret: secret,
    v: '20180323'
  };
  return axios.get(`https://api.foursquare.com/v2/venues/${foursquareId}?`, {params: qs})
    .then((resp) => (resp.data.response.venue))
    .catch((err) => console.log(err))
}

exports.getNearbyPlaces = getNearbyPlaces;
exports.getMatchingPlaceId = getMatchingPlaceId;
exports.getPlaceDetails = getPlaceDetails;