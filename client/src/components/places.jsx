import React from 'react';
import {withRouter} from 'react-router-dom';
import Place from './place.jsx';

class Places extends React.Component {
  
  constructor(props) {
    super(props);
    // this.state = {}; this.props.location.places would be the places
  }

  render() {
    return(
      <div>
        <h1>YOU ARE NOW IN PLACES</h1>
        <ul>
        {this.props.location.places.map(place => <Place place={place} key={place.id}/>)}
        </ul>
      </div>
    )
  }

}

export default withRouter(Places);