import React from 'react';
import { withRouter } from 'react-router-dom';
import PlaceOverview from './placeOverview.jsx';
import PlaceDetails from './placeDetails.jsx';
import axios from 'axios';
import { Paper } from 'material-ui';

const listStyle = {
  'listStyleType': 'none'
}

class Places extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      details: ''
    };
    this.getDetails = this.getDetails.bind(this);
  }

  getDetails(placeData) {
    axios.get('/details', {params: placeData})
      .then((resp) => {
        console.log('data from server is', resp.data);
        this.setState({
          selectedId: resp.data.yelpId,
          details: resp.data
        });
      })
      .catch((err) => console.log(err)); 
  }

  render() {
    return(
      <Paper>
        {this.state.selectedId ? null : <h1>Click on a card to get all the details!</h1>}
        <ul style={listStyle}>
        {this.props.location.places.map(place => {
          return place.id === this.state.selectedId ? (
            <PlaceDetails place={this.state.details} key={this.state.selectedId}/>) : (  
            <PlaceOverview place={place} key={place.id} handleClick={this.getDetails}/>)
        })}
        </ul>
      </Paper>
    )
  }

}

export default withRouter(Places);