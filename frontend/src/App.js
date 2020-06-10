import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage from "./components/homepage/Homepage";
import EmployeePersistentDrawer from "./components/menu/EmployeePersistentDrawer";
import TenantPersistentDrawer from "./components/menu/TenantPersistentDrawer";
import EmployeeRegisterForm from "./components/registrationForm/EmployeeRegisterForm";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
        {/* <Route path="/tenant" component={TenantPersistentDrawer} /> */}
        <Route path="/:tenant/jobs" exact component={TenantPersistentDrawer} />
        <Route path="/:tenant/employees" exact component={TenantPersistentDrawer} />
        <Route path="/employee" component={EmployeePersistentDrawer} />
        <Route path="/register/:tenant/" component={EmployeeRegisterForm}/>
      </Switch>
    </Router>
  );
}

export default App;