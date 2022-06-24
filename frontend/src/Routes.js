import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './HomePage';
import Logout from './Logout';
import LoginForm from './forms/LoginForm';

const Routes = ({ login, logout, signup, editUser }) => {
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/login">
        <LoginForm loginFunction={login} />
      </Route>
      <Route exact path="/logout">
        <Logout logoutFunction={logout} />
      </Route>
      <Route exact path="/">
        <Redirect />
      </Route>
    </Switch>
  );
};

export default Routes;
