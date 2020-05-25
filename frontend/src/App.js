import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage from "./components/homepage/Homepage";
import EmployeePersistentDrawer from "./components/menu/EmployeePersistentDrawer";
import TenantPersistentDrawer from "./components/menu/TenantPersistentDrawer";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/tenant" component={TenantPersistentDrawer} />
        <Route path="/employee" component={EmployeePersistentDrawer} />
      </Switch>
    </Router>
  );
}

export default App;