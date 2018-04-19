import React from 'react';
//component only is aware of yelp info

const overviewStyle = {
	borderWidth: '1px 1px',
	borderStyle: 'solid',
	borderColor: 'green',
	margin: '5px auto 5px auto',
	fontFamily: 'Barlow Condensed',
	fontSize: 'xx-large',
	textAlign: 'left'
}

class PlaceDetails extends React.Component {
  
  constructor(props) {
    super(props);
    // this.state = {}; this.props.location.places would be the places
    // this.getLiStyle = this.getLiStyle.bind(this);
  }

  render() {
    return(
      <div>
        <h2>PLACE DETAILS YO</h2>
        {this.props.place.name}
        {/*as long as place's props only go one deep, everything will be blank until something is selected*/}
      </div>
    )
  }

}

export default PlaceDetails;