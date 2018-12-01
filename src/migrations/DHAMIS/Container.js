import { Jumbotron, Grid } from "../../components";
import { Wrapper } from "../../styled-components";
import React, { Component } from "react";
import From from "./Form";
import Form from "./Form";
import LinearProgress from "@material-ui/core/LinearProgress";
import settings from "../../settings";
import axios from "axios";

class Container extends Component {
  state = {
    migrations: [],
    isFetchingMigrations: false
  };

  async componentDidMount() {
    this.setState({ isFetchingMigrations: true });

    const {
      OPENHIM_URL: URL,
      OPENHIM_PASSWORD: password,
      OPENHIM_USER: username
    } = settings;

    const url = `${URL}/interop-manager/migrations/openlmis`;

    const req = await axios({
      method: "get",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log(err));

    const migrations = req ? req.data : [];
    this.setState({ migrations, isFetchingMigrations: false });
  }

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
