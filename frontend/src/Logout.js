import React, { useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import UserContext from './UserContext';

const Logout = ({ logoutFunction }) => {
  const user = useContext(UserContext);

  if (!user.username) {
    return <Redirect to="/" />;
  }

  const delayThenLogout = e => {
    e.preventDefault();
    setTimeout(() => logoutFunction(), 300);
  };

  return (
    <div className="Logout">
      <Link to="/" onClick={delayThenLogout}>
        Confirm Logout{' '}
      </Link>
    </div>
  );
};

export default Logout;
