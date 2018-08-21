import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { MenuItem, Paper, RaisedButton, SelectField, Slider, TextField } from 'material-ui';

class Search extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      type: 'restaurant',
      keyword: 'korean',
      address: '369 Lexington Avenue, New York NY',
      radius: 10000
    };

    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  async search() {
    try {
      const resp = await axios.get('/search', {params: this.state});
      this.props.history.push({
        pathname: '/places',
        places: resp.data,
        userQuery: this.state
      });
    } catch(e) {
      console.log('error searching', e);
    }
  }

  render() {
    return(
      <Paper style={{width: '50%', padding: '20px', margin: 'auto', fontWeight: 'bold', maxWidth: '4500px', overflowY: 'scroll'}}>
        <h1>Welcome to ReviewCanoe</h1>
        <h4>Search Yelp, Google, and FourSquare restaurants at the same time!</h4>
        <pre>{this.state.radius}</pre>
        <br></br>
        <TextField size="1280" name="keyword" hintText='Enter details for your search, like "sushi"' onChange={this.handleChange}/>
        <br></br>
        <TextField size="128" name="address" hintText='Enter an address to search near' onChange={this.handleChange}/>
        <br></br>
        Search Radius: {this.state.radius} km
        <Slider value={this.state.radius} step={100}
                onChange={(e, val) => this.setState({radius: val})} min={100} max={40000} style={{maxWidth: '450px'}}/>

        <RaisedButton onClick={this.search}>Search!</RaisedButton>
      </Paper>
    )
  }

}

export default withRouter(Search);