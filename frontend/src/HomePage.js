import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from './UserContext';
import './HomePage.css';

const HomePage = () => {
  const user = useContext(UserContext);

  return (
    <div className="display-1 mt-3 text-center">
      <h1 style={{ fontSize: '72px' }}>Advocate Search</h1>
      <h4 className="my-4">One-Stop-Shop For All Info On Advocates!</h4>
      {user.username ? (
        <h2>Welcome back, {user.firstName}</h2>
      ) : (
        <span>
          <Link className="login btn btn-primary m-2" to="/login">
            Login
          </Link>
          <Link className="sign-up btn btn-primary" to="/signup">
            Sign Up
          </Link>
        </span>
      )}
    </div>
  );
};

export default HomePage;
