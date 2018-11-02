import React from "react";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar
} from "@devexpress/dx-react-grid-material-ui";
import {
  SortingState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  FilteringState,
  IntegratedFiltering
} from "@devexpress/dx-react-grid";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const Title = styled.div`
  font-size: 24px;
  margin-bottom: -40px;
`;

class TableGrid extends React.Component {
  render() {
    const TableRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        onClick={() => null}
        style={{
          cursor: "pointer"
        }}
      />
    );

    return (
      <React.Fragment>
        <Card style={{ marginTop: "20px", padding: "0" }}>
          <CardContent>
            {(this.props.rows.length > 0 && (
              <Grid
                rows={this.props.rows}
                columns={this.props.columns}
                style={{ margin: 0 }}
              >
                <SortingState defaultSorting={this.props.defaultSorting} />
                <IntegratedSorting />
                <PagingState
                  defaultCurrentPage={0}
                  pageSize={this.props.pageSize}
                />
                <IntegratedPaging />
                <FilteringState defaultFilters={[]} />
                <IntegratedFiltering />
                <Table rowComponent={TableRow} />
                <TableHeaderRow showSortingControls />
                <Toolbar />
                <PagingPanel />
              </Grid>
            )) || (
              <div style={{ textAlign: "center" }}>
                <h2>{this.props.emptyStateText}</h2>
              </div>
            )}
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }
}

export default TableGrid;
