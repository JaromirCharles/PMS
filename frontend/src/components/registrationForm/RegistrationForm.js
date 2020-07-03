import React, { useState, Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
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
  register: {
    flexGrow: 1,
    width: 350,
    position: "absolute",
    left: "50%",
    top: "35%",
    transform: "translate(-50%, -50%)",
    alignItems: "center",
  },
  header: {
    display: "flex",
    margin: theme.spacing(1),
    alignItems: "center",
  },
}));

function RegistrationForm(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = async (e) => {
    console.log("Submitting: ", state);
    e.preventDefault();
    //sendDetailsToServer()
    
    const tenant = {
      name: state.name,
      email: state.email,
    };
    const password = state.password
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( {tenant, password}),
    });
    const body = await response.text();
    if (response.status !== 200) throw Error(body.message);
  };

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
      <div className={classes.register}>
        <form>
          <div className="form-group text-left">
            <label htmlFor="exampleInputName">Company's Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Company's name"
              value={state.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={state.email}
              onChange={handleChange}
            />

            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
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
          <div className="form-group text-left">
            <label htmlFor="exampleInputPassword1">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm Password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmitClick}
          >
            Register
          </button>
        </form>
      </div>
    </Fragment>
  );
}
export default RegistrationForm;
