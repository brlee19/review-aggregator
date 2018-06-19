import React from 'react';

const detailsStyle = {
  display: 'inline-block',
  width: '100%',
	borderWidth: '1px 1px',
	borderStyle: 'solid',
	borderColor: 'green',
	margin: '5px auto 5px auto',
	fontFamily: 'Monospace',
	fontSize: 'xx-large',
	textAlign: 'left'
};

const smaller = {
	margin: '5px auto 5px auto',
	fontFamily: 'Monospace',
	fontSize: 'large',
  textAlign: 'left',
  color: 'blue'
};

const medium = {
	margin: '5px auto 5px auto',
	fontFamily: 'Monospace',
	fontSize: 'x-large',
  textAlign: 'left',
  color: 'blue'
};

const PlaceDetails = ({place}) => {
  return (
  <li style={detailsStyle}>
    <h2>{place.name}</h2>
    <div style={smaller}>{place.description}</div>
    {place.photoUrl ? (<img src={place.photoUrl}></img>) : (<span></span>)}
    <br></br>
    {place.address} ({place.distance})
    <br></br>
    {place.phone}
    {place.hours ? (
      <div>
        <h4> hours </h4> 
        {place.hours.map((hour, i) => {
          return <div style={smaller} key={i}>{hour}</div>
        })}
      </div>): <span></span>}

    <h4>stats</h4>
      <div style={medium}><b>reviewcanoe value ratio: {place.ratingToPrice}</b></div>
      <div style={smaller}><b>average rating (out of 5): {place.averageRating}</b></div>
      {Object.entries(place.ratings).map((rating, i) => <span key={i} style={smaller}>{rating[0]}:  {rating[1]}  ||  </span>)}
      <div style={smaller}><b>average price (out of 4): {place.averagePrice}</b></div>
      {Object.entries(place.prices).map((price, i) => <span key={i} style={smaller}>{price[0]}:  {price[1]}  ||  </span>)}

    <h4>links</h4>
    <div style={smaller}>
      <span>{place.menu ? <span><a href={place.menu} target="_blank">Menu</a>  ||  </span>: <span></span>}</span>
      <span>{place.mobileMenu ? <span><a href={place.mobileMenu} target="_blank">Menu (mobile)</a>  ||  </span>: <span></span>}</span>
      <span>{place.deliveryUrl ? <span><a href={place.deliveryUrl} target="_blank">Order delivery</a>  ||  </span>: <span></span>}</span>
      <span>{place.url ? <span><a href={place.url} target="_blank">Restaurant Website</a>  ||  </span>: <span></span>}</span>
      <span>{place.foursquareUrl ? <span><a href={place.foursquareUrl} target="_blank">Menu</a>  ||  </span>: <span></span>}</span>
    </div>

    <h4>foursquare tips</h4>
    <div style={smaller}>
      {place.tips ? place.tips.map((tip, i) => <div key={i}>{tip}</div>) : <span></span>}
    </div>

    <h4>yelp reviews</h4>
    <div style={smaller}>
      {place.yelpReviews ? place.yelpReviews.map((review, i) => {
        return (<div key={i}>
                  {review.rating} stars: {review.text}
                  <a href={review.link} target="_blank"> read the full review on yelp</a>
                </div>
          )
      }) : <span></span>}
    </div>
  </li>
  );
}

export default PlaceDetails;