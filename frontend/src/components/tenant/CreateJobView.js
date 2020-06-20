import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TransferList from "./TransferList";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100ch",
  },
  appBar: {
    flexGrow: 1,
    display: "flex",
    //paddingLeft: 10,
    //paddingRight: 100,
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

export default function CreateJobView({
  jobID,
  job,
  companyName,
  parentCancelCallback,
  header,
  showWorkersList,
}) {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startAndEndTime, setStartAndEndTime] = useState("");
  const [nrWorkers, setNrWorkers] = useState(0);

  useEffect(() => {
    console.log("showWorkersList: ", showWorkersList)
    setTitle(job.title)
    setDescription(job.description)
    setLocation(job.location)
    setStartAndEndTime(job.startAndEndTime)
    setNrWorkers(job.nrWorkersNeeded)
  }, []);

  const onClickCancel = () => {
    parentCancelCallback(true);
  };

  const onClickSave = async () => {
    console.log(`Title: ${title}\n
      Description: ${description}\n
      Location: ${location}\n
      Start & End Time: ${startAndEndTime}\n
      # Workers: ${nrWorkers}`);

    const newJob = {
      title: title,
      description: description,
      location: location,
      startAndEndTime: startAndEndTime,
      nrWorkersNeeded: nrWorkers,
    };

    // call to api to persist new job to firebase firestore
    if (job === "") {
      const response = await fetch("/api/tenant/create_job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newJob: { newJob, tenant: { companyName } } }),
      });
      const body = await response.text();
      if (response.status !== 200) throw Error(body.message);
    } else {
      const response = await fetch("/api/tenant/edit_job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobID, newJob, companyName }),
      });
      const body = await response.text();
      if (response.status !== 200) throw Error(body.message);
    }
    parentCancelCallback(true);
  };

  const isDisabled = () => {
    if (job !== "") {
      return false
    } else {
      return !(title && description && location && startAndEndTime && nrWorkers);
    }
  };

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <div className={classes.appBar}>
          <AppBar position="relative" color="primary">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                {header ? header : "Create New Job"}
              </Typography>
            </Toolbar>
          </AppBar>
        </div>

        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            id="title"
            label="title"
            defaultValue={job === "" ? title : job.title}
            variant="outlined"
            margin="normal"
            disabled={showWorkersList}
            //required={true}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            onChange={(event) => {
              const { value } = event.target;
              setTitle(value);
            }}
          />
          <br></br>
          <TextField
            id="description"
            label="Description"
            defaultValue={job === "" ? description : job.description}
            multiline={true}
            rowsMax={4}
            placeholder=""
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(event) => {
              const { value } = event.target;
              setDescription(value);
            }}
          />
          <br></br>
          <TextField
            id="location"
            label="Location"
            defaultValue={job === "" ? location : job.location}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            size="small"
            onChange={(event) => {
              const { value } = event.target;
              setLocation(value);
            }}
          />
          <br></br>
          <TextField
            id="startandendtime"
            label="Start & End Time"
            defaultValue={job === "" ? startAndEndTime : job.startAndEndTime}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            size="small"
            onChange={(event) => {
              const { value } = event.target;
              setStartAndEndTime(value);
            }}
          />
          <br></br>
          <TextField
            id="outlined-number"
            label="# Workers"
            type="number"
            margin="normal"
            defaultValue={job === "" ? nrWorkers : job.nrWorkersNeeded}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            size="small"
            onChange={(event) => {
              const { value } = event.target;
              setNrWorkers(value);
            }}
          />
          <br></br>
            {showWorkersList ?null: <Button
            className={classes.button}
            variant="contained"
            color="default"
            size="small"
            startIcon={<AttachFileIcon color="inherit" />}
          >
            Attach Files
          </Button>}

          {showWorkersList ? <TransferList jobID={jobID} companyName={companyName}/> : null}

          
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
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={() => onClickCancel()}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </div>
  );
}
