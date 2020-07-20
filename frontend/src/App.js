import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage2 from "./components/homepage/Homepage2";
import EmployeePersistentDrawer from "./components/menu/EmployeePersistentDrawer";
import TenantPersistentDrawer from "./components/menu/TenantPersistentDrawer";
import EmployeeRegisterForm from "./components/registrationForm/EmployeeRegisterForm";
import LoginForm from "./components/loginForm/LoginForm";
import RegistrationForm from "./components/registrationForm/RegistrationForm";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage2} />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/register" exact component={RegistrationForm} />
        <Route path="/:tenant/jobs" exact component={TenantPersistentDrawer} />
        <Route path="/:tenant/employees" exact component={TenantPersistentDrawer} />
        <Route path="/employee/:tenant" exact component={EmployeePersistentDrawer} />
        <Route path="/register/:tenant/" exact component={EmployeeRegisterForm}/>
      </Switch>
    </Router>
  );
}

export default App;