import React, { useState, useEffect } from 'react';
import UserContext from './auth/UserContext';
import HomePage from './homepage/Homepage';
import LoadingSpinner from './common/LoadingSpinner';
import NavBar from './nav-routes/NavBar';
import Routes from './nav-routes/Routes';
import useLocalStorage from './hooks/useLocalStorage';
import AdvocateAPI from './api';
import jwt from 'jsonwebtoken';
import './App.css';

export const TOKEN_ID = 'advo-token';

function App() {
  const [currUser, setCurrUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_ID);

  console.debug('App', 'infoLoaded=', infoLoaded, 'currUser=', currUser, 'token=', token);

  useEffect(
    function loadUser() {
      console.debug('App useEffect loadUser', 'token=', token);

      const getCurrUser = async () => {
        if (token) {
          try {
            let { username } = jwt.decode(token);
            AdvocateAPI.token = token;
            let currUser = await AdvocateAPI.getUser(username);
            setCurrUser(currUser);
          } catch (err) {
            console.error('App loadUserInfo: error loading', err);
            setCurrUser(null);
          }
        }
        setInfoLoaded(true);
      };
      setInfoLoaded(false);
      getCurrUser();
    },
    [token]
  );

  const logout = () => {
    setCurrUser(null);
    setToken(null);
  };

  const register = async registerData => {
    try {
      let token = await AdvocateAPI.reg(registerData);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error('registration failed', err);
      return { success: false, err };
    }
  };

  const login = async loginData => {
    try {
      let token = await AdvocateAPI.login(loginData);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error('login failed', err);
      return { success: false, err };
    }
  };

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <UserContext.Provider value={{ currUser, setCurrUser }}>
      <div className="App">
        <NavBar logout={logout} />
        <Routes login={login} register={register} />
      </div>
    </UserContext.Provider>
  );
}

export default App;
