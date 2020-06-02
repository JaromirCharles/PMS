import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

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

export default function CreateJobView({ parentCancelCallback }) {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startAndEndTime, setStartAndEndTime] = useState("");
  const [nrWorkers, setNrWorkers] = useState(0);

  const onClickCancel = () => {
    console.log("Clicked cancel");
    parentCancelCallback(true);
  };

  const onClickSave = () => {
    console.log(`Title: ${title}\n
      Description: ${description}\n
      Location: ${location}\n
      Start & End Time: ${startAndEndTime}\n
      # Workers: ${nrWorkers}`);
  };

  const isDisabled = () => {
    return !(title || description || location || startAndEndTime || nrWorkers);
  };

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <div className={classes.appBar}>
          <AppBar position="relative" color="primary">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Create New Job
              </Typography>
            </Toolbar>
          </AppBar>
        </div>

        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            id="title"
            label="Title"
            defaultValue={title}
            variant="outlined"
            margin="normal"
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
            defaultValue={description}
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
            defaultValue={location}
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
            defaultValue={startAndEndTime}
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

          <Button
            className={classes.button}
            variant="contained"
            color="default"
            size="small"
            startIcon={<AttachFileIcon color="inherit" />}
          >
            Attach Files
          </Button>
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
