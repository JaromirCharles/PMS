import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import { Divider } from "@material-ui/core";
import TenantEmployeesTable from "./TenantEmployeesTable";

const useStyles = makeStyles((theme) => ({
  root: {},
  invite_employees: {
    flexGrow: 1,
    display: "flex",
  },
  buttons: {
    margin: theme.spacing(1),
    /* backgroundColor: "green",
      color: "white", */
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
  const [emailList, updateEmailList] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log("Get employee list");
    return () => {
      console.log("clean up");
    };
  }, []);

  const addEmail = () => {
    // add email to list, clear email textfield, disable add
    console.log(`Adding email: ${email} to list`);
    updateEmailList((emailList) => [...emailList, email]);
    setEmail("");
    console.log(`email after add: ${email}`);
  };

  const onClickInvite = async () => {
    console.log("emails in list", emailList);
    console.log("companyName: ", companyName);

    const response = await fetch("/api/invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: { emailList, tenant: { companyName } } }),
    });
    const body = await response.text();
    if (response.status !== 200) throw Error(body.message);
    console.log(body);
  };

  return (
    <div>
      <div>
        <Typography variant="h6" color="initial">
          Invite Employees
        </Typography>
        <div className={classes.invite_employees}>
          <TextField
            id="email"
            label="Email"
            defaultValue={email}
            variant="outlined"
            margin="normal"
            //required={true}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            type="email"
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
            onClick={() => addEmail()}
          >
            Add
          </Button>
        </div>
        <div>
          {emailList.map((email) => (
            <Typography variant="body2">{email}</Typography>
          ))}
        </div>
        <div>
          <Button
            className={classes.buttons}
            variant="contained"
            size="small"
            color="primary"
            onClick={() => onClickInvite()}
          >
            Invite
          </Button>
        </div>
        <Divider style={{ height: "10px" }} />
        <Divider style={{ height: "10px", opacity: 0 }} />
      </div>
      <div>
        <TenantEmployeesTable companyName={companyName}/>
      </div>
    </div>
  );
}
