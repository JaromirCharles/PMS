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
import CreateJobView from "./CreateJobView";

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
  { id: "dateTitle", label: "Date" },
  { id: "jobtitle", label: "Job Title" },
  { id: "description", label: "Description" },
  { id: "location", label: "Location", aligh: "left" },
  { id: "startandendtime", label: "Start & End Time" },
  { id: "members", label: "Members" },
];

export default function TenantJobsView({
  companyName,
  parentCancelCallback,
  parentCreateJobCallback,
  parentEditJobCallback,
  parentClickJobCallback
}) {
  const classes = useStyles();
  const [deleteJobList, updateDeleteJobList] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(false);
  const [retrievedJob, setRetrievedJob] = useState({});
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [deleteJobList, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJobs = async () => {
    const data = await fetch("/api/tenant_jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenant: { companyName } }),
    });
    const retJobs = await data.json();
    setJobs(retJobs);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString('en-US', options)
  };

  const onCreateJob = () => {
    parentCreateJobCallback(true);
  };

  const addJobToDeleteList = (job) => {
    updateDeleteJobList((deleteJobList) => [...deleteJobList, job]);
  };

  const removeJobFromDeleteList = (jobToDelete) => {
    //let toDelete = jobToDelete;
    updateDeleteJobList(deleteJobList.filter((job) => job !== jobToDelete));
  };

  const deleteJobListEmpty = () => {
    return !deleteJobList.length > 0;
  };

  const deleteJobs = async () => {
    const response = await fetch("/api/tenant/delete_jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteJobList: { deleteJobList, tenant: { companyName } },
      }),
    });
    const body = await response.text();
    if (response.status !== 200) throw Error(body.message);
    updateDeleteJobList([]);
  };

  const onClickEdit = async (jobID) => {
    parentEditJobCallback(jobID)
  };

  function parentCallback() {
    console.log("here")
    parentCancelCallback(true);
    setRefresh(!refresh);
    setEditJob(false);
  }

  function EditJobView() {
    return (
      <CreateJobView
        job={retrievedJob}
        companyName={companyName}
        parentCancelCallback={parentCallback}
        header={"Edit"}
        showWorkersList={onClickTitle? true : false}
      />
    );
  }

  function onClickTitle(jobID) {
    parentClickJobCallback(jobID)
  }

  if (editJob) {
    return <EditJobView />;
  } else {
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
          {/* <Button
            className={classes.buttons}
            variant="contained"
            color="default"
            size="small"
            startIcon={<EditIcon color="inherit" />}
          >
            Edit
          </Button> */}
        </div>

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow >
                {columns.map((column) => (
                  <StyledTableCell style={{backgroundColor: "#A7C9DC", color: "black"}} key={column.id}>
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {jobs.map((row) => (
                <StyledTableRow key={row.id}>
                  <Checkbox
                    inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                    size="small"
                    onChange={(event) => {
                      event.target.checked
                        ? addJobToDeleteList(row.id)
                        : removeJobFromDeleteList(row.id);
                    }}
                  />
                  <Checkbox
                    inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                    size="small"
                    color="default"
                    checkedIcon={<EditIcon fontSize="small" color="inherit"/>}
                    icon={<EditIcon fontSize="small" color="inherit"/>}
                    onClick={() => onClickEdit(row.id)}
                  />
                  {/* <Button
                    style={{ outline: 0, width: '0em' }}
                    variant="text"
                    color="default"
                    size="small"
                    startIcon={<EditIcon fontSize="small" color="inherit" />}
                    onClick={() => onClickEdit(row.id)}
                  ></Button> */}
                   <StyledTableCell>{ formatDate(row.date) }</StyledTableCell>
                  <StyledTableCell
                    className={classes.hover}
                    component="th"
                    scope="row"
                    hover="true"
                    onClick={() => onClickTitle(row.id)}
                  >
                    {row.title}
                  </StyledTableCell>
                  <StyledTableCell>{row.description}</StyledTableCell>
                  <StyledTableCell>{row.location}</StyledTableCell>
                  <StyledTableCell>{row.startAndEndTime}</StyledTableCell>
                  <StyledTableCell>{row.selectedWorkers.length} / {row.nrWorkersNeeded}</StyledTableCell>
                  {/* <StyledTableCell>{row.empty}</StyledTableCell> */}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fragment>
    );
  }
}
