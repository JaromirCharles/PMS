import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { Tooltip } from "@material-ui/core";
import TenantJobsView from "../tenant/TenantJobsView";
import CreateJobView from "../tenant/CreateJobView";
import EditJobView from "../tenant/EditJobView";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import { ListItemIcon } from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import TenantEmployeesView from "../tenant/TenantEmployeesView";
import { Redirect, Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  buttons: {
    margin: theme.spacing(0.3),
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "lightgrey"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "black"
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

function TenantPersistentDrawer({ match }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true); // set drawer to be open as default
  
  const [view, setView] = useState(
    window.localStorage.getItem("view") || "jobs"
  );
  const [logout, setLogout] = useState(false);
  const [companyName] = useState(match.params.tenant);
  const [jobToEdit, setJobToEdit] = useState({});
  const [jobID, setJobID] = useState("");
  const [showTL, setShowTL] = useState(false)

  useEffect(() => {}, [match]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (from) => {
    window.localStorage.setItem("view", "jobs");
    setView("jobs");
  };

  const employeesClick = () => {
    window.localStorage.setItem("view", "employees");
    setView("employees");
  };

  const onLogout = () => {
    localStorage.removeItem("view")
    setLogout(true);
  };

  const createJobCallback = (value) => {
    window.localStorage.setItem("view", "createJob");
    setView("createJob");
  };

  const cancelCreateJobCallback = (value) => {
    //setCurrentMenu("Jobs in System");
    window.localStorage.setItem("view", "jobs");
    setView("jobs");
    // ---- delete
    /* setJobsView(true);
    setCreateJob(false); */
  };

  const editJobCallback = (jobID) => {
    window.localStorage.setItem("view", "editJob");
    setView("editJob");
    setJobID(jobID)
    // get the respective job information
    fetchJobData(jobID);
  };

  const fetchJobData = async (id) => {
    const jobData = await fetch("/api/get_job_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        companyName,
      }),
    });
    const job = await jobData.json();
    setJobToEdit(job.jobInfo);
  };

  const clickJobCallback = (jobID) => {
    setShowTL(true);
    window.localStorage.setItem("view", "editJob");
    setView("editJob");
    setJobID(jobID)
    fetchJobData(jobID);
  }

  const returnToParentCallback = () => {
    window.localStorage.setItem("view", "jobs");
    setView("jobs");
    setJobToEdit("")
    setShowTL(false);
  };

  const matchView = () => {
    switch (view) {
      case "jobs":
        return (
          <TenantJobsView
            parentCreateJobCallback={createJobCallback}
            parentCancelCallback={cancelCreateJobCallback}
            parentEditJobCallback={editJobCallback}
            parentClickJobCallback={clickJobCallback}
            companyName={companyName}
          />
        );
      case "employees":
        return <TenantEmployeesView companyName={companyName} />;
      case "createJob":
        return (
          <CreateJobView
            job={""}
            jobID={jobID}
            parentCancelCallback={cancelCreateJobCallback}
            companyName={companyName}
          />
        );
      case "editJob":
        return (
          <EditJobView
            companyName={companyName}
            jobID={jobID}
            job={jobToEdit}
            showTL={showTL}
            returnToParentCallback={returnToParentCallback}
          />
        );
      default:
        return (
          <TenantJobsView
            parentCreateJobCallback={createJobCallback}
            companyName={companyName}
          />
        );
    }
  };

  if (logout) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {companyName}
            </Typography>

            <Tooltip title="Logout" arrow>
              <IconButton onClick={() => onLogout()}>
                <ExitToAppTwoToneIcon fontSize="large"/>
              </IconButton>
            </Tooltip>

            <IconButton>
              <AccountBoxIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton style={{ color: "black" }} onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>

          <Divider />

          <List>
            <ListItem
              button
              autoFocus={false}
              key={"Jobs in System"}
              component={Link}
              to={`/${match.params.tenant}/jobs`}
              onClick={() => handleClick("Jobs in System")}
            >
              <ListItemIcon>
                <WorkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={"Jobs in System"} />
            </ListItem>

            <ListItem
              button
              autoFocus={false}
              key={"Employees"}
              component={Link}
              to={`/${match.params.tenant}/employees`}
              onClick={() => employeesClick()}
            >
              <ListItemIcon>
                <PeopleAltIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={"Employees"} />
            </ListItem>
          </List>
        </Drawer>{" "}
        {/* end of drawer */}
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />

          {matchView()}
        </main>
      </div>
    );
  }
}

export default TenantPersistentDrawer;
