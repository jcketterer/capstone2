import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UserContext from './UserContext';
import './NavBar.css';

const NavBar = () => {
  const user = useContext(UserContext);

  const loggedInNav = () => {
    return (
      <nav class="NavBar navbar navbar-expand-md mx-2">
        <div className="collapse navbar-collapse mx-3" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link mr-4" aria-current="page" to="/login">
                Adovcates
              </NavLink>
            </li>
            <li className="nav-item mr-4">
              <NavLink className="nav-link" to="/signup">
                Skills
              </NavLink>
            </li>
            <li className="nav-item mr-4">
              <NavLink className="nav-link" to="/logout">
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
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
          <NavLink className="nav-link" to="/register">
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
