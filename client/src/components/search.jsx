import React from 'react';
import {withRouter} from 'react-router-dom';

class Search extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      category: 'restaurant',
      query: '',
      location: '',
      radius: '' //convert to number later
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    return(
      <div>
        <h2>SEARCH COMPONENT</h2>
        <pre>{JSON.stringify(this.state)}</pre>

        <select name="category" onChange={this.handleChange}>
          <option value="restaurant">Restaurants</option>
          <option value="restaurant">Hotels</option>
          <option value="restaurant">You can only pick restaurant right now</option>
        </select>

        <input size="42" name="query" placeholder='Enter details for your search, like "sushi"' onChange={this.handleChange}/>

        <input size="42" name="location" placeholder='Enter an address to search near' onChange={this.handleChange}/>

        <select name="radius" onChange={this.handleChange}>
          <option value="500" type="number">50 meters</option>
          <option value="1000" type="number">50 meters</option>
          <option value="10000" type="number">50 meters</option>
          <option value="50000" type="number">50 meters</option>
        </select>
      </div>
    )
  }

}

export default withRouter(Search);