import React from 'react';

class Place extends React.Component {
  
  constructor(props) {
    super(props);
    // this.state = {}; this.props.location.places would be the places
    // this.getLiStyle = this.getLiStyle.bind(this);
  }

  // getLiStyle(site) {
  //   if (site === 'google') {
  //     return {
  //       color: 'red',
  //       // 'list-style-type': 'none',
  //       display: 'inline-block',
  //       float: 'left'
  //     }
  //   } else if (site === 'yelp') {
  //     return {
  //       color: 'blue',
  //       display: 'inline',
  //       float: 'right'
  //     }
  //   }
  // }

  render() {
    return(
      <li>
      <br></br>
      {this.props.place.name}
      <br></br>
      {this.props.place.rating}
      <br></br>
      </li>
    )
  }

}

export default Place;