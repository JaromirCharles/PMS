import React, { useState, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import validate from "validator";

const useStyles = makeStyles((theme) => ({
  root: {
    //flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    alignSelf: "center",
    flexDirection: "column",
    marginTop: "",
  },
  appBar: {
    background: "lightgrey",
  },
  title: {
    //flexGrow: 1,
    fontSize: 30,
    color: "black",
  },
  header: {
    display: "flex",
    margin: theme.spacing(1),
  },
  login: {
    //flexGrow: 1,
    width: 350,
    position: "absolute",
    left: "50%",
    top: "25%",
    transform: "translate(-50%, -50%)",
    alignItems: "center",
    textAlign: "center",
    marginTop: 50,
  },
  button: {
    border: "solid",
    borderWidth: 2,
    backgroundColor: "transparent",
    color: "black",
    cursor: "pointer",
  },
  signuperrortext: {
    color: "red",
    fontSize: 14,
    marginTop: 0,
    alignItems: "left",
  },
}));

function LoginForm() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [user, setUser] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

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

  const validateInput = () => {
    let invalid = false;
    if (!validate.isEmail(email)) {
      setInvalidEmail(true);
      invalid = true;
    } else if (password === "") {
      setInvalidPassword(true);
      invalid = true;
    }
    return invalid;
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();

    if (validateInput()) {
      return;
    }

    let credentials = {
      email: email,
      password: password,
    };

    const response = await fetch("api/validateLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: { credentials } }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    if (body.validate === true) {
      setInvalidCredentials(false);
      setCompanyName(body.companyName);
      setUser(body.user);
      setRedirect(true);
    } else {
      setRedirect(false);
      setInvalidCredentials(true);
    }
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
            state: { email: email },
          }}
        />
      );
    }
  } else {
    return (
      <div className={classes.root}>
        <Fragment>
          <AppBar className={classes.appBar} position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                <b style={{fontSize: 35}}>pms</b> . <b style={{fontSize: 35}}>p</b>ersonnel <b style={{fontSize: 35}}>m</b>anagement <b style={{fontSize: 35}}>s</b>ystem
              </Typography>
            </Toolbar>
          </AppBar>
        </Fragment>

        {/* <div className="card col-12 col-lg-4 login-card mt-2 ml-4 mb-4 hv-center"> */}
        <div className={classes.login}>
          <p className="h5 text-center login-heading">Sign in</p>
          <form>
            <div className="form-group text-left">
              <label htmlFor="exampleInputEmail1">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                //autoComplete="off"
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
              <label htmlFor="exampleInputPassword1">Password:</label>

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
            <div>

              {
                invalidCredentials ? <span className={classes.signuperrortext}>
                  Incorrect username/password. Please try again.
                </span> : null
            }
            <button
              type="submit"
              className="btn btn-primary"
              
              onClick={handleSubmitClick}
            >
                LOGIN
            </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default LoginForm;
