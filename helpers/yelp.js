const axios = require('axios');
const token = require('../config.js').yelp_api_key;

const searchPlacesByCoords = (coords, query) => {
  const tokenHeader = {'Authorization': 'Bearer ' + token};
  const config = {
    latitude: coords.lat, //to number?
    longitude: coords.lng,
    radius: 5000,
    categories: query.categories, //may need to map google to yelp cats, cats are optional for yelp
    term: query.term
  };
  return axios.get('https://api.yelp.com/v3/businesses/search', {headers: tokenHeader, params: config})
    .then(resp => {
      return resp.data.businesses;
    })
    .catch(err => {
      console.log(err)
    })
}

exports.searchPlacesByCoords = searchPlacesByCoords;