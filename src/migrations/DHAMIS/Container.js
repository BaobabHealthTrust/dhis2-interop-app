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
    await this.setState({ migrations, isFetchingMigrations: false });
    console.log(this.state.migrations);
  }

  headings = [
    { name: "_id", title: "ID" },
    { name: "period", title: "Period" },
    { name: "successful_records", title: "Successful Records" },
    { name: "failed_records", title: "Failed Records" },
    { name: "migration_date", title: "Date" }
  ];

  grid = () => (
    <Grid
      rows={this.state.migrations}
      columns={this.headings}
      // emptyStateText={"Malu"}
    />
  );

  getEmptyStateText = () =>
    this.state.isFetchingMigrations ? "Fetching Migrations..." : "No Data";

  loader = () => {
    const { isFetchingMigrations } = this.state;
    return isFetchingMigrations ? <LinearProgress className="mt-4" /> : "";
  };

  render() {
    return (
      <div>
        <Wrapper>
          <Form handleClick={this.clickHandler} />
          {this.loader()}
          {this.grid()}
        </Wrapper>
      </div>
    );
  }
}

export default Container;
