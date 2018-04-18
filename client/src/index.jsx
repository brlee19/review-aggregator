import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, History} from "react-router-dom";
import Search from './components/search.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <Router>
        <Switch>
            <Search path="/" component={Search}/>
        </Switch>
        </Router> 
      </div>
      )
   }
}


ReactDOM.render(<App/>, document.getElementById('app'));