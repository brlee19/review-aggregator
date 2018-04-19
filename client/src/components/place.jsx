import React from 'react';

class Place extends React.Component {
  
  constructor(props) {
    super(props);
    // this.state = {}; this.props.location.places would be the places
  }

  render() {
    return(
      <li>
      {this.props.place.name}
      <br></br>
      {this.props.place.rating}
      </li>
    )
  }

}

export default Place;