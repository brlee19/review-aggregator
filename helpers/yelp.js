const axios = require('axios');
const token = require('../config.js').yelp_api_key;

const searchPlacesByCoords = (coords, query) => {
  const tokenHeader = {'Authorization': 'Bearer ' + token};
  const config = {
    latitude: coords.lat, //to number?
    longitude: coords.lng,
    radius: 10000,
    categories: query.categories, //may need to map google to yelp cats, cats are optional for yelp OR just use google for searching and use yelp for reviews
    term: query.term
  };
  return axios.get('https://api.yelp.com/v3/businesses/search', {headers: tokenHeader, params: config})
    .then(resp => {
      return {
        places: resp.data.businesses,
        averageRating: getAverageRating(resp.data.businesses)
      };
    })
    .catch(err => {
      console.log(err)
    })
};

const getAverageRating = (places) => { //same as yelp but different from foursquare
  const totalRatings = places.reduce((ratings, place) => {
    return ratings + place.rating;
  }, 0);
  const avgRating = totalRatings / places.length;
  return Number((Math.round(avgRating * 100)/ 100).toFixed(1));
};

exports.searchPlacesByCoords = searchPlacesByCoords;