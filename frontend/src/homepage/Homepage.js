import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../auth/UserContext';
import './Homepage.css';

const Homepage = () => {
  const { currUser } = useContext(UserContext);

  console.debug('Homepage', 'currUser=', currUser);

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 font-weight-bold">Advocate Search!</h1>
        <p className="lead">
          The fast and easy way to search for Advocates and their information!
        </p>

        {currUser ? (
          <h2>Welcome back, {currUser.firstName || currUser.username}!</h2>
        ) : (
          <p>
            <Link className="btn btn-primary font-weight-bold m-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary font-weight-bold" to="/register">
              Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
