import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from '../auth/UserContext';

const PrivateRoutes = ({ exact, path, children }) => {
  const { currUser } = useContext(UserContext);

  console.debug('PrivateRoutes', 'exact=', exact, 'path=', path, 'currUser=', currUser);

  if (!currUser) {
    return <Redirect to="/login" />;
  }

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  );
};

export default PrivateRoutes;
