import React from 'react';
import {withRouter} from 'react-router-dom';
import PlaceOverview from './placeOverview.jsx';

const listStyle = {
  'listStyleType': 'none'
}

class Places extends React.Component {
  
  constructor(props) {
    super(props);
    // this.state = {}; this.props.location.places would be the places
  }

  render() {
    return(
      <div>
        <h1>Click on a card to get more details!</h1>
        {/*PlaceDetails component would go here...initially blank*/}
        <ul style={listStyle}>
        {this.props.location.places.map(place => <PlaceOverview place={place} key={place.id}/>)}
        </ul>
      </div>
    )
  }

}

export default withRouter(Places);