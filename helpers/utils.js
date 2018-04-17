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
				.then((resp) => {console.log('resp was', resp.data)})
				.catch((err) => {console.log(err)}); //is this catch necessary?
		})
		.catch(err => console.log(err));  
}

const convertGoogleAddressToYelp = (googleAddress) => {
  // const googleAddress = testGoogleAddress;
	let yelpAddress = {};

  const streetNumber = googleAddress.reduce((result, component) => {
    if (component.types.includes('street_number')) return component.long_name;
    return result;
  }, '');

  const streetName = googleAddress.reduce((result, component) => {
    if (component.types.includes('route')) return component.long_name;
    return result;
	}, '');
	
	yelpAddress.address1 = `${streetNumber} ${streetName}`;

  yelpAddress.city = googleAddress.reduce((result, component) => {
    if (component.types.includes('locality')) return component.long_name;
    return result;
  }, '');

  yelpAddress.state = googleAddress.reduce((result, component) => {
    if (component.types.includes('administrative_area_level_1')) return component.short_name; //states in the US, may not work intl
    return result;
	}, '');
	
	yelpAddress.country = googleAddress.reduce((result, component) => {
		if (component.types.includes('country')) return component.short_name;
		return result;
	}, '');

  yelpAddress.zip_code = googleAddress.reduce((result, component) => {
    if (component.types.includes('postal_code')) return component.long_name;
    return result;
  }, '');

  return yelpAddress;
};

exports.getYelpDetailsFromGoogleId = getYelpDetailsFromGoogleId;
exports.convertGoogleAddressToYelp = convertGoogleAddressToYelp;