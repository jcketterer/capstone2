import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from './UserContext';

const Homepage = () => {
  const user = useContext(UserContext);
  return (
    <div>
      <h1 className="display-1" style={{ fontSize: '72px' }}>
        Advo-App
      </h1>
      <h4 className="my-4">Please sign in.</h4>
      {user.username ? (
        <h2>Welcome Back, {user.firstName}</h2>
      ) : (
        <span>
          <Link className="btn btn-primary mr-1" to="/login">
            Log in
          </Link>
          <Link className="btn btn-primary ml-1" to="/signup">
            Sign Up
          </Link>
        </span>
      )}
    </div>
  );
};

export default Homepage;
