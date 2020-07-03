import React, { useState, Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import validate from "validator";
import Alert from "@material-ui/lab/Alert";
import { Redirect, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    background: "lightgrey",
  },
  title: {
    flexGrow: 1,
    fontSize: 30,
    color: "black",
  },
  register: {
    flexGrow: 1,
    width: 350,
    position: "absolute",
    left: "50%",
    top: "35%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    marginTop: 80,
  },
  header: {
    display: "flex",
    margin: theme.spacing(1),
    alignItems: "center",
  },
  signuperrortext: {
    color: "red",
    fontSize: 14,
    marginTop: 0,
    alignItems: "left",
  },
}));

function RegistrationForm(props) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [emptyName, setEmptyName] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidCPassword, setInvalidCPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleNameInput = (e) => {
    const { value } = e.target;
    setName(value);
    setEmptyName(false);
  };

  const handleEmailInput = (e) => {
    const { value } = e.target;
    setEmail(value);
    setInvalidEmail(false);
  };

  const handlePasswordInput = (e) => {
    const { value } = e.target;
    setPassword(value);
    setInvalidPassword(false);
  };

  const handleCPasswordInput = (e) => {
    const { value } = e.target;
    setCPassword(value);
    setInvalidCPassword(false);
  };

  const validateInput = () => {
    let invalid = false;
    if (name === "") {
      setEmptyName(true);
      invalid = true;
    } else if (!validate.isEmail(email)) {
      setInvalidEmail(true);
      invalid = true;
    } else if (password === "") {
      setInvalidPassword(true);
      invalid = true;
    } else if (cPassword === "" || cPassword !== password) {
      setInvalidCPassword(true);
      invalid = true;
    }
    return invalid;
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      return;
    }

    const tenant = {
      name: name,
      email: email,
    };

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenant, password }),
    });
    const body = await response.text();
    if (response.status !== 200) {
      //console.log("received error from server: ", body.message);
      //throw Error(body.message);
    }

    if (body === "true") {
      setShowAlert(true);
      setAlertMsg("Success! Redirecting to homepage ...");
      setTimeout(() => setRedirect(true), 2000);
    }
  };

  if (redirect) {
    return <Redirect component={Link} to="/" />;
  } else {
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
            </Toolbar>
          </AppBar>
        </Fragment>
        <div className={classes.register}>
          <p className="h5 text-center login-heading">Sign up</p>
          {showAlert ? <Alert severity="success">{alertMsg}</Alert> : null}
          <form>
            <div className="form-group text-left">
              <label htmlFor="exampleInputName">Company's Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Company's name"
                value={name}
                onChange={handleNameInput}
              />
              {emptyName ? (
                <span className={classes.signuperrortext}>
                  {" "}
                  Name field cannot be blank.
                </span>
              ) : null}
            </div>
            <div className="form-group text-left">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailInput}
              />
              {invalidEmail ? (
                <span className={classes.signuperrortext}>
                  {" "}
                  Please type valid email address.
                </span>
              ) : null}
            </div>
            <div className="form-group text-left">
              <label htmlFor="exampleInputPassword1">Password</label>

              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordInput}
              />
              {invalidPassword ? (
                <span className={classes.signuperrortext}>
                  Password cannot be empty.
                </span>
              ) : null}
            </div>
            <div className="form-group text-left">
              <label htmlFor="exampleInputPassword1">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={cPassword}
                onChange={handleCPasswordInput}
              />
              {invalidCPassword ? (
                <span className={classes.signuperrortext}>
                  Passwords do not match.
                </span>
              ) : null}
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
}
export default RegistrationForm;
