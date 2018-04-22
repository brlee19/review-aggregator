const axios = require('axios');
const apiKey = process.env.google_api_key || require('../config.js').google_api_key;

//google
const convertAddressToCoords = (address) => {
  const params = {address: address, key: apiKey};
  return axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {params: params})
    .then(resp => {
      return resp.data.results[0].geometry.location;
    })
    .catch(err => console.log('err trying to get lat/lon from google:', err)) //not sure if this needs to be here or should just be chained
};

const searchPlacesByCoords = (coords, query) => { //using coords so all the APIs can use it
  //query is something like {type: 'restaurant', keyword:'sushi'}
  console.log('query inside google search is', query);
  const params = {
    key: apiKey,
    location: `${coords.lat},${coords.lng}`,
    type: query.type,
    radius: query.radius, //default radius for now
    keyword: query.keyword
  };
  return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', {params: params})
    .then(resp => {
      return resp.data.results;
    })
    .catch(err => console.log(err));
};

const getPlaceDetails = (placeid) => {
  const params = {placeid: placeid, key: apiKey};
  return axios.get('https://maps.googleapis.com/maps/api/place/details/json?', {params: params})
    .then((resp) => {
      return resp.data.result;
    })
    .catch((err) => {console.log(err)})
};

const getAverageRating = (places) => { //same as yelp but different from foursquare
  const totalRatings = places.reduce((ratings, place) => {
    return ratings + place.rating;
  }, 0);
  const avgRating = totalRatings / places.length;
  return Number((Math.round(avgRating * 100)/ 100).toFixed(1));
};

exports.convertAddressToCoords = convertAddressToCoords;
exports.searchPlacesByCoords = searchPlacesByCoords;
exports.getPlaceDetails = getPlaceDetails;