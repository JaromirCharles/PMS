import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: "grey",
  },
  title: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

function Homepage() {
  const classes = useStyles();

  return (
    <Fragment>
      <Fragment>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Personnel Management System
            </Typography>
            <Button variant="outlined" component={Link} to="/login">
              Login
            </Button>
          </Toolbar>
        </AppBar>
      </Fragment>

      <Typography className="mt-4 ml-4" paragraph={true}>
        Hello employers, tired of the hassle organizing your employees for a
        job? Look no further, <br></br>
        PMS is here to make managing your crew easier, saving you the stress as
        well as precious time. <br></br>
        Relax, pay attention to other tasks and let PMS take care of organizing
        your work force.
      </Typography>

      <Fragment>
        <Button
          variant="outlined"
          size="large"
          color="primary"
          className={classes.margin}
          component={Link}
          to="/register"
        >
          Register your company today
        </Button>
      </Fragment>
    </Fragment>
  );
}

export default Homepage;
