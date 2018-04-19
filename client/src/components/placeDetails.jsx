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
    console.log(props.place);
    // this.state = {}; this.props.location.places would be the places
    // this.getLiStyle = this.getLiStyle.bind(this);
  }

  render() {
    return this.props.place.baseData ? 
    (
      <div>
        <pre>{JSON.stringify(this.props.place)}</pre>
        <h2>ALL THE DETAILS</h2>
        {this.props.place.baseData.name}
        <br></br>
        {this.props.place.baseData.location.display_address[0]}
        {/*as long as place's props only go one deep, everything will be blank until something is selected*/}
      </div>
    ) :
    (
      <div></div>
    )
  }

}

export default PlaceDetails;