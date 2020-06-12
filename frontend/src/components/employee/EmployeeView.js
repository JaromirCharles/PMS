import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import JobPopup from "./JobPopup";

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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  hover: {
    "&:hover": {
      //background: "#efefef",
      textDecorationLine: "underline",
      cursor: "pointer",
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
});

const columns = [
  { id: "jobtitle", label: "Job Title" },
  { id: "description", label: "Description" },
  { id: "location", label: "Location", aligh: "left" },
  { id: "startandendtime", label: "Start & End Time" },
  { id: "empty", label: "" },
];

export default function EmployeeView({ cView, companyName }) {
  const [tableData, setTableData] = useState([]);
  const [currentView] = useState([cView]);
  const [showPopup, setShowPopup] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    console.log("componentDidMount", currentView);
    // retrieve data from database
    fetchAvailableJobs();
    var rows = createEmployeeData();
    setTableData(rows);

    createEmployeeData();
  }, []);

  const fetchAvailableJobs = async () => {
    const data = await fetch("/api/tenant_jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenant: { companyName } }),
    });
    const retJobs = await data.json();
    console.log(retJobs);
    setAvailableJobs(retJobs);
  };

  function createEmployeeData() {
    const rows = [
      createData(
        "Rammstein",
        "Construction and Dismantling ...",
        "Stuttgart",
        "08:00 - 20:00",
        "apply"
      ),
      createData(
        "Ninja Warrior",
        "Cleaning up the splashed water.",
        "Zurich",
        "09:00 - 21:00",
        "apply"
      ),
      createData("...", "...", "...", "...", "..."),
      createData("...", "...", "...", "...", "..."),
      createData("...", "...", "...", "...", "..."),
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
    setShowPopup(true);
  };

  return (
    <Fragment>
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
            {/* {tableData.map((row) => (
              <StyledTableRow
                onClick={(event) => handleJobClick(event, row.jobTitle)}
                key={row.jobTitle}
              >
                <StyledTableCell
                  className={classes.hover}
                  component="th"
                  scope="row"
                  hover
                >
                  {row.jobTitle}
                </StyledTableCell>
                <StyledTableCell>{row.description}</StyledTableCell>
                <StyledTableCell>{row.location}</StyledTableCell>
                <StyledTableCell>{row.startAndEndTime}</StyledTableCell>

                <StyledTableCell className={classes.applyHover}>
                  {row.empty}
                </StyledTableCell>
              </StyledTableRow>
            ))} */}
            {availableJobs.map((row) => (
              <StyledTableRow
                onClick={(event) => handleJobClick(event, row.id)}
                key={row.id}
              >
                <StyledTableCell
                  className={classes.hover}
                  component="th"
                  scope="row"
                  hover
                >
                  {row.title}
                </StyledTableCell>
                <StyledTableCell>{row.description}</StyledTableCell>
                <StyledTableCell>{row.location}</StyledTableCell>
                <StyledTableCell>{row.startAndEndTime}</StyledTableCell>

                <StyledTableCell className={classes.applyHover}>
                  apply
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showPopup === true ? <JobPopup /> : null}
    </Fragment>
  );
}
