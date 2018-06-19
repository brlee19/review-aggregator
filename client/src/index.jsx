import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, History} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Search from './components/search.jsx';
import Places from './components/places.jsx';
import { getMuiTheme, darkBaseTheme } from 'material-ui/styles';
import { deepPurple800 } from 'material-ui/styles/colors';

const myMuiTheme = getMuiTheme({
  palette: {
    textColor: deepPurple800
  },
  appBar: {
    height: 50,
  },
});

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={myMuiTheme}>
        <Router>
        <Switch>
            <Search exact path="/" component={Search}/>
            <Places path="/places" component={Places}/>
        </Switch>
        </Router>
      </MuiThemeProvider> 
      )
   }
}


ReactDOM.render(<App/>, document.getElementById('app'));