import React, { useState, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    background: "grey",
  },
  title: {
    flexGrow: 1,
  },
  header: {
    display: "flex",
    margin: theme.spacing(1),
    alignItems: "center",
  },
  login: {
    flexGrow: 1,
    width: 350,
    position: "absolute",
    left: "50%",
    top: '25%',
    transform: 'translate(-50%, -50%)',
    alignItems: "center",
  },
  button: {
    display: 'flex',
    alignItems: 'center',
  }
}));

function LoginForm() {
  const classes = useStyles();
  const [redirect, setRedirect] = React.useState(false);
  const [user, setUser] = React.useState("");
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


    const response = await fetch("api/validateLogin", {
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
      setUser(body.user)

      console.log("setting to true");
      // save user's email to localstorage so that the application always knows which user is currently logged on.
      //window.localStorage.setItem("user_email", state.email);
      setRedirect(true);
    } else {
      console.log("setting to false");
      setRedirect(false);
    }
  };

  const handleUserChange = (event, newValue) => {
    setUser(newValue);
  };

  if (redirect) {
    if (user === "tenant") {
      return <Redirect component={Link} to={`/${companyName}/jobs`} />;
    } else {
      return (
        <Redirect
          component={Link}
          to={{
            pathname: `/employee/${companyName}`,
            state: { email: state.email },
          }}
        />
      );
    }
  } else {
    return (
      <Fragment>
        <Fragment>
          <AppBar className={classes.appBar} position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Personnel Management System
              </Typography>
            </Toolbar>
          </AppBar>
        </Fragment>

        {/* <div className="card col-12 col-lg-4 login-card mt-2 ml-4 mb-4 hv-center"> */}
        <div className={classes.login}>
          <Typography className={classes.header} variant="h5">Log in to your PMS</Typography>
          <form>
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
      </Fragment>
    );
  }
}
export default LoginForm;
