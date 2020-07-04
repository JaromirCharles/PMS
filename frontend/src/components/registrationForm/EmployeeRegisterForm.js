import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useParams, Redirect } from "react-router";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "350",
    margin: "auto",
    //border: "1px solid green",
    padding: "30px",
    textAlign: "center",
  },
  appBar: {
    background: "lightgrey",
  },
  title: {
    flexGrow: 1,
    fontSize: 30,
    color: "black",
  },
  form: {
    margin: theme.spacing(1),
    /* paddingLeft: 10,
      paddingRight: 10, */
    //width: "25ch",
  },
  button: {
    margin: theme.spacing(0.3),
  },
}));

export default function EmployeeRegisterForm({ match }) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  //const [dob, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { tenant } = useParams(match.params.tenant);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const onClickSave = async () => {
    const employee = {
      name: name,
      surname: surname,
      email: email,
      tenant: tenant,
    };
    console.log("employee: ", employee);
    const response = await fetch("/api/register_employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employee, password }),
    });
    const body = await response.text();
    if (response.status !== 200) throw Error(body.message);
    // If register succesful, re route to pms home page
    // show registration successful for 2 seconds then redirect
    if (body === "true") {
      setShowAlert(true);
      setAlertMsg("Success! Redirecting to homepage ...");
      setTimeout(() => setRedirect(true), 2000);
    }
  };

  const isDisabled = () => {
    return !(name && surname && email && password && confirmPassword);
  };

  if (redirect) {
    return <Redirect to="/" />;
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
        <div className={classes.root}>
          <p className="h5 text-center login-heading">
            Sign up to {tenant} PMS
          </p>
          {showAlert ? <Alert severity="success">{alertMsg}</Alert> : null}
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              id="name"
              label="Name"
              defaultValue={name}
              variant="outlined"
              margin="normal"
              required={true}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              onChange={(event) => {
                const { value } = event.target;
                setName(value);
              }}
            />
            <br></br>
            <TextField
              id="surname"
              label="Surname"
              defaultValue={surname}
              margin="normal"
              required={true}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              variant="outlined"
              onChange={(event) => {
                const { value } = event.target;
                setSurname(value);
              }}
            />
            <br></br>
            {/* <TextField
              id="dateofbirth"
              label="Date of birth"
              type="date"
              defaultValue={dob}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required={true}
              margin="normal"
              size="small"
              onChange={(event) => {
                const { value } = event.target;
                setDOB(value);
              }}
            />
            <br></br> */}

            <TextField
              id="email"
              label="Email"
              type="email"
              defaultValue={email}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required={true}
              margin="normal"
              size="small"
              onChange={(event) => {
                const { value } = event.target;
                setEmail(value);
              }}
            />
            <br></br>
            <TextField
              id="password"
              label="Password"
              type="password"
              defaultValue={password}
              margin="normal"
              required={true}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              size="small"
              onChange={(event) => {
                const { value } = event.target;
                setPassword(value);
              }}
            />
            <br></br>
            <TextField
              id="confirm-password"
              label="Confirm Password"
              type="password"
              margin="normal"
              defaultValue={confirmPassword}
              required={true}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              size="small"
              onChange={(event) => {
                const { value } = event.target;
                setConfirmPassword(value);
              }}
            />
            <br></br>

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              disabled={isDisabled()}
              onClick={() => onClickSave()}
            >
              Save
            </Button>
          </form>
        </div>
      </Fragment>
    );
  }
}
