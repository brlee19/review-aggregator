import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
// import Places from './places.jsx';

class Search extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { //keys match google API cats except for location
      type: 'restaurant',
      keyword: 'korean',
      address: '369 Lexington Avenue, New York NY', //add something so you can't search without this??
      radius: '10000' //convert to number later
    };

    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  search() {
    axios.post('/search', {data: this.state})
      .then((resp) => {
        this.props.history.push({
          pathname: '/places',
          places: resp.data,
          userQuery: this.state
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return(
      <div>
        <h2>Search for reviews!</h2>

        <select name="type" onChange={this.handleChange}>
          <option value="restaurant">Restaurants</option>
          <option value="restaurant">Hotels--coming soon!</option>
          <option value="restaurant">This menu actually picks restaurants no matter what you actually pick</option>
        </select>

        <input size="42" name="keyword" placeholder='Enter details for your search, like "sushi"' onChange={this.handleChange}/>

        <input size="42" name="address" placeholder='Enter an address to search near' onChange={this.handleChange}/>

        <select name="radius" onChange={this.handleChange} defaultValue={10000}>
          <option value="500" type="number">500 meters</option>
          <option value="1000" type="number">1000 meters</option>
          <option value="10000" type="number">10 km</option>
          <option value="40000" type="number">40 km</option>
        </select>

        <button onClick={this.search}>Search!</button>
      </div>
    )
  }

}

export default withRouter(Search);