import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './HomePage';
import UserProfile from './profile/userProfile';
import Logout from './Logout';
import LoginForm from './forms/LoginForm';
import SignUpForm from './forms/SignUpForm';
import EditUserForm from './forms/EditForm';
import AdminUserDash from './admin/AdminUserDash';
import AddSkillForm from './admin/AddSkillForm';
import AddAdvocateForm from './admin/AddAdvocateForm';

const Routes = ({ login, logout, signup, editUser }) => {
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/admin">
        <AdminUserDash />
      </Route>
      <Route exact path="/addskills">
        <AddSkillForm />
      </Route>
      <Route exact path="/addadvocate">
        <AddAdvocateForm />
      </Route>
      <Route exact path="/login">
        <LoginForm loginFunction={login} />
      </Route>
      <Route exact path="/signup">
        <SignUpForm signUpFunction={signup} />
      </Route>
      <Route exact path="/profile">
        <UserProfile />
      </Route>
      <Route exact path="/edit">
        <EditUserForm editUserFunction={editUser} />
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
