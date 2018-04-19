const axios = require('axios');
const token = require('../config.js').yelp_api_key;

const tokenHeader = {'Authorization': 'Bearer ' + token};

const searchPlacesByCoords = (coords, query) => {
  // const tokenHeader = {'Authorization': 'Bearer ' + token};
  const config = {
    latitude: coords.lat, //to number?
    longitude: coords.lng,
    radius: 5000,
    categories: query.categories, //may need to map google to yelp cats, cats are optional for yelp OR just use google for searching and use yelp for reviews
    term: query.term
  };
  return axios.get('https://api.yelp.com/v3/businesses/search', {headers: tokenHeader, params: config})
    .then(resp => {
      return resp.data.businesses //can make the call to google here if trying to get google info for all
      //or use the yelpID later to look them up one by one
      // return {
      //   places: resp.data.businesses,
      //   averageRating: getAverageRating(resp.data.businesses)
      // };
    })
    .catch(err => {
      console.log(err)
    })
};

const getDetailsWithId = (yelpId) => { //not sure this has any additional details
  return axios.get(`https://api.yelp.com/v3/businesses/${yelpId}`, {headers: tokenHeader})
    .then(resp => resp.data)
    .catch(err => {console.log(err)})
}

const getReviewExcerpts = (yelpId) => {
  return axios.get(`https://api.yelp.com/v3/businesses/${yelpId}/reviews`, {headers: tokenHeader})
    .then(resp => resp.data.reviews)
    .catch(err => {console.log(err)})
}

const getAverageRating = (places) => { //same as yelp but different from foursquare
  const totalRatings = places.reduce((ratings, place) => {
    return ratings + place.rating;
  }, 0);
  const avgRating = totalRatings / places.length;
  return Number((Math.round(avgRating * 100)/ 100).toFixed(1));
};

const googleTypesToYelpCategories = {
  restaurant: 'restaurants', //build this out further for other cats, though there's not a neat mapping
};

const convertReactQueryForApi = (userQuery) => {
  let yelpQuery = {};
  yelpQuery.term = userQuery.keyword;
  yelpQuery[googleTypesToYelpCategories[userQuery.type]] = userQuery.type;
  return yelpQuery;
};

exports.searchPlacesByCoords = searchPlacesByCoords;
exports.mapQuery = convertReactQueryForApi;
exports.getDetailsWithId = getDetailsWithId;
exports.getReviewExcerpts = getReviewExcerpts;