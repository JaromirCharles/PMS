import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TransferList from "./TransferList";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100ch",
  },
  appBar: {
    flexGrow: 1,
    display: "flex",
    paddingBottom: 5,
  },
  form: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(0.3),
    marginBottom: 10,
  },
}));

function disablePrevDates(startDate) {
  const startSeconds = Date.parse(startDate);
  return (date) => {
    return Date.parse(date) < startSeconds;
  };
}

export default function EditJobView({
  companyName,
  jobID,
  job,
  showTL,
  returnToParentCallback,
}) {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startAndEndTime, setStartAndEndTime] = useState("");
  const [nrWorkers, setNrWorkers] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const startDate = new Date();

  useEffect(() => {
    setSelectedDate(job.date);
    setTitle(job.title);
    setDescription(job.description);
    setLocation(job.location);
    setStartAndEndTime(job.startAndEndTime);
    setNrWorkers(job.nrWorkersNeeded);
  }, [
    job.date,
    job.description,
    job.location,
    job.title,
    job.startAndEndTime,
    job.nrWorkersNeeded,
  ]);

  const onClickCancel = () => {
    returnToParentCallback();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onClickSave = async () => {
    const newJob = {
      date: selectedDate,
      title: title,
      description: description,
      location: location,
      startAndEndTime: startAndEndTime,
      nrWorkersNeeded: nrWorkers,
    };

    const response = await fetch("/api/tenant/edit_job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobID, newJob, companyName }),
    });
    await response.text();
    if (response.status !== 200) {
      console.log("Response status error");
    }
    returnToParentCallback();
  };

  const isDisabled = () => {
    return !(
      selectedDate &&
      title &&
      description &&
      location &&
      startAndEndTime &&
      nrWorkers
    );
  };

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <div className={classes.appBar}>
          <AppBar position="relative" color="primary">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Edit job
              </Typography>
            </Toolbar>
          </AppBar>
        </div>

        <form className={classes.form} noValidate autoComplete="off">
          <form className={classes.container} noValidate>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                shouldDisableDate={disablePrevDates(startDate)}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date_time"
                label="Date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </form>

          <TextField
            id="title"
            label="Title"
            value={title}
            variant="outlined"
            margin="normal"
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
            value={description}
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
            value={location}
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
            label="Start"
            value={startAndEndTime}
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
            value={nrWorkers}
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
          {showTL ? (
            <TransferList jobID={jobID} companyName={companyName} />
          ) : null}
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
