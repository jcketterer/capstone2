import React, { useState, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';

const UserProfile = () => {
  const user = useContext(UserContext);

  // const [skills, setSkills] = useState([])
  // const [advocates, setAdvocates] = useState([])

  return (
    <div className="UserProfile">
      <div className="container text-center">
        <h2>Username: {user.username}</h2>
        <h5>
          Name: {user.firstName} {user.lastName}
        </h5>
        <h5>Email: {user.email}</h5>
        <hr />
        <Link to="/edit">
          <button className="btn btn-primary ml-auto">Edit Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
