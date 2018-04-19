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
      selectedPlace: ''
    };
    this.getDetails = this.getDetails.bind(this);
  }

  getDetails(yelpId) {
    console.log('yelpId is', yelpId);
    axios.post('/details', {id: yelpId})
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err)); 
  }

  //give placeOverview a clickHandler that changes the selectedPlace and makes the axios call

  render() {
    return(
      <div>
        <h1>Click on a card to get more details!</h1>
        {/*PlaceDetails component would go here...only render if state not blank*/}
        <PlaceDetails place={this.state.selectedPlace}/>
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