const axios = require('axios');
const google = require('./google.js');
const yelp = require('./yelp.js');
const yelpToken = require('../config.js').yelp_api_key;
const googleKey = require('../config.js').google_api_key;

//address converters for converting from google ID to yelp
const extractGoogleAddressComponentLong = (type) => {
  return googleAddress.reduce((result, component) => {
    return (component.types.includes(type)) ? component.long_name : result;
  });
};

const extractGoogleAddressComponentShort = (type) => {
  return googleAddress.reduce((result, component) => {
    return (component.types.includes(type)) ? component.short_name : result;
  });
};

const convertGoogleAddressToYelp = (googleAddress) => {
  return {
    address1: `${extractGoogleAddressComponentLong('street_number')} ${extractGoogleAddressComponentLong('route')}`,
    city: extractGoogleAddressComponentLong('locality'),
    state: extractGoogleAddressComponentShort('administrative_area_level_1'),
    country: extractGoogleAddressComponentShort('country'),
    zip_code: extractGoogleAddressComponentLong('postal_code')
  };
};

const getYelpDetailsFromGoogleId = (googleId) => {
  return google.getPlaceDetails(googleId) //seems duplicative? the app already has access to all the google details at this point
    .then((details) => {
			// console.log('details are', details.address_components);
			const yelpAddress = convertGoogleAddressToYelp(details.address_components);
      const params = {
        name: details.name,
				address1: yelpAddress.address1,
				city: yelpAddress.city,
				state: yelpAddress.state,
				country: yelpAddress.country,
				zip_code: yelpAddress.zip_code
			};
			const tokenHeader = {'Authorization': 'Bearer ' + yelpToken};
			return axios.get('https://api.yelp.com/v3/businesses/matches/best', {headers: tokenHeader, params: params})
				.then((resp) => {
          // console.log('yelp id is', resp.data.businesses[0].id);
          return resp.data.businesses[0].id; //TODO: save in DB
        })
				.catch((err) => {console.log(err)}); //is this catch necessary?
    })
    .then((yelpId) => {
      console.log('reached next promise chain, yelpid is', yelpId)
      const tokenHeader = {'Authorization': 'Bearer ' + yelpToken};
      return axios.get(`https://api.yelp.com/v3/businesses/${yelpId}`, {headers: tokenHeader})
        .then((resp) => {return resp.data})
        .catch((err) => console.log(err))
    })
		.catch(err => console.log(err));  
};

//convert yelp ID to google place
const getGoogleDetailsFromYelpId = (yelpId) => {
  return yelp.getDetailsWithId(yelpId)
    .then((details) => {
      console.log('details are', details);
      const params = {
        location: `${details.coordinates.latitude},${details.coordinates.longitude}`,
        radius: 10, //should be able to be pretty precise given the coordinates from yelp
        type: 'restaurant', //hardcoded for now
        keyword: details.name,
        key: googleKey
      };
      return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', {params: params})
    })
    .then(resp => {
      return resp.data.results; //instead of returning, should check yelp for these same places??
    })
    .catch(err => console.log(err));
}
//review results standardizers

const detectReviewSite = (result) => {
  if (result.hasOwnProperty('place_id') || result.hasOwnProperty('geometry')) return 'google';
  else if (result.hasOwnProperty('alias') || result.hasOwnProperty('alias')) return 'yelp';
  else throw 'Unable to conform search result, are you sure it\'s a yelp or google result?'
};

const conformSearchResult = (result) => { //type should still be in react state
  //instead of conforming, consider creating a new search result with info from G, Y, and 4
  //for example, FourSquare has menu links and tips
  let conformedResult = {
    reviewSite: detectReviewSite(result),
    id: null,
    lat: null,
    long: null,
    address: null,
    name: null,
    phoneNumber: null,
    imageUrl: null,
    reviewUrl: null,
    rating: null,
    reviewCount: null,
    priceLevel: {price: null, max: null},
  }

  if (conformedResult.reviewSite === 'google') {
    conformedResult.id = result.place_id;
    conformedResult.lat = result.geometry.location.lat;
    conformedResult.long = result.geometry.location.lng;
    conformedResult.address = result.vicinity;
    conformedResult.name = result.name;
    conformedResult.rating = result.rating;
    conformedResult.priceLevel = {price: result.price_level || null, max: 4};
  }

  if (conformedResult.reviewSite === 'yelp') {
    conformedResult.id = result.id;
    conformedResult.lat = result.coordinates.latitude;
    conformedResult.long = result.coordinates.longitude;
    conformedResult.address = result.location.display_address.join(', ');
    conformedResult.name = result.name;
    conformedResult.phoneNumber = result.display_phone;
    conformedResult.imageUrl = result.image_url;
    conformedResult.reviewUrl = result.url;
    conformedResult.rating = result.rating;
    conformedResult.reviewCount = result.review_count;
    conformedResult.priceLevel = {
      price: result.price ? result.price.length : 'n/a',
      max: 4
    };
  }
  //add other possibilities here
  return conformedResult;
};

const conformSearchResults = (results) => {
  return results.map(result => conformSearchResult(result));
};

//cross reference places from one review site to the other

exports.getYelpDetailsFromGoogleId = getYelpDetailsFromGoogleId;
exports.convertGoogleAddressToYelp = convertGoogleAddressToYelp;
exports.conformSearchResults = conformSearchResults;
exports.getGoogleDetailsFromYelpId = getGoogleDetailsFromYelpId;