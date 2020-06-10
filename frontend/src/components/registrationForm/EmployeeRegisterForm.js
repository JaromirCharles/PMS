import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50ch",
    margin: "auto",
    border: "1px solid green",
    padding: "10px",
  },
  appBar: {
    flexGrow: 1,
    display: "flex",
    paddingBottom: 5,
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

export default function EmployeeRegisterForm() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dob, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { tenant } = useParams();

  const onClickSave = async() => {
    console.log(`Tenant:${tenant} \n
    Name: ${name}\n
      Surname: ${surname}\n
      DOB: ${dob}\n
      Email: ${email}\n
      password: ${password}\n
      confirmed-password: ${confirmPassword}\n`);
      const employee = {
          name: name ,
          surname: surname ,
          email: email,
          password: password,
          tenant: tenant,
      };
      console.log("employee: ", employee)
      const response = await fetch("/api/register_employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({ employee: { employee } }),
      });
      const body = await response.text();
      if (response.status !== 200) throw Error(body.message)
  };

  const isDisabled = () => {
    return !(name || surname || dob || email || password || confirmPassword);
  };

  return (
    <div className={classes.root}>
      <div className={classes.appBar}>
        <AppBar position="relative" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Register
            </Typography>
          </Toolbar>
        </AppBar>
      </div>

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
        <TextField
          id="dateofbirth"
          label="Date of birth"
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
        <br></br>

        <TextField
          id="email"
          label="Email"
          defaultValue={email}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          type="email"
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
          type="text"
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
          type="text"
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
  );
}
