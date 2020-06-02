import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import Checkbox from "@material-ui/core/Checkbox";
//import CreateJobPopup from "./CreateJobPopup";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "blue",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  buttons: {
    margin: theme.spacing(0.3),
  },
  hover: {
    "&:hover": {
      //background: "#efefef",
      textDecorationLine: "underline",
      cursor: "pointer",
      fontWeight: "bold",
    },
  },
  applyHover: {
    "&:hover": {
      //background: "#efefef",
      textDecorationLine: "underline",
      cursor: "pointer",
      color: "green",
    },
  },
}));

const columns = [
  { id: "checkbox", label: "" },
  { id: "jobtitle", label: "Job Title" },
  { id: "description", label: "Description" },
  { id: "location", label: "Location", aligh: "left" },
  { id: "startandendtime", label: "Start & End Time" },
  { id: "members", label: "Members" },
];

export default function TenantView({ parentCreateJobCallback }) {
  const [tableData, setTableData] = useState([]);
  const classes = useStyles();
  const [deleteJobList, updateDeleteJobList] = useState([]);

  useEffect(() => {
    console.log("componentDidMount");
    // retrieve data from database
    /* async function fetchData() {
          const result = await axios.get('http://...')
          rows = createData()
          setTableData(rows)
        }
        fetchData(); */
    var rows = createEmployeeData();
    setTableData(rows);

    createEmployeeData();
  }, []);

  function createEmployeeData() {
    const rows = [
      createData(
        "Rammstein",
        "Construction and Dismantling ...",
        "Stuttgart",
        "08:00 - 20:00",
        "5/7"
      ),
      createData(
        "Ninja Warrior",
        "Cleaning up the splashed water.",
        "Zurich",
        "09:00 - 21:00",
        "0/5"
      ),
      createData("...", "...", "...", "...", "..."),
      createData("....", "...", "...", "...", "..."),
      createData(".....", "...", "...", "...", "..."),
    ];
    return rows;
  }

  function createData(jobTitle, description, location, startAndEndTime, empty) {
    return { jobTitle, description, location, startAndEndTime, empty };
  }

  const handleJobClick = (event, name) => {
    /* 
          TODO: id instead of name as argument. new popup, fetch job information from the 
          specified id and display it.
        */
    console.log("Clicked: ", name);
  };

  const onCreateJob = () => {
    //setShowCreateJobPopup(true)
    parentCreateJobCallback(true);
  };

  const addJobToDeleteList = (job) => {
    console.log("adding job to list: ", job);
    updateDeleteJobList((deleteJobList) => [...deleteJobList, job]);
  };

  const removeJobFromDeleteList = (jobToDelete) => {
    console.log("removing job from list: ", jobToDelete);
    let toDelete = jobToDelete;
    updateDeleteJobList(
      deleteJobList.filter((jobToDelete) => jobToDelete !== toDelete)
    );
  };

  const deleteJobListEmpty = () => {
    return !deleteJobList.length > 0;
  };

  const deleteJobs = () => {
    console.log("Deleting jobs: ", deleteJobList);
  };

  return (
    <Fragment>
      <div className={classes.buttons}>
        <Button
          className={classes.buttons}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onCreateJob()}
          startIcon={<AddIcon />}
        >
          Create Job
        </Button>
        <Button
          className={classes.buttons}
          variant="contained"
          color="secondary"
          size="small"
          disabled={deleteJobListEmpty()}
          startIcon={<DeleteIcon />}
          onClick={() => deleteJobs()}
        >
          Delete
        </Button>
        <Button
          className={classes.buttons}
          variant="contained"
          color="default"
          size="small"
          startIcon={<EditIcon color="inherit" />}
        >
          Edit
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <StyledTableRow key={row.jobTitle}>
                <Checkbox
                  inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                  size="small"
                  onChange={(event) => {
                    event.target.checked
                      ? addJobToDeleteList(row.jobTitle)
                      : removeJobFromDeleteList(row.jobTitle);
                  }}
                />
                <StyledTableCell
                  className={classes.hover}
                  component="th"
                  scope="row"
                  hover="true"
                >
                  {row.jobTitle}
                </StyledTableCell>
                <StyledTableCell>{row.description}</StyledTableCell>
                <StyledTableCell>{row.location}</StyledTableCell>
                <StyledTableCell>{row.startAndEndTime}</StyledTableCell>

                <StyledTableCell>{row.empty}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* {showCreateJobPopup === true ? <CreateJobPopup /> : null} */}
    </Fragment>
  );
}
