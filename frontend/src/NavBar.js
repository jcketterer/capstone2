import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UserContext from './UserContext';
import './NavBar.css';

const NavBar = () => {
  const user = useContext(UserContext);

  const loggedInNav = () => {
    return (
      <ul className="navbar-nav">
        {user.isAdmin ? (
          <NavLink className="nav-link" to="/admin">
            Admin Dash
          </NavLink>
        ) : null}
        <li className="nav-item">
          <NavLink className="nav-link" to="/advocate">
            Adovcates
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/skills">
            Skills
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/logout">
            Logout
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/profile">
            {user.firstName} Profile
          </NavLink>
        </li>
      </ul>
    );
  };

  const loggedOutNav = () => {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/signup">
            Register
          </NavLink>
        </li>
      </ul>
    );
  };

  return (
    <nav className="NavBar navbar navbar-expand-md ml-2">
      <Link className="navbar-brand" to="/">
        <img className="logo" src="/assets/images/cvnalogo.png" alt="" />
        Advocate Search!
      </Link>
      {user.username ? loggedInNav() : loggedOutNav()}
    </nav>
  );
};

export default NavBar;
