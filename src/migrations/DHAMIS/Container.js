import { Jumbotron, Grid, CircularProgressBar } from "../../components";
import { Wrapper } from "../../styled-components";
import React, { Component } from "react";
import Form from "./Form";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from '@material-ui/core/Card';
import settings from "../../settings";
import axios from "axios";
import * as firebase from 'firebase';


class Container extends Component {
  state = {
    migrations: [],
    isFetchingMigrations: false,
    isMigrating: false,
    migrationPercentage: 0,
    migrationProgress: '',
    migrationRecords: '',
  };

  firestore = null

  _updateFactory = (firestore, docName, key) => {
    firestore.collection("dhamis").doc(docName)
      .onSnapshot((doc) => {
        if (doc.data()) {
          this.setState({
            [key]: doc.data().state
          })
        }
      });
  }

  _toggleMigratingStatus = async (isMigrating) => {
    this.setState({
      isMigrating
    })
  }

  async componentDidMount() {
    this.setState({ isFetchingMigrations: true });

    const {
      OPENHIM_URL: URL,
      OPENHIM_PASSWORD: password,
      OPENHIM_USER: username,
      FIREBASE_API_KEY: apiKey,
      FIREBASE_AUTH_DOMAIN: authDomain,
      FIREBASE_DATABASE_URL: databaseURL,
      FIREBASE_PROJECT_ID: projectId
    } = settings;

    try {
      await firebase.initializeApp({
        apiKey,
        authDomain,
        projectId
      });
    } catch (e) {
      console.log('Firebase initialization failed')
    }

    this.firestore = firebase.firestore();

    this._updateFactory(this.firestore, "progress", "migrationProgress")
    this._updateFactory(this.firestore, "percentage", "migrationPercentage")
    this._updateFactory(this.firestore, "migrating", "isMigrating")

    const url = `${URL}/interop-manager/migrations/openlmis`;

    const req = await axios({
      method: "get",
      url,
      auth: { username, password },
      headers: { "Content-Type": "application/json" }
    }).catch(err => console.log(err));

    const migrations = req ? req.data : [];
    await this.setState({ migrations, isFetchingMigrations: false });
  }

  async componentWillUnmount() {
    // TODO: Destory the firbase instance probably here
  }

  headings = [
    { name: "_id", title: "ID" },
    { name: "period", title: "Period" },
    { name: "successful_records", title: "Successful Records" },
    { name: "failed_records", title: "Failed Records" },
    { name: "migration_date", title: "Date" }
  ];

  _grid = () => (
    <Grid
      rows={this.state.migrations}
      columns={this.headings}
      emptyStateText={this._getEmptyStateText()}
    />
  );

  _getEmptyStateText = () =>
    this.state.isFetchingMigrations ? "Fetching Migrations..." : "No Data";

  loader = () => {
    const { isFetchingMigrations } = this.state;
    return isFetchingMigrations ? <LinearProgress className="mt-4" /> : "";
  };

  _renderDefaultView() {
    return (
      <div>
        <Wrapper>
          <Form handleClick={this.clickHandler} toggleMigratingStatus={this._toggleMigratingStatus} />
          {this.loader()}
          {this.state.isMigrating && this._renderMigratingView()}
          {this._grid()}
        </Wrapper>
      </div>
    )
  }

  _renderMigratingView() {
    return (
      <div>
        <React.Fragment>
          <Card style={{ padding: '10px', marginTop: '20px' }}>
            <h1 style={{ marginBottom: '20px', marginTop: '20px' }}>Migrating dhamis data</h1>
            <LinearProgress variant="determinate" value={Number(this.state.migrationPercentage)} />
            <h2 style={{ marginTop: '20px' }}>Progress {this.state.migrationPercentage}%</h2>
            <h4 style={{ marginTop: '20px' }}>{this.state.migrationProgress}</h4>
          </Card>
        </React.Fragment>
      </div>
    )
  }

  render() {
    return this._renderDefaultView()
  }
}

export default Container;
