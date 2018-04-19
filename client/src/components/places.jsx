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
      baseData: '', //base yelp of the selected place
      yelpReviews: '',
      google: '',
      foursquare: ''
    };
    this.getDetails = this.getDetails.bind(this);
  }

  getDetails(placeData) {
    axios.post('/details', placeData)
      .then((resp) => {
        // console.log(resp.data);
        const selectedPlace = this.props.location.places.filter(place => place.id === placeData.id)[0];
        console.log({
          baseData: selectedPlace,
          yelpReviews: resp.data.yelpReviews,
          google: resp.data.googleDetails,
          foursquare: resp.data.foursquareDetails
        });
        this.setState({
          baseData: selectedPlace,
          yelpReviews: resp.data.yelpReviews,
          google: resp.data.googleDetails,
          foursquare: resp.data.foursquareDetails
        });
      })
      .catch((err) => console.log(err)); 
  }

  //give placeOverview a clickHandler that changes the selectedPlace and makes the axios call

  render() {
    return(
      <div>
        {this.state.baseData ? <div></div> : <h1>Click on a card to get more details!</h1>}
        <pre>{JSON.stringify(this.state)}</pre>
        {/*PlaceDetails component would go here...only render if state not blank*/}
        <PlaceDetails place={this.state}/>
        <ul style={listStyle}>
        {this.props.location.places.map(place => {
          return <PlaceOverview place={place} key={place.id} handleClick={this.getDetails}/>
        })}
        </ul>
      </div>
    )
  }

}

export default withRouter(Places);