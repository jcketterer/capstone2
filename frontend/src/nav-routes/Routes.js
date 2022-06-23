import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Homepage from '../homepage/Homepage';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import UserProfileForm from '../profile/UserProfileForm';
import PrivateRoutes from './PrivateRoutes';

const Routes = ({ login, register }) => {
  console.debug('Routes', `login=${typeof login}`, `register=${typeof register}`);

  return (
    <div className="pt-5">
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>
        <Route exact path="/register">
          <RegisterForm register={register} />
        </Route>
        <PrivateRoutes exact path="/profile">
          <UserProfileForm />
        </PrivateRoutes>
      </Switch>
    </div>
  );
};

export default Routes;
