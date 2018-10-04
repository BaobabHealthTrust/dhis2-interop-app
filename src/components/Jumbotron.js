import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import teal from '@material-ui/core/colors/teal'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    backgroundColor: teal[100]
  },
  content: {
    paddingLeft: `${theme.spacing.unit * 4}px`,
    [theme.breakpoints.up('md')]: {
      paddingRight: 0
    }
  },
  description: {
    paddingTop: theme.spacing.unit * 2,
    color: 'grey'
  },
  jumboButton: {
    backgroundColor: teal[400],
    color: 'white',
    marginTop: theme.spacing.unit * 3
  }
}
);

function Jumbotron(props) {
  const { classes } = props;

  return (
    <Fragment>
      <Paper className={classes.root} elevation={1}>
        <div className={classes.content}>
          <Typography variant="title" component="h3">
            Welcome to the Interoperability Manager
          </Typography>
          <Typography component="p" className={classes.description}>
            This tool allows you to connect with the Interoperability Layers and perform the various Interoperability tasks
          </Typography>
          <Button className={classes.jumboButton}>Fetch Facilities from MH</Button>
        </div>

      </Paper>
    </Fragment>
  );
}

export default withStyles(styles)(Jumbotron);
