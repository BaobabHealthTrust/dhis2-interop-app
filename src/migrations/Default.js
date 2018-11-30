import React from "react";
import { Jumbotron } from "../components";
import { Wrapper } from "../styled-components";

export default class Default extends React.Component {
  state = {
    isFetchingMigrations: false
  };
  clickHandler = () => {
    console.clear();
    console.log("fetching migrations");
  };

  render() {
    return (
      <div>
        <Wrapper>
          <Jumbotron
            isFetching={this.state.isFetchingMigrations}
            buttonTitle="Fetch Migrations"
            buttonHandler={this.clickHandler}
          />
        </Wrapper>
      </div>
    );
  }
}
