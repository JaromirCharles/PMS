import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
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
    email: "",
    password: "",
  });
  const [companyName, setCompanyName] = React.useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    /*if (state.email === "admin" && state.password === "admin") {
      console.log("Success");
      setRedirect(true);
      return <Redirect to="/employee" />;
    } else {
      console.log("Wrong username or password");
    } */
    //if tabvalue = 0 then tenant, if 1 then employee
    if (tabValue === 0) {
      // check database for valid email and password and return company name
      const response = await fetch("/api/validateLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: { state } }),
      });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      console.log("body: ", body.validate);
      if (body.validate === true) {
        setCompanyName(body.companyName);
        console.log("setting to true");
        setRedirect(true);
      } else {
        console.log("setting to false");
        setRedirect(false);
      }
    } else {
      // check database for valid employee credentials
      const response = await fetch("api/validateEmployeeLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: { state } }),
      });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      if (body.validate === true) {
        setCompanyName(body.companyName);
        console.log("setting to true");
        setRedirect(true);
      } else {
        console.log("setting to false");
        setRedirect(false);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (redirect) {
    if (tabValue === 0) {
      return <Redirect component={Link} to={`/${companyName}/jobs`} />;
    } else {
      return <Redirect component={Link} to={{pathname: `/employee/${companyName}`,
                                            state: {email: state.email}}} />;
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
            <label htmlFor="exampleInputEmail1">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
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
            component={Link}
            to="/tenant"
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
