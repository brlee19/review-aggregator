import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, History} from "react-router-dom";

import Search from './components/search.jsx';
import Places from './components/places.jsx';
import Place from './components/place.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
        <Router>
        <Switch>
            <Search exact path="/" component={Search}/>
            <Places path="/places" component={Places}/>
        </Switch>
        </Router> 
      )
   }
}


ReactDOM.render(<App/>, document.getElementById('app'));