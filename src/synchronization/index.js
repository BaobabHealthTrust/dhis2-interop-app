import React from "react";
import { Jumbotron, Table } from "../components";
import styled from "styled-components";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography, Button } from "@material-ui/core";

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

const renderFetchFeedback = () => (
  <Feedback>
    <Typography variant="button" color="primary">
      Finished fetching 108 Facilities from MHFR since last sync
    </Typography>
    <Button>View Fetched Facilities</Button>
  </Feedback>
);

export default class Index extends React.Component {
  state = {
    isFetchingFacilities: false,
    facilities: ""
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

  clickHandler = async () => {
    this.setState({ isFetchingFacilities: true });
    const facilities = await new Promise((res, rej) => {
      setTimeout(() => {
        res("something");
      }, 2000);
    });
    this.setState({ facilities, isFetchingFacilities: false });
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
        {this.state.facilities && renderFetchFeedback()}
        <Table
          headings={this.headings}
          values={this.values}
          title="Previous Synchronizations"
        />
      </Wrapper>
    );
  }
}
