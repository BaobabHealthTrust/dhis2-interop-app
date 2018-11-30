import { Jumbotron, Grid } from "../../components";
import { Wrapper } from "../../styled-components";
import React, { Component } from "react";
import From from "./Form";
import Form from "./Form";
import LinearProgress from "@material-ui/core/LinearProgress";

class Container extends Component {
  state = {
    migrations: [],
    isFetchingMigrations: false
  };

  clickHandler = () => {
    console.log("fetching dhamis migrations");
    this.setState({ isFetchingMigrations: true });
    this.setState({ isFetchingMigrations: false });
  };

  grid = <Grid columns="Malu" rows={[]} emptyStateText={"no values"} />;

  render() {
    return (
      <div>
        <Wrapper>
          <Form handleClick={this.clickHandler} />
          {this.state.isFetchingMigrations && (
            <LinearProgress className="mt-4" />
          )}
          {this.grid}
        </Wrapper>
      </div>
    );
  }
}

export default Container;
