const id =
  process.env.foursquare_id || require('../../config.js').foursquare_id;
const secret =
  process.env.foursquare_secret || require('../../config.js').foursquare_secret;
const axios = require('axios');

const getMatchingPlaceId = (coords, query) => {
  const qs = {
    client_id: id,
    client_secret: secret,
    name: query.name,
    ll: `${JSON.parse(coords).latitude},${JSON.parse(coords).longitude}`,
    limit: 1,
    intent: 'match',
    phone: query.phone,
    v: '20180323',
  };
  return axios
    .get(`https://api.foursquare.com/v2/venues/search`, { params: qs })
    .then((resp) => {
      return resp.data.response.venues[0].id;
    })
    .catch((err) => console.log('Cannot find matching Foursquare venue id'));
};

const getPlaceDetails = (foursquareId) => {
  const qs = {
    VENUE_ID: foursquareId,
    client_id: id,
    client_secret: secret,
    v: '20180323',
  };
  return axios
    .get(`https://api.foursquare.com/v2/venues/${foursquareId}?`, {
      params: qs,
    })
    .then((resp) => resp.data.response.venue)
    .catch((err) => console.log('Canont get place details from Foursquare'));
};

exports.getMatchingPlaceId = getMatchingPlaceId;
exports.getPlaceDetails = getPlaceDetails;
