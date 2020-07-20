import React, { Component, Fragment } from "react";
import { Grid, Cell } from "react-mdl";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";

class Homepage2 extends Component {
  render() {
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <Grid className="homepage-grid">
          <Cell col={12}>
            <Fragment>
              <AppBar
                style={{ backgroundColor: "lightgrey" }}
                className="appBar"
              >
                <Toolbar>
                  <Typography variant="h6" className="title">
                    <b style={{ fontSize: 35 }}>pms</b> .{" "}
                    <b style={{ fontSize: 35 }}>p</b>ersonnel{" "}
                    <b style={{ fontSize: 35 }}>m</b>anagement{" "}
                    <b style={{ fontSize: 35 }}>s</b>ystem
                  </Typography>
                  <Button
                    style={{
                      backgroundColor: "lightgrey",
                    }}
                    className="button"
                    variant="outlined"
                    component={Link}
                    to="/register"
                  >
                    Register
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "lightgrey",
                    }}
                    className="button"
                    variant="outlined"
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                </Toolbar>
              </AppBar>
            </Fragment>
            <div className="content">
              <p className="p-title">
                Tired of the hassle organizing your employees for a job?
              </p>
              <p className="p-text">
                {" "}
                Look no further, PMS is here to make managing your crew easier,
                saving you the stress as well as precious time. Relax, pay
                attention to other tasks and let PMS take care of organizing
                your work force.
              </p>
              <Button
                style={{ color: "black", backgroundColor: "lightgrey" }}
                variant="outlined"
                size="large"
                color="primary"
                component={Link}
                to="/register"
              >
                Register your company today
              </Button>
                    </div>
                    <div className="footer">
                        <hr/>
                        <p>&copy; 2020 pms.com</p>
                    </div>
          </Cell>
        </Grid>
      </div>
    );
  }
}
export default Homepage2;
