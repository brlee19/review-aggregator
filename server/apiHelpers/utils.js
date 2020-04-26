const organizePlacesData = ({ foursquareDetails, googleDetails, yelp }) => {
  const reviewSiteData = {
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
    foursquareUrl: getProp(foursquareDetails, 'shortUrl'),
    googleId: getProp(googleDetails, 'place_id'),
    yelpId: getProp(yelp, 'id'),
    yelpReviews: getYelpReviews(yelp),
    ratings: {
      google: getProp(googleDetails, 'rating'),
      yelp: getProp(yelp, 'rating'),
      foursquare: getProp(foursquareDetails, 'rating'),
    },
    prices: {
      google: getProp(googleDetails, 'price_level'),
      yelp: getNestedProp(yelp, 'price', 'length'),
      foursquare: getNestedProp(foursquareDetails, 'price', 'tier'),
    },
  };

  //new calculations based on API data
  reviewSiteData.averageRating = calculateAverageReview(reviewSiteData.ratings);
  reviewSiteData.averagePrice = calculateAveragePrice(reviewSiteData.prices);
  reviewSiteData.ratingToPrice = calculateRatingToPrice(reviewSiteData);

  return reviewSiteData;
};

const getProp = (details, prop) => {
  return !!details ? details[prop] : undefined; //only works for props one level deep
};

const getNestedProp = (details, topProp, nestedProp) => {
  //props two levels deep
  return !!details && details[topProp]
    ? details[topProp][nestedProp]
    : undefined;
};

const getAddress = ({ location }) => {
  return !!location &&
    !!location.display_address &&
    location.display_address.length
    ? location.display_address.join(', ')
    : undefined;
};

const getDistanceInMiles = ({ distance }) => {
  const miles = (Number(distance) * 0.000621371).toFixed(2);
  return `${miles} miles away`;
};

const getPhoto = (foursq) => {
  return !!foursq && !!foursq.bestPhoto
    ? `${foursq.bestPhoto.prefix}480x280${foursq.bestPhoto.suffix}`
    : undefined;
};

const getHours = (foursq) => {
  return !!foursq && !!foursq.hours && foursq.hours.timeframes.length
    ? foursq.hours.timeframes.map((timeframe) => {
        return `${timeframe.days} : ${timeframe.open.map(
          (openTime) => openTime.renderedTime
        )}`;
      })
    : undefined;
};

const getTips = (foursq) => {
  return !!foursq &&
    !!foursq.tips &&
    foursq.tips.groups &&
    foursq.tips.groups.length &&
    !!foursq.tips.groups[0].items
    ? foursq.tips.groups[0].items.map((tip) => tip.text)
    : undefined;
};

const getYelpReviews = (yelp) => {
  return !!yelp && !!yelp.reviews && yelp.reviews.length
    ? yelp.reviews.map((review) => {
        return {
          author: review.user.name,
          rating: review.rating,
          text: review.text,
          link: review.url,
        };
      })
    : undefined;
};

const calculateAverageReview = ({ google, foursquare, yelp }) => {
  const adjFoursqRating = foursquare ? foursquare / 2 : undefined; //foursquare rating is out of 10 not 5
  const ratings = [google, adjFoursqRating, yelp].filter((rating) => !!rating);
  const avgRating =
    ratings.reduce((accum, rating) => {
      return accum + rating;
    }, 0) / ratings.length;
  return Number(avgRating.toFixed(1));
};

const calculateAveragePrice = ({ google, foursquare, yelp }) => {
  const prices = [google, foursquare, yelp].filter((price) => !!price);
  const avgPrice =
    prices.reduce((accum, price) => {
      return accum + price;
    }, 0) / prices.length;
  return Number(avgPrice.toFixed(1));
};

const calculateRatingToPrice = ({ averageRating, averagePrice }) => {
  return Number((averageRating / averagePrice).toFixed(1));
};

exports.organizePlacesData = organizePlacesData;
