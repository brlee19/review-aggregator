const axios = require('axios');
const apiKey = require('../config.js').google_api_key;

//google
const convertAddressToCoords = (address) => {
  const params = {address: address, key: apiKey};
  return axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {params: params})
    .then(resp => {
      return resp.data.results[0].geometry.location;
    })
    .catch(err => console.log('err trying to get lat/lon from google:', err)) //not sure if this needs to be here or should just be chained
};

const searchPlacesByAddress = (address, query) => {
  //query is something like {type: 'restaurant', keyword:'sushi'}
  return convertAddressToCoords(address)
    .then((coords) => {
      const params = {
        key: apiKey,
        location: `${coords.lat},${coords.lng}`,
        type: query.type,
        radius: '500', //default radius for now
        keyword: query.keyword
      }
      return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', {params: params})
        .then(resp => resp.data.results)
        .catch(err => console.log(err))
    })
}

exports.convertAddressToCoords = convertAddressToCoords;
exports.searchPlacesByAddress = searchPlacesByAddress;