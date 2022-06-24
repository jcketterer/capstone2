import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import UserContext from './UserContext';
import AlertContext from './AlertContext';
import NavBar from './NavBar';
import AdvocateAlert from './AdvocateAlert';
import Routes from './Routes';
import getHelpFunctions, { useLocalStorage } from './helpers';
import TokenSetter from './TokenSetter';

function App() {
  const [user, setUser] = useLocalStorage('advocate-user', {});
  const [token, setToken] = useLocalStorage('advocate-token', '');

  const [message, setMessage] = useState({
    text: '',
    variant: '',
  });

  const [login, logout, signup, editUser] = getHelpFunctions(
    user,
    setUser,
    setMessage,
    setToken
  );

  return (
    <UserContext.Provider value={user}>
      <NavBar />
      <AlertContext.Provider value={{ message, setMessage }}>
        <Container className="mt-3" fluid="lg">
          <AdvocateAlert />
          <TokenSetter token={token} />
          <Routes login={login} logout={logout} signup={signup} editUser={editUser} />
        </Container>
      </AlertContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
