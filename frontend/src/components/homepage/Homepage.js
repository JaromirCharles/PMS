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
    background: "lightgrey",
  },
  title: {
    flexGrow: 1,
    fontSize: 30,
    color: "black",
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(0.3),
  },
  body: {
    backgroundColor: "#ccffe6",
  },
  text: {
    marginTop: theme.spacing(2),
    maxWidth: 500,
    textAlign: "justify",
    float: "right",
    marginRight: 50,
    //marginTop: 50,
    fontSize: 20,
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
              <b style={{ fontSize: 35 }}>pms</b> .{" "}
              <b style={{ fontSize: 35 }}>p</b>ersonnel{" "}
              <b style={{ fontSize: 35 }}>m</b>anagement{" "}
              <b style={{ fontSize: 35 }}>s</b>ystem
            </Typography>
            <Button
              className={classes.button}
              variant="outlined"
              component={Link}
              to="/register"
            >
              Register
            </Button>
            <Button
              className={classes.button}
              variant="outlined"
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>
      </Fragment>

      <div className={classes.body}>
        <Typography className={classes.text} paragraph={false}>
          
            Tired of the hassle organizing your employees for a job?
          
          Look no further, PMS is here to make managing your crew easier, saving
          you the stress as well as precious time. Relax, pay attention to other
          tasks and let PMS take care of organizing your work force.
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
      </div>
    </Fragment>
  );
}

export default Homepage;
