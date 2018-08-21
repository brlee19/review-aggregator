import React from 'react';
import { Card, Paper } from 'material-ui';

const overviewStyle = {
	display: 'inline-block',
	clear: 'both',
	float: 'left',
	paddingLeft: '10px',
	paddingRight: '10px',
	borderWidth: '1px 1px',
	borderStyle: 'solid',
	borderColor: 'blue',
	margin: '5px auto 5px auto',
	fontFamily: 'monospace',
	fontSize: 'x-large',
	textAlign: 'left'
}

class PlaceOverview extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Card>
      <li style={overviewStyle}
          onClick={
            () => this.props.handleClick(this.props.place)
          }
      >
      <br></br>
      <strong>{this.props.place.name}</strong>
      <br></br>
      {this.props.place.location.display_address.join(', ')}
      <br></br>
      {this.props.place.display_phone}
      <br></br>
      {this.props.place.price}
      <br></br>
      Yelp Rating: {this.props.place.rating} from {this.props.place.review_count} reviews
      <br></br>
      <a href={this.props.place.url} target="_blank">Go to the Yelp review page!</a>
      </li>
      </Card>
    )
  }

}

export default PlaceOverview;