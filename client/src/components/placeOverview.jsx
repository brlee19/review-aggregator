import React from 'react';
//component only is aware of yelp info

const overviewStyle = {
	display: 'inline-block',
	clear: 'both',
	float: 'left',
	paddingLeft: '10px',
	paddingRight: '10px',
	borderWidth: '1px 1px',
	borderStyle: 'solid',
	borderColor: 'blue',
	margin: '5px auto 5px auto',
	fontFamily: 'monospace',
	fontSize: 'x-large',
	textAlign: 'left'
}

class PlaceOverview extends React.Component {
  
  constructor(props) {
    super(props);
    // this.state = {}; this.props.location.places would be the places
    // this.getLiStyle = this.getLiStyle.bind(this);
  }

  render() {
    return(
      <li style={overviewStyle}
          onClick={
            () => this.props.handleClick({
              id: this.props.place.id,
              coordinates: this.props.place.coordinates,
              name: this.props.place.name
            })
          }
      >
      <br></br>
      <pre>{/*JSON.stringify(this.props.place)*/}</pre>
      <strong>{this.props.place.name}</strong>
      <br></br>
      {this.props.place.display_address}
      <br></br>
      {this.props.place.display_phone}
      <br></br>
      {this.props.place.price}
      <br></br>
      Yelp Rating: {this.props.place.rating} from {this.props.place.review_count} reviews
      <br></br>
      <a href={this.props.place.url} target="_blank">Go to the Yelp review page!</a>
      </li>
    )
  }

}

export default PlaceOverview;