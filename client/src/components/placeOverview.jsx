import React from 'react';

const overviewStyle = {
	display: 'inline-block',
	clear: 'both',
	float: 'left',
	paddingLeft: '10px',
	paddingRight: '10px',
	borderWidth: '1px 1px',
	borderStyle: 'solid',
	borderColor: 'rgb(235, 238, 244)',
	margin: '5px auto 5px auto',
	fontFamily: 'Barlow Condensed',
	fontSize: 'xx-large',
	textAlign: 'center'
}

class PlaceOverview extends React.Component {
  
  constructor(props) {
    super(props);
    // this.state = {}; this.props.location.places would be the places
    // this.getLiStyle = this.getLiStyle.bind(this);
  }

  render() {
    return(
      <li style={overviewStyle}>
      <br></br>
      {this.props.place.name}
      <br></br>
      Yelp Rating: {this.props.place.rating}
      <br></br>
      </li>
    )
  }

}

export default PlaceOverview;