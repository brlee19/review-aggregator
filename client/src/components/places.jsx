import React from 'react';
import {withRouter} from 'react-router-dom';
import PlaceOverview from './placeOverview.jsx';
import PlaceDetails from './placeDetails.jsx';
import axios from 'axios';

const listStyle = {
  'listStyleType': 'none'
}

class Places extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      baseData: '', //base yelp data of the selected place
      yelpReviews: '',
      google: '',
      foursquare: ''
    };
    this.getDetails = this.getDetails.bind(this);
  }

  getDetails(placeData) {
    axios.post('/details', placeData) //now sending entire place data to server
      .then((resp) => {
        // console.log(resp.data);
        const selectedPlace = this.props.location.places.filter(place => place.id === placeData.id)[0];
        console.log({
          yelpOGData: placeData,
          yelpReviews: resp.data.yelpReviews,
          google: resp.data.googleDetails,
          foursquare: resp.data.foursquareDetails
        });
        this.setState({
          baseData: placeData,
          yelpReviews: resp.data.yelpReviews,
          google: resp.data.googleDetails,
          foursquare: resp.data.foursquareDetails
        });
      })
      .catch((err) => console.log(err)); 
  }

  render() {
    return(
      <div>
        {this.state.baseData ? <div></div> : <h1>Click on a card to get all the details!</h1>}
        <pre>{JSON.stringify(this.props.location.places)}</pre>
        <ul style={listStyle}>
        {this.props.location.places.map(place => {
          return place.id === this.state.baseData.id ? ( /* checking to see if this place has been selected */
            <PlaceDetails place={this.state} key={place.id}/>) : (  
            <PlaceOverview place={place} key={place.id} handleClick={this.getDetails}/>)
        })}
        </ul>
      </div>
    )
  }

}

export default withRouter(Places);