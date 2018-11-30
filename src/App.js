// @flow

import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";
import { Toolbar } from "./components";
import Synchronizations from "./synchronization";
import "./App.css";
import Migrations from "./migrations";

const Footer = () => <div>Hey I'm a Footer</div>;

const theme = createMuiTheme();

type Props = {};

export default (props: Props) => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <React.Fragment>
          <Toolbar />
          <Switch>
            <Route exact path="/" component={Synchronizations} />

            <Route
              exact
              path="/migrations/dhamis"
              component={Migrations("DHAMIS")}
            />

            <Route exact path="/migrations" component={Migrations()} />
          </Switch>
          {/* <Footer /> */}
        </React.Fragment>
      </Router>
    </MuiThemeProvider>
  );
};
