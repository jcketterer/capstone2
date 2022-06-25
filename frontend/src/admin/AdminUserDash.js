import React, { useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import UserContext from '../UserContext';

const AdminUserDash = () => {
  const user = useContext(UserContext);

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="AdminUserDash">
      <div className="container justify-content-center">
        <h1>Admin Dash</h1>
        <h3>Skills</h3>
        <ul>
          <li>
            <Link to="/addskills">Add Skills</Link>
          </li>
          <li>
            <Link to="/removeskills">Edit/Remove Skills</Link>
          </li>
        </ul>
        <h3>Advocates</h3>
        <ul>
          <li>
            <Link to="/addadvocate">Add Advocate</Link>
          </li>
          <li>
            <Link to="/removeadvocate">Edit/Remove Advocate</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminUserDash;
