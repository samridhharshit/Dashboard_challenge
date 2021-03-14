import React from 'react';
import './App.css';
import {AuthProvider} from "./auth";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Login from "./authentication/login";
import SignUp from "./authentication/signUp";
import Navigation from "./modules/navigation";
import Dashboard from "./modules/dashboard";

function App() {
  return (
      <AuthProvider>
          <Router>
              <Navigation />
              <Switch>
                  {/*<PrivateRoute exact path="/" component={Home} />*/}
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={SignUp} />
                  <Route path="/dashboard" component={Dashboard} />
                  <Redirect to={'/signup'} />
              </Switch>
          </Router>
      </AuthProvider>
  );
}

export default App;
