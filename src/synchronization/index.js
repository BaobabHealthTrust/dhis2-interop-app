import React from "react";
import { Jumbotron, Table, Grid } from "../components";
import styled, { consolidateStreamedStyles } from "styled-components";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography, Button } from "@material-ui/core";
import axios from "axios";
import { Wrapper, Red, Green } from "../styled-components";
import Synchronization from "./utils/synchronization";
import settings from "./../settings";

const Feedback = styled.div`
  display: flex;
  flex-direction: "row";
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
`;

const renderFetchFeedback = (totalFacilities, syncFacilitiesHandler) => (
  <Feedback>
    <Typography variant="button" color="primary">
      {" "}
      {`Finished fetching ${totalFacilities} Facilities from MHFR since last sync`}{" "}
    </Typography>{" "}
    <Button color="primary" onClick={syncFacilitiesHandler}>
      sync facilities{" "}
    </Button>{" "}
  </Feedback>
);

export default class Index extends React.Component {
  state = {
    isFetchingFacilities: false,
    isFetchingSynchronizations: false,
    isShowingFetchedFacilities: false,
    facilities: [],
    synchronizations: [],
    emptyStateText: ""
  };

  headings = [
    { name: "_id", title: "Synchronization ID" },
    { name: "totalFacilitiesAdded", title: "Added Facilities" },
    { name: "totalFacilitiesRemoved", title: "Removed Facilities" },
    { name: "totalFacilitiesUpdated", title: "Updated Facilities" },
    { name: "synchronizationDate", title: "Sync Date" }
  ];

  async componentDidMount() {
    console.clear();
    console.log(settings);
    this.setState({ isFetchingSynchronizations: true });
    const response = await axios.get(
      "http://142.93.203.254:5001/interop-manager/synchronizations",
      {
        auth: {
          username: settings.openHimUser,
          password: settings.openHimPassword
        }
      }
    );
    console.log(response.data);
    this.setState({
      synchronizations: response.data,
      isFetchingSynchronizations: false
    });
  }

  getEmptyStateText = () => {
    if (this.state.isFetchingSynchronizations) {
      return "Fetching Synchronizations...";
    } else if (this.state.isFetchingFacilities) {
      return "Fetching Facilities...";
    }
    return "No Data";
  };

  clickHandler = async () => {
    this.setState({ isFetchingFacilities: true });
    const response = await axios({
      url: "http://142.93.203.254:5001/interop-manager/changedFacilities",
      method: "get",
      auth: {
        username: "mhfr",
        password: "mhfr"
      }
    });
    await this.setState({
      facilities: response.data,
      isFetchingFacilities: false,
      isShowingFetchedFacilities: true
    });
  };

  getTitle = () => {
    return this.state.isShowingFetchedFacilities
      ? "Fetched Facilities"
      : "Previous Synchronizations";
  };

  facilityStatus = facility => {
    console.log(facility);
    if (facility.isRecent) {
      return (
        <Green>
          <span>new facility</span>
        </Green>
      );
    } else if (facility.isRemoved) {
      return <span>removed</span>;
    }
    return <span style={{ color: "#ffae22" }}>updated facility</span>;
  };

  getValues = () => {
    const facilities = this.state.facilities;
    if (this.state.isShowingFetchedFacilities) {
      const data = [];
      facilities.forEach(facility => {
        const facilityData = {};
        Object.keys(facility).forEach(key => {
          if (key == "isRecent" || key == "isRemoved") {
            facilityData["status"] = this.facilityStatus(facility);
          } else {
            facilityData[key] = (
              <span style={{ fontSize: "90%" }}>
                <Green>
                  <span>+ {facility[key].newValue || "not available"}</span>
                </Green>
                <br />
                <Red>
                  <span>
                    - {facility[key].previousValue || "not available"}
                  </span>
                </Red>
              </span>
            );
          }
        });
        data.push(facilityData);
      });
      return data;
    }
    return this.state.synchronizations;
  };

  getHeadings = () => {
    const unwantedHeaders = [
      "OpenLMISCode",
      "RegulatoryStatus",
      "isRecent",
      "isRemoved"
    ];

    const synchedHeaders =
      this.state.facilities.length > 0
        ? Object.keys(this.state.facilities[0])
            .filter(header => !unwantedHeaders.includes(header))
            .map(heading => {
              return { name: heading, title: heading };
            })
        : [];
    if (this.state.facilities.length > 0) {
      synchedHeaders.push({
        name: "status",
        title: "status"
      });
    }
    return this.state.isShowingFetchedFacilities
      ? synchedHeaders
      : this.headings;
  };

  addToDHIS2 = async () => {
    const newFacilities = this.state.facilities.filter(
      facility => facility.isNew
    );

    if (newFacilities.length > 0) {
      const dhis2CompatFacilities = newFacilities.map(newFacility => ({
        name: newFacility.Name.newValue,
        shortName: newFacility.CommonName.newValue,
        openingDate: newFacility.DateOpened.newValue,
        parent: {
          name: newFacility.District.newValue + "-DHO"
        }
      }));
      for (let dhis2CompatFacility of dhis2CompatFacilities) {
        const res = await fetch(
          `http://192.168.2.252:7000/training/api/organisationUnits.json?filter=name:ilike:${
            dhis2CompatFacility.parent.name
          }&fields=[id]`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(":/")}`
            }
          }
        );
        const data = await res.json();
        dhis2CompatFacility.parent.id = data.organisationUnits[0].id;
        await fetch(
          "http://192.168.2.252:7000/training/api/28/organisationUnits",
          {
            method: "POST",
            body: JSON.stringify(dhis2CompatFacility),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa("")}`
            }
          }
        );
      }
    }
  };

  updateFacility = async () => {
    const sync = new Synchronization();
    await sync.syncFacilities(this.state.facilities);
  };

  syncFacilitiesHandler = async () => {
    // await this.addToDHIS2();
    console.log(this.state.facilities);
  };

  render() {
    return (
      <Wrapper>
        <Jumbotron
          isFetching={this.state.isFetchingFacilities}
          buttonTitle="Fetch Facilities from MHFR"
          buttonHandler={this.clickHandler}
        />{" "}
        {this.state.isFetchingFacilities && <LinearProgress className="mt-4" />}{" "}
        {this.state.facilities.length > 0 &&
          renderFetchFeedback(
            this.state.facilities.length,
            this.syncFacilitiesHandler
          )}
        <Grid
          columns={this.getHeadings()}
          rows={this.getValues()}
          emptyStateText={this.getEmptyStateText()}
        />
      </Wrapper>
    );
  }
}
