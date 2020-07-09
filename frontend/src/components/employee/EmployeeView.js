import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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
  { id: "dateTitle", label: "Date" },
  { id: "jobtitle", label: "Job Title" },
  { id: "description", label: "Description" },
  { id: "location", label: "Location", aligh: "left" },
  { id: "startandendtime", label: "Start & End Time" },
  { id: "empty", label: "" },
];

export default function EmployeeView({ companyName, employeeEmail }) {

  const [availableJobs, setAvailableJobs] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetchAvailableJobs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAvailableJobs = async () => {
    const data = await fetch("/api/available_jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeEmail , companyName }),
    });
    const retJobs = await data.json();
    setAvailableJobs(retJobs);
  };

  const handleApplyClick = async (event, jobId) => {
    const response = await fetch("/api/employee/add_AppliedJob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeEmail , companyName, jobId }),
    });
    const body = await response.text();
    if (response.status !== 200) throw Error(body.message);
    fetchAvailableJobs();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString('en-US', options)
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
          {availableJobs.map((row) => (
            <StyledTableRow
              key={row.id}
            >
               <StyledTableCell>{formatDate(row.date)}</StyledTableCell>
              <StyledTableCell
                className={classes.hover}
                component="th"
                scope="row"
              >
                {row.title}
              </StyledTableCell>
              <StyledTableCell>{row.description}</StyledTableCell>
              <StyledTableCell>{row.location}</StyledTableCell>
              <StyledTableCell>{row.startAndEndTime}</StyledTableCell>
              
              <StyledTableCell className={classes.applyHover} 
                onClick={(event) => handleApplyClick(event, row.id)}
              >
                apply
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Fragment>
  );
}
