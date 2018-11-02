import React from "react";
import { Jumbotron, Table, Grid } from "../components";
import styled, { consolidateStreamedStyles } from "styled-components";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography, Button } from "@material-ui/core";
import axios from "axios";
import mockSyncs from "../utils/mock-syncs";

const Wrapper = styled.div`
  padding: 5%;
`;

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
      {`Finished fetching ${totalFacilities} Facilities from MHFR since last sync`}
    </Typography>
    <Button color="primary" onClick={syncFacilitiesHandler}>
      sync facilities
    </Button>
  </Feedback>
);

export default class Index extends React.Component {
  state = {
    isFetchingFacilities: false,
    isShowingFetchedFacilities: false,
    facilities: [],
    synchronizations: []
  };

  headings = [
    { name: "Synchronization ID", isNumeric: false },
    { name: "Added Facilities", isNumeric: true },
    { name: "Removed Facilities", isNumeric: true },
    { name: "Updated Facilities", isNumeric: true },
    { name: "Sync Date", isNumeric: false }
  ];

  values = [
    ["efjsffs", 23, 14, 222, "October 14, 2018"],
    ["fasdfsdf3243jasd", 18, 3, 123, "September 15, 2018"],
    ["dsfadjf34214", 7, 1, 100, "August 10, 2018"]
  ];

  async componentDidMount() {
    console.clear();
    const syncs = await mockSyncs();
    console.log(syncs);
    this.setState({
      synchronizations: syncs
    });
  }

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
    this.setState({
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

  statusName = statuses => {
    if (statuses[0] == true) {
      return "new facility";
    } else {
      return "old facility";
    }
  };

  getValues = () => {
    // console.log(this.state.facilities);
    const facilities = this.state.facilities;
    if (facilities.length > 0) {
      const data = [];
      facilities.forEach(facility => {
        const facilityData = {};
        Object.keys(facility).forEach(key => {
          facilityData[key] = (
            <span style={{ fontSize: "80%" }}>
              <span style={{ color: "#4CAF50" }}>
                ++
                {facility[key].newValue || "not available"}
              </span>
              <br />
              <span style={{ color: "#F44336" }}>
                --
                {facility[key].previousValue || "not available"}
              </span>
            </span>
          );
        });
        data.push(facilityData);
      });
      console.log(data);
      return data;
    }
    // const facilities = this.state.facilities;
    // if (facilities.length > 0) {
    //   return [];
    // }
    // const synchedValues =
    //   this.state.facilities.length > 0
    //     ? this.state.facilities
    //         .map(({ OpenLMISCode, RegulatoryStatus, ...filtered }) => filtered)
    //         .map(facilityValues => Object.values(facilityValues))
    //     : [];
    // const synchedValues =
    //   this.state.facilities.length > 0
    //     ? this.state.facilities
    //         .map(({ OpenLMISCode, RegulatoryStatus, ...filtered }) => filtered)
    //         .map(facilityValues => Object.values(facilityValues))
    //     : [];
    // if (synchedValues.length > 0) {
    //   let newOrRemoved = [];
    //   const values = synchedValues.map(synchedValue => {
    //     const prevAndNewValues = synchedValue.slice(0, 9);
    //     newOrRemoved.push(synchedValue.slice(9));
    //     const data = prevAndNewValues.map(prevAndNewValue => (
    //       <div>
    //         <span style={{ color: "#4CAF50" }}>
    //           -{prevAndNewValue.newValue || "not available"}
    //         </span>
    //         <br />
    //         <span style={{ color: "#F44336" }}>
    //           +{prevAndNewValue.previousValue || "not available"}
    //         </span>
    //       </div>
    //     ));
    //     return data;
    //   });
    //   for (let counter = 0; counter < values.length; counter++) {
    //     values[counter].push(this.statusName(newOrRemoved[counter]));
    //   }
    //   return this.state.isShowingFetchedFacilities ? values : this.values;
    // }
    // return this.values;
    return [];
  };
  getHeadings = () => {
    const unwantedHeaders = [
      "OpenLMISCode",
      "RegulatoryStatus",
      "isNew",
      "isRemoved"
    ];

    const synchedHeaders =
      this.state.facilities.length > 0
        ? Object.keys(this.state.facilities[0])
            .filter(header => !unwantedHeaders.includes(header))
            .map(heading => {
              return {
                name: heading,
                title: heading
              };
            })
        : [];
    synchedHeaders.push({ name: "status", title: "status" });
    console.log(synchedHeaders);
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
        // console.log(await res.json());
        const data = await res.json();
        // console.clear();
        // console.log(data.organisationUnits);
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
    const updatedFacilities = this.state.facilities.filter(
      facility => !(facility.isNew && facility.isRemoved)
    );
    if (updatedFacilities.length > 0) {
      const dhis2CompatFacilities = updatedFacilities.map(newFacility => ({
        name: newFacility.Name.newValue,
        shortName: newFacility.CommonName.newValue,
        openingDate: newFacility.DateOpened.newValue,
        parent: {
          name: newFacility.District.newValue + "-DHO"
        }
      }));
      for (let dhis2CompatFacility of dhis2CompatFacilities) {
        const getParentId = await fetch(
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
        const data = await getParentId.json();
        dhis2CompatFacility.parent.id = data.organisationUnits[0].id;
        const getFacilityId = await fetch(
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
      }
    }
  };

  syncFacilitiesHandler = async () => {
    await this.addToDHIS2();
  };

  render() {
    return (
      <Wrapper>
        <Jumbotron
          isFetching={this.state.isFetchingFacilities}
          buttonTitle="Fetch Facilities from MHFR"
          buttonHandler={this.clickHandler}
        />
        {this.state.isFetchingFacilities && <LinearProgress className="mt-4" />}
        {this.state.facilities.length > 0 &&
          renderFetchFeedback(
            this.state.facilities.length,
            this.syncFacilitiesHandler
          )}
        <Grid columns={this.getHeadings()} rows={this.getValues()} />
        {/* <Table
          headings={this.getHeadings()}
          values={this.getValues()}
          title={this.getTitle()}
        /> */}
      </Wrapper>
    );
  }
}
