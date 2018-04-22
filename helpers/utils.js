const organizePlacesData = ({foursquareDetails, googleDetails, yelp}) => {
  //organized data from APIs
  const reviewSiteData = { //functions will return undefined if foursquareDetails, etc. are missing
    name: getProp(yelp, 'name'),
    address: getAddress(yelp),
    distance: getDistanceInMiles(yelp),
    phone: getProp(yelp, 'display_phone'),
    photoUrl: getPhoto(foursquareDetails),
    description: getProp(foursquareDetails, 'description'),
    hours: getHours(foursquareDetails), //array
    menu: getNestedProp(foursquareDetails, 'menu', 'url'),
    mobileMenu: getNestedProp(foursquareDetails, 'menu', 'mobileUrl'),
    url: getProp(foursquareDetails, 'url'),
    deliveryUrl: getNestedProp(foursquareDetails, 'delivery', 'url'),
    tips: getTips(foursquareDetails), //array
    foursquareId: getProp(foursquareDetails, 'id'),
    foursquareRating: getProp(foursquareDetails, 'rating'),
    foursquarePrice: getNestedProp(foursquareDetails, 'price', 'tier'),
    foursquareUrl: getProp(foursquareDetails, 'shortUrl'),
    googleId: getProp(googleDetails, 'place_id'),
    googleRating: getProp(googleDetails, 'rating'),
    googlePrice: getProp(googleDetails, 'price_level'),
    yelpId: getProp(yelp, 'id'),
    yelpPrice: getNestedProp(yelp, 'price', 'length'),
    yelpReviews: getYelpReviews(yelp),
    yelpRating: getProp(yelp, 'rating'),
  };

  //new calculations based on API data
  reviewSiteData.averageRating = calculateAverageReview(reviewSiteData);
  reviewSiteData.averagePrice = calculateAveragePrice(reviewSiteData);
  reviewSiteData.ratingToPrice = calculateRatingToPrice(reviewSiteData);

  return reviewSiteData;
};

const getProp = (details, prop) => {
  return !!details ? details[prop] : undefined; //only works for props one level deep
};

const getNestedProp = (details, topProp, nestedProp) => { //props two levels deep
  return !!details && details[topProp] ? details[topProp][nestedProp] : undefined;
};

const getAddress = ({location}) => { //yelp data will always exist bc initial api call is to yelp
  return (!!location && !!location.display_address && location.display_address.length) ? (
    location.display_address.join(', ')
  ) : undefined;
};

const getDistanceInMiles = ({distance}) => {
  const miles = (Number(distance) * 0.000621371).toFixed(2);
  return `${miles} miles away`;
}

const getPhoto = (foursq) => {
  return (!!foursq && !!foursq.bestPhoto) ? (
    `${foursq.bestPhoto.prefix}480x280${foursq.bestPhoto.suffix}`
  ) : undefined;
};

const getHours = (foursq) => {
  return (!!foursq && !!foursq.hours && foursq.hours.timeframes.length) ? (
    foursq.hours.timeframes.map(timeframe => {
      return `${timeframe.days} : ${timeframe.open.map(openTime => openTime.renderedTime)}`
    })
   ) : undefined;
};

const getTips = (foursq) => {
  return (!!foursq && !!foursq.tips && foursq.tips.groups && foursq.tips.groups.length
    && !!foursq.tips.groups[0].items) ? (
      foursq.tips.groups[0].items.map(tip => tip.text)
    ) : undefined;
};

const getYelpReviews = (yelp) => {
  return (!!yelp && !!yelp.reviews && yelp.reviews.length) ? (
    yelp.reviews.map(review => {
      return {
        author: review.user.name,
        rating: review.rating,
        text: review.text,
        link: review.url
      }
    })
  ) : undefined;
};

const calculateAverageReview = ({googleRating, foursquareRating, yelpRating}) => {
  const adjFoursqRating = foursquareRating ? foursquareRating / 2 : undefined; //foursquare rating is out of 10 not 5
  const ratings = [googleRating, adjFoursqRating, yelpRating].filter(rating => !!rating);
  const avgRating = ratings.reduce((accum, rating) => {
    return accum + rating
  }, 0) / ratings.length;
  return Number(avgRating.toFixed(1));
};

const calculateAveragePrice = ({googlePrice, foursquarePrice, yelpPrice}) => {
  const prices = [googlePrice, foursquarePrice, yelpPrice].filter(price => !!price);
  const avgPrice = prices.reduce((accum, price) => {
    return accum + price;
  }, 0) / prices.length;
  return Number(avgPrice.toFixed(1));
};

const calculateRatingToPrice = ({averageRating, averagePrice}) => {
  return Number((averageRating / averagePrice).toFixed(1));
}

exports.organizePlacesData = organizePlacesData;