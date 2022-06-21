import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import UserContext from './UserContext';
import TokenSetter from './TokenSetter';
import Homepage from './Homepage';
import getHelpers, { useLocalStorage } from './Helper';
import AdvocateAlert from './AdvocateAlert';
import AlertContext from './AlertContext';
import './App.css';

function App() {
  const [user, setUser] = useLocalStorage('advocate-user', {});
  const [token, setToken] = useLocalStorage('advocate-token', '');

  const [message, setMessage] = useState({
    text: '',
    variant: '',
  });

  const [logIn, logOut, signUp, editUser] = getHelpers(user, setUser, setMessage, setToken);

  return (
    <UserContext.Provider value={user}>
      <AlertContext.Provider value={{ message, setMessage }}>
        <Container className="mt-3" fluid="lg">
          <div className="App">
            <Homepage />
          </div>
        </Container>
      </AlertContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
