import MoreVertIcon from "@material-ui/icons/MoreVert";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import React from "react";
import classnames from "classnames";

const styles = {
  card: {
    backgroundColor: "#9CCC65"
  }
};

export default props => {
  const {
    facilities,
    totalFacilitiesAdded,
    totalFacilitiesRemoved,
    totalFacilitiesUpdated,
    classes
  } = props.feedback;

  const handleClick = props.handleClick;

  return (
    <Card style={styles.card}>
      <CardHeader
        action={
          <IconButton>
            <MoreVertIcon onClick={handleClick} />
          </IconButton>
        }
        title="Synchronization Message"
      />
      <CardContent>
        <Typography>
          <b>Total Facilities Added:</b> {totalFacilitiesAdded}
          <br />
          <b>Total Facilities Updated:</b> {totalFacilitiesUpdated}
          <br />
          <b>Total Facilities Removed:</b> {totalFacilitiesRemoved}
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
};
