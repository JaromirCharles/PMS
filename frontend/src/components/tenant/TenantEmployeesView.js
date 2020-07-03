import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import { Divider } from "@material-ui/core";
import TenantEmployeesTable from "./TenantEmployeesTable";
import validate from "validator";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles((theme) => ({
  root: {},
  invite_employees: {
    flexGrow: 1,
    display: "flex",
  },
  buttons: {
    margin: theme.spacing(1),
    borderColor: "white",
    borderRadius: 100,
  },
  card: {
    maxWidth: 250,
    margin: theme.spacing(1),
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

export default function TenantEmployeesView({ companyName }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [severity, setSeverity] = useState("");
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [dummy, setDummy] = useState(false);

  useEffect(() => {
    console.log("Get employee list");
    onClickInvite()
  }, []);

  const onClickInvite = async () => {
    if (email === "") {
      setShowSnackBar(true);
      setSnackbarMsg("Email cannot be blank...");
      setSeverity("error");
      setTimeout(() => setShowSnackBar(false), 3000);
      return;
    }
    if (!validate.isEmail(email)) {
      setShowSnackBar(true);
      setSnackbarMsg("Not a valid email");
      setSeverity("error");
      setTimeout(() => setShowSnackBar(false), 3000);
      return;
    }
    //console.log(`Inviting '${email}' to '${companyName}' workers group`);

    const response = await fetch("/api/invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, companyName }),
    });
    const body = await response.text();
    if (response.status !== 200) {
      //throw Error(body.message);
      console.log("ERROR")
    }
      
    setShowSnackBar(true);
    setSnackbarMsg(`Successfully added ${email}`);
    setSeverity("success");
    setTimeout(() => setShowSnackBar(false), 3000);
    setEmail("");
    let fake = {...dummy };
    fake = !fake;

    setDummy(fake)
  };

  return (
    <div>
      {true ? console.log("return") : null}
      <div>
        <Typography variant="h6" color="initial">
          Invite Employees
        </Typography>

        <div className={classes.invite_employees}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            //required={true}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            onChange={(event) => {
              const { value } = event.target;
              setEmail(value);
            }}
          />
          <Button
            className={classes.buttons}
            variant="contained"
            size="small"
            color="primary"
            startIcon={<AddCircleIcon />}
            //onClick={() => addEmail()}
            onClick={() => onClickInvite()}
          >
            Invite
          </Button>
        </div>
        
        <Divider style={{ height: "10px" }} />
        <Divider style={{ height: "10px", opacity: 0 }} />
      </div>
      <div>
        <TenantEmployeesTable companyName={companyName} />
      </div>
      {showSnackBar ? (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={true}
          message={snackbarMsg}
        >
          <Alert severity={severity}>{snackbarMsg}</Alert>
        </Snackbar>
      ) : null}
    </div>
  );
}
