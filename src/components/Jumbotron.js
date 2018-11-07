import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography, Paper } from "@material-ui/core";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: theme.palette.primary.light
  }
});

const Jumbotron = ({ classes, buttonTitle, buttonHandler, isFetching }) => {
  return (
    <Paper elevation="0" className={classes.root}>
      <Typography style={{ color: "#fffafa" }} variant="title">
        Welcome to the Interoperability Layer
      </Typography>
      <Typography style={{ margin: 5, color: "#fffafa" }} variant="subheading">
        This tool allows you to connect with the interoperability Layer and
        perform the various interoperability Tasks
      </Typography>
      <Button
        variant="raised"
        color="primary"
        onClick={buttonHandler}
        disabled={isFetching}
      >
        {buttonTitle}
      </Button>
    </Paper>
  );
};

export default withStyles(styles)(Jumbotron);
