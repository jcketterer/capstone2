import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './HomePage';
import Logout from './Logout';

const Routes = ({ login, logout, signup, editUser }) => {
  return (
    <Switch>
      <Route exact path to="/">
        <HomePage />
      </Route>
      <Route exact path to="/logout">
        <Logout logoutFunction={logout} />
      </Route>
      <Route exact path to="/">
        <Redirect />
      </Route>
    </Switch>
  );
};

export default Routes;
