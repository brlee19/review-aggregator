const axios = require('axios');
const apiKey =
  process.env.google_api_key || require('../../config.js').google_api_key;

const convertAddressToCoords = async (address) => {
  const params = { address: address, key: apiKey };
  try {
    const googleGeocodeResp = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json?',
      { params: params }
    );
    debugger;
    return googleGeocodeResp.data.results[0].geometry.location;
  } catch (e) {
    const x = e;
    debugger;
    console.error('error trying to get lat/long from google');
  }
};

const searchPlacesByCoords = (coords, query) => {
  console.log('query inside google search is', query);
  const params = {
    key: apiKey,
    location: `${coords.lat},${coords.lng}`,
    type: query.type,
    radius: query.radius,
    keyword: query.keyword,
  };
  return axios
    .get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', {
      params: params,
    })
    .then((resp) => {
      return resp.data.results;
    })
    .catch((err) => console.log(err));
};

const getPlaceDetails = (placeid) => {
  const params = { placeid: placeid, key: apiKey };
  return axios
    .get('https://maps.googleapis.com/maps/api/place/details/json?', {
      params: params,
    })
    .then((resp) => {
      return resp.data.result;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAverageRating = (places) => {
  const totalRatings = places.reduce((ratings, place) => {
    return ratings + place.rating;
  }, 0);
  const avgRating = totalRatings / places.length;
  return Number((Math.round(avgRating * 100) / 100).toFixed(1));
};

exports.convertAddressToCoords = convertAddressToCoords;
exports.searchPlacesByCoords = searchPlacesByCoords;
exports.getPlaceDetails = getPlaceDetails;
