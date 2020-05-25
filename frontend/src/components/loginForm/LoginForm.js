import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function LoginForm(props) {
  const classes = useStyles();

  const [redirect, setRedirect] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (state.username === "admin" && state.password === "admin") {
      console.log("Success");
      setRedirect(true);
      return <Redirect to="/employee" />;
    } else {
      console.log("Wrong username or password");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (redirect) {
    if (tabValue === 0) {
      return <Redirect to="/tenant" />;
    } else {
      return <Redirect to="/employee" />;
    }
  } else {
    return (
      <div className="card col-12 col-lg-4 login-card mt-2 ml-4 mb-4 hv-center">
        <nav className="navbar navbar-dark bg-primary">
          <div className="row col-12 d-flex justify-content-center text-white">
            <span className="h3">Login</span>
          </div>
        </nav>
        <form>
          <Paper className={classes.root}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Tenant" />
              <Tab label="Employee" />
            </Tabs>
          </Paper>
          <div className="form-group text-left">
            <label htmlFor="exampleInputEmail1">Username</label>

            <input
              type="username"
              className="form-control"
              id="username"
              aria-describedby="usernameHelp"
              placeholder="Enter username"
              value={state.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="exampleInputPassword1">Password</label>

            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmitClick}
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}
export default LoginForm;
