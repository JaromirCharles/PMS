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
    { id: "jobtitle", label: "Job Title" },
    { id: "description", label: "Description" },
    { id: "location", label: "Location", aligh: "left" },
    { id: "startandendtime", label: "Start & End Time" },
    { id: "empty", label: "" },
  ];

export default function AppliedJobsView({ companyName, employeeEmail }) {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        console.log("::::");
        console.log("componentDidMount AppliedJobsView");
        fetchAppliedJobs();
      }, []);

    const fetchAppliedJobs = async () => {
        console.log("fetchAppliedJobs: " + companyName);
        const data = await fetch("/api/employee/get_AppliedJobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeEmail, companyName }),
        });
        const retJobs = await data.json();
        console.log(retJobs);
        setAppliedJobs(retJobs);
      };
    
      const handleCancelClick = async (event, jobId) => {
        const data = await fetch("/api/employee/cancel_AppliedJob", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeEmail , companyName, jobId }),
        });
        const retJobs = await data.json();
        fetchAppliedJobs();
      }

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
              {appliedJobs.map((row) => (
                <StyledTableRow
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
                  
                  <StyledTableCell className={classes.applyHover}
                   onClick={(event) => handleCancelClick(event, row.id)}
                  >
                  cancel
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fragment>
    );
}