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
import TenantView from "../tenant/TenantView";
import CreateJobView from "../tenant/CreateJobView";
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
  const [currentMenu, setCurrentMenu] = useState("Jobs in System");
  const [logout, setLogout] = useState(false);
  const [jobsView, setJobsView] = useState(true);
  const [createJob, setCreateJob] = useState(false);
  const [employeeView, setEmployeeView] = useState(false);
  const [companyName] = useState(match.params.tenant);

  useEffect(() => {
    console.log("ComponentDidMount");
    console.log(match);
  }, [match]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (from) => {
    console.log("Clicked Menu Item: " + from);
    setJobsView(true);
    setCreateJob(false);
    setEmployeeView(false);
    setCurrentMenu(from);
  };

  const onLogout = () => {
    console.log("Clicked Logout");
    setLogout(true);
  };

  const createJobCallback = (value) => {
    console.log("Received from child", value);
    setCurrentMenu("");
    setCreateJob(value);
    setJobsView(false);
  };

  const cancelCreateJobCallback = (value) => {
    setCurrentMenu("Jobs in System");
    setJobsView(true);
    setCreateJob(false);
  };

  const employeesClick = () => {
    console.log("clicked employees");
    setCurrentMenu("");
    setJobsView(false);
    setCreateJob(false);
    setEmployeeView(true);
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
                <ExitToAppTwoToneIcon fontSize="large" />
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
          <Typography variant="subtitle1" paragraph>
            {currentMenu}
          </Typography>

          {jobsView ? (
            <TenantView
              parentCreateJobCallback={createJobCallback}
              companyName={companyName}
            />
          ) : null}
          {createJob ? (
            <CreateJobView
              parentCancelCallback={cancelCreateJobCallback}
              companyName={companyName}
            />
          ) : null}
          {employeeView ? (
            <TenantEmployeesView companyName={companyName} />
          ) : null}
        </main>
      </div>
    );
  }
}

export default TenantPersistentDrawer;
