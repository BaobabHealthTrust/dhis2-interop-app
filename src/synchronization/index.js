import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography, Button, Card } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import axios from "axios";
import styled, { consolidateStreamedStyles } from "styled-components";

import { Jumbotron, Table, Grid, FeedbackCard } from "../components";
import settings from "./../settings";
import { Wrapper, Red, Green } from "../styled-components";

import Synchronization from "./utils/synchronization";
import OpenHim from "./utils/OpenHimData";

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
    emptyStateText: "",
    feedBackMessage: null,
    isSynchronizing: false
  };

  headings = [
    { name: "_id", title: "Synchronization ID" },
    { name: "totalFacilitiesAdded", title: "Added Facilities" },
    { name: "totalFacilitiesRemoved", title: "Removed Facilities" },
    { name: "totalFacilitiesUpdated", title: "Updated Facilities" },
    { name: "synchronizationDate", title: "Sync Date" }
  ];

  async componentDidMount() {
    this.setState({ isFetchingSynchronizations: true });
    const openHim = new OpenHim();
    const synchronizations = await openHim.fetchSynchronization();
    this.setState({ synchronizations, isFetchingSynchronizations: false });
  }

  getEmptyStateText = () => {
    if (this.state.isFetchingSynchronizations) {
      return "Fetching Synchronizations...";
    } else if (this.state.isFetchingFacilities) {
      return "Fetching Facilities...";
    }
    return "No Data";
  };

  /**
   * Get changed facilities when clicked
   */
  clickHandler = async () => {
    this.setState({ isFetchingFacilities: true });

    const openHim = new OpenHim();
    const facilities = await openHim.fetchChangedFacilities();

    await this.setState({
      facilities,
      isFetchingFacilities: false,
      isShowingFetchedFacilities: true
    });
  };

  hideFeedbackCardHandler = async () => {
    this.setState({ feedBackMessage: null });
  };

  getTitle = () => {
    return this.state.isShowingFetchedFacilities
      ? "Fetched Facilities"
      : "Previous Synchronizations";
  };

  facilityStatus = facility => {
    if (facility.isRecent) {
      return (
        <Green>
          <span>new facility</span>
        </Green>
      );
    } else if (facility.isRemoved) {
      return (
        <Red>
          <span>removed</span>
        </Red>
      );
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
            if (facility[key].newValue === facility[key].previousValue) {
              facilityData[key] = (
                <span style={{ fontSize: "90%" }}>
                  {facility[key].newValue}
                </span>
              );
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

  syncFacilitiesHandler = async () => {
    this.setState({ isSynchronizing: true });

    const sync = new Synchronization();
    const feedBackMessage = await sync.syncFacilities(this.state.facilities);

    this.setState({ feedBackMessage, isSynchronizing: false });
  };

  render() {
    return (
      <Wrapper>
        <Jumbotron
          isFetching={this.state.isFetchingFacilities}
          buttonTitle="Fetch Facilities from MHFR"
          buttonHandler={this.clickHandler}
        />

        {(this.state.isFetchingFacilities || this.state.isSynchronizing) && (
          <LinearProgress className="mt-4" />
        )}

        {this.state.facilities.length > 0 &&
          !this.state.feedBackMessage &&
          renderFetchFeedback(
            this.state.facilities.length,
            this.syncFacilitiesHandler
          )}

        {this.state.feedBackMessage && (
          <div>
            <br />
            <FeedbackCard
              handleClick={this.hideFeedbackCardHandler}
              feedback={this.state.feedBackMessage}
            />
          </div>
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
