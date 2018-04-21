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
}

const smaller = {
	margin: '5px auto 5px auto',
	fontFamily: 'Monospace',
	fontSize: 'large',
  textAlign: 'left',
  color: 'blue'
}

class PlaceDetails extends React.Component {
  
  constructor(props) { //need to render a lot of details based on whether the details exist
    super(props);
    console.log(props.place);
  }

  render() {
    return (
      <li style={detailsStyle}>
        <pre>{}</pre>
        <h2>{this.props.place.baseData.name}</h2>
        <img src={this.props.place.foursquare.bestPhoto.prefix +
                   '480x280' +
                   this.props.place.foursquare.bestPhoto.suffix}>
        </img>
        <br></br>
        {this.props.place.baseData.location.display_address.join(', ')}
        <br></br>
        {this.props.place.baseData.display_phone}
        {(this.props.place.foursquare.hours && this.props.place.foursquare.hours.timeframes.length) ? (
          <div>
          <h4>hours</h4>
          <div style={smaller}>
            {this.props.place.foursquare.hours.timeframes.map((timeframe, i) => {
              return <div key={i}>{timeframe.days} : {timeframe.open.map((openTime, j) => <span key={j}>{openTime.renderedTime}  </span>)}</div>
            })}
          </div>
          </div>
        ) : <span></span>}
        <h4>stats</h4>
        <div style={smaller}>
          Yelp Rating: {this.props.place.baseData.rating || 'not available'} out of 5  ||
          Google Rating: {this.props.place.google.rating || 'not available'} out of 5  ||
          Foursquare Rating: {this.props.place.foursquare.rating ? `${this.props.place.foursquare.rating} out of 10` : 'not available'}  
        </div>
        <div style={smaller}>
          Yelp Price: {this.props.place.baseData.price.length || 'not available'}  ||
          Google Price: {this.props.place.google.price_level || 'not available'}  ||
          Foursquare Price: {this.props.place.foursquare.price.tier || 'not available'}
        </div>

        <h4>links</h4>
        <div style={smaller}>
          {this.props.place.foursquare.menu ? (
            <span><a href={this.props.place.foursquare.menu.mobileUrl} target="_blank">Menu Mobile</a>  || </span>
          ): <div></div>}
          {this.props.place.foursquare.menu ? (
            <span><a href={this.props.place.foursquare.menu.url} target="_blank">Menu</a>  || </span>
          ): <div></div>}
          <a href={this.props.place.foursquare.url} target="_blank">Restaurant Home Page</a>  ||
          <a href={this.props.place.foursquare.shortUrl} target="_blank">Foursquare Page</a>  ||
          <a href={this.props.place.baseData.url} target="_blank">Yelp Page</a> 
          {this.props.place.foursquare.delivery ? <span> ||  <a href={this.props.place.foursquare.delivery.url} target="_blank">Order Delivery</a></span> : <span></span>}
        </div>

        <h4>foursquare tips</h4>
        {this.props.place.foursquare.tips.groups[0].items.map((tip, i) => <div style={smaller} key={i}>{tip.text} </div>)}
        <h4>yelp reviews</h4>
        {this.props.place.yelpReviews.map((review, i) => {
          return (<div style={smaller} key={i}>
                    <div>{review.rating} stars: {review.text} </div>
                    <a href={review.url} target="_blank">Read the full review</a>
                  </div>)
        })}
      </li>
    )
  }

}

export default PlaceDetails;