import { useState } from 'react';
import AdvocateAPI from './api';

const getHelpers = (user, setUser, setMessage, setToken) => {
  async function logIn({ username, password }) {
    try {
      let loginRes = await AdvocateAPI.login(username, password);
      if (loginRes) {
        let newUser = await AdvocateAPI.getUser(username);
        setToken(loginRes);
        setUser(newUser);
        setMessage({
          text: 'Login Successful',
          variant: 'success',
        });
      } else {
        throw new Error('Login Failed/Bad Credentials');
      }
    } catch (err) {
      setMessage({
        text: 'Could not login with username and password provided',
        variant: 'danger',
      });
    }
  }

  const logOut = () => {
    if (user.username) {
      setUser({});
      AdvocateAPI.setToken('');
      setMessage({ text: 'Successfully logged out!', variant: 'info' });
    }
  };

  async function signUp(signUpData) {
    const { username, password, email, firstName, lastName } = signUpData;

    try {
      let newUser = await AdvocateAPI.createNewUser(
        username,
        password,
        email,
        firstName,
        lastName
      );
      setUser(newUser.user);
      setToken(newUser.token);

      setMessage({
        text: `Thank you ${username} you have successfully created your profile!`,
        variant: 'success',
      });
    } catch (err) {
      console.log(err);
      setMessage({
        text: `Error creating user...Username ${username} is already in use!`,
        variant: 'danger',
      });
    }
  }

  async function editUser(editUserData) {
    const { username, password, firstName, lastName, email } = editUserData;

    try {
      let editRes = await AdvocateAPI.updateUserInfo(
        username,
        password,
        firstName,
        lastName,
        email
      );
      setUser(editRes.user);
      setMessage({ text: 'User updated!', variant: 'success' });
    } catch (err) {
      console.log(err);
      setMessage({
        message:
          'Could not update user. Please make sure your password is entered in correctly',
        variant: 'danger',
      });
    }
  }

  return [logIn, logOut, signUp, editUser];
};

const useLocalStorage = (key, initVal) => {
  const [storedVal, setStoredVal] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initVal;
    } catch (err) {
      console.error(err);
      return initVal;
    }
  });

  const setVal = value => {
    try {
      const valueToLS = value instanceof Function ? value(storedVal) : value;
      setStoredVal(valueToLS);
      localStorage.setItem(key, JSON.stringify(valueToLS));
    } catch (err) {
      console.error(err);
    }
  };
  return [storedVal, setVal];
};

export default getHelpers;

export { useLocalStorage };
