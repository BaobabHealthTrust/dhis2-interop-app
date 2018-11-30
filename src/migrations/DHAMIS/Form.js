import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button, Typography, Paper } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";

const styles = theme => ({
  button: {
    display: "block",
    marginTop: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: theme.palette.primary.light
  }
});

class ControlledOpenSelect extends React.Component {
  state = {
    quarter: 0,
    year: 0,
    openQuarter: false,
    quarterError: false,
    openYear: false,
    years: [],
    yearError: false
  };

  componentDidMount() {
    this.setState({ years: this.getYears() });
  }

  handleQuarterChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleQuarterClose = () => this.setState({ openQuarter: false });
  handleQuarterOpen = () => this.setState({ openQuarter: true });

  handleYearChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.getYears();
  };

  handleYearClose = () => this.setState({ openYear: false });
  handleYearOpen = () => this.setState({ openYear: true });

  getYears = () => {
    const year = new Date().getFullYear();
    const years = [];
    for (let index = 0; index < 10; index++) {
      years.push(year - index);
    }

    return years;
  };

  handleYears = year => <MenuItem value={year}>{year}</MenuItem>;

  select = () => {
    const years = this.state.years;
    return (
      <Select
        open={this.state.openYear}
        onClose={this.handleYearClose}
        onOpen={this.handleYearOpen}
        value={this.state.year}
        onChange={this.handleYearChange}
        inputProps={{
          name: "year",
          id: "year"
        }}
      >
        {years.map(this.handleYears)}
      </Select>
    );
  };

  onclick = async () => {
    const { quarter = 0, year = 0 } = this.state;

    await this.setState({
      quarterError: quarter === 0 ? true : false,
      yearError: year === 0 ? true : false
    });

    await this.props.handleClick();
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Typography variant="title">DHAMIS Migration Tab</Typography>

        <Typography style={{ margin: 5 }} variant="subheading">
          This tab allows you to connect with the interoperability Layer and
          migrate data between DHAMIS and DHIS2 based on periods/quarters
        </Typography>

        <form autoComplete="off">
          <FormControl
            className={classes.formControl}
            error={this.state.quarterError}
          >
            <InputLabel htmlFor="quarter"> Quarter </InputLabel>
            <Select
              open={this.state.openQuarter}
              onClose={this.handleQuarterClose}
              onOpen={this.handleQuarterOpen}
              value={this.state.quarter}
              onChange={this.handleQuarterChange}
              inputProps={{
                name: "quarter",
                id: "quarter"
              }}
            >
              <MenuItem value={1}>Q1</MenuItem>
              <MenuItem value={2}>Q2</MenuItem>
              <MenuItem value={3}>Q3</MenuItem>
              <MenuItem value={4}>Q4</MenuItem>
            </Select>

            {this.state.quarterError && (
              <FormHelperText>Quarter is required</FormHelperText>
            )}

          </FormControl>

          <FormControl
            className={classes.formControl}
            error={this.state.yearError}
          >
            <InputLabel htmlFor="year"> Year </InputLabel>
            {this.select()}
            {this.state.yearError && (
              <FormHelperText>Year is required</FormHelperText>
            )}
          </FormControl>

          <FormControl className={classes.formControl}>
            <Button
              variant="raised"
              onClick={this.onclick}
              color="primary"
              className={classes.button}
            >
              MIGRATE
            </Button>
          </FormControl>
        </form>
      </Paper>
    );
  }
}

ControlledOpenSelect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ControlledOpenSelect);
