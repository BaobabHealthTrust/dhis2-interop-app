import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";
import { Toolbar } from "./components";
import Synchronizations from "./synchronization";

const Migrations = () => {
  return <h1>Hey From Migrations</h1>;
};

const Footer = () => {
  return <div>Hey I'm a Footer</div>;
};

const theme = createMuiTheme();

export default props => {
  console.log(props);
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <div>
          <Toolbar />
          <Switch>
            <Route exact path="/" component={Synchronizations} />
            <Route exact path="/migrations" component={Migrations} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </MuiThemeProvider>
  );
};
