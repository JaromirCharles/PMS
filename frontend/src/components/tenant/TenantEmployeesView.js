import React, { useState, useEffect } from "react";
import {
  makeStyles,
  CardContent,
  CardActions,
  IconButton,
  Collapse,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import clsx from 'clsx';

import PropTypes from 'prop-types';
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import { Divider } from "@material-ui/core";
import Card from "@material-ui/core/Card";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
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
      margin: theme.spacing(1)
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
      },
}));

const headCells = [
    {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
    {id: 'email', numeric: false, disablePadding: false, label: 'Email'},
    {id: 'status', numeric: false, disablePadding: false, label: 'Status'}
]

export default function TenantEmployeesView(props) {
  const classes = useStyles();
  const [emailList, updateEmailList] = useState([]);
  const [email, setEmail] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    
  const [expanded, setExpanded] = React.useState(false);

  useEffect(() => {
    console.log("Get employee list");
    const empList = createEmployeeList();
    setEmployeeList(empList);
    return () => {
      console.log("clean up");
    };
  }, []);
    
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function createEmployeeList() {
    const list = [
      createEmployee("Jaromir Charles", "Accepted", "jaromir.charles@htwg-konstanz.de"),
      createEmployee("Benjamin Herrmann", "Request pending", "benjamin.herrmann@htwg-konstanz.de"),
    ];
    return list;
  }
  function createEmployee(name, status, email) {
    return { name, status, email };
  }

  const addEmail = () => {
    // add email to list, clear email textfield, disable add
    console.log(`Adding email: ${email} to list`);
    updateEmailList((emailList) => [...emailList, email]);
    setEmail("");
    console.log(`email after add: ${email}`);
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
            autoComplete={false}
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
          >
            Invite
          </Button>
              </div >
              <Divider style={{height: "10px"}}/>
              <Divider variant style={{height: "10px", opacity: 0.}}/>
      </div>
      <div>
       <TenantEmployeesTable/>
      </div>
    </div>
  );
}
