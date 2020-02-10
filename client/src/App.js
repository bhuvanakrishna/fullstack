import React from "react";

import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/pages/Home";
import Searchusers from "./components/pages/Searchusers";
import Discuss from "./components/pages/Discuss";

import AuthState from "./context/auth/authState";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Oswald", "sans-serif"].join(",")
  }
});

function App() {
  return (
    <AuthState>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/searchusers" component={Searchusers} />
            <Route exact path="/discuss" component={Discuss} />
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthState>
  );
}

export default App;
