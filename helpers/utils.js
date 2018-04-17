const axios = require('axios');
const google = require('./google.js');
const yelp = require('./yelp.js');
const yelpToken = require('../config.js').yelp_api_key;

//functions that require both google and yelp helpers
const getYelpDetailsFromGoogleId = (googleId) => {
  return google.getPlaceDetails(googleId)
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
				.then((resp) => {return resp.data})
				.catch((err) => {console.log(err)}); //is this catch necessary?
		})
		.catch(err => console.log(err));  
}

const convertGoogleAddressToYelp = (googleAddress) => {

  const extractGoogleAddressComponentLong = (type) => {
    return googleAddress.reduce((result, component) => {
      return (component.types.includes(type)) ? component.long_name : result;
    });
  }

  const extractGoogleAddressComponentShort = (type) => {
    return googleAddress.reduce((result, component) => {
      return (component.types.includes(type)) ? component.short_name : result;
    });
  }

  return {
    address1: `${extractGoogleAddressComponentLong('street_number')} ${extractGoogleAddressComponentLong('route')}`,
    city: extractGoogleAddressComponentLong('locality'),
    state: extractGoogleAddressComponentShort('administrative_area_level_1'),
    country: extractGoogleAddressComponentShort('country'),
    zip_code: extractGoogleAddressComponentLong('postal_code')
  }
};

exports.getYelpDetailsFromGoogleId = getYelpDetailsFromGoogleId;
exports.convertGoogleAddressToYelp = convertGoogleAddressToYelp;