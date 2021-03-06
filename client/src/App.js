import React from "react";

import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/pages/Home";
import Searchusers from "./components/pages/Searchusers";
import Discuss from "./components/pages/Discuss";
import AccessDenied from "./components/pages/AccessDenied";

import AuthState from "./context/auth/authState";
import NavbarState from "./context/navbar/navbarState";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import ProtectedRoute from "./ProtectedRoute";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Oswald", "sans-serif"].join(",")
  }
});

function App() {
  return (
    <AuthState>
      <NavbarState>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <ProtectedRoute
                exact
                path="/searchusers"
                component={Searchusers}
              />

              <Route exact path="/discuss" component={Discuss} />
              <Route exact path="/accessdenied" component={AccessDenied} />
            </Switch>
          </Router>
        </ThemeProvider>
      </NavbarState>
    </AuthState>
  );
}

export default App;
