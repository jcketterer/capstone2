import { useState } from 'react';
import AdvocateAPI from './api';

const getHelpFunctions = (user, setUser, setMessage, setToken) => {
  async function login({ username, password }) {
    try {
      let loginRes = await AdvocateAPI.login(username, password);
      if (loginRes) {
        let newUser = await AdvocateAPI.getUser(username);
        setToken(loginRes);
        setUser(newUser);
        setMessage({
          text: 'Login successful',
          variant: 'success',
        });
      } else {
        throw new Error('incorrect username or password');
      }
    } catch {
      setMessage({
        text: 'We could not log you in with current username and password',
        variant: 'danger',
      });
    }
  }

  const logout = () => {
    if (user.username) {
      setUser({});
      AdvocateAPI.setToken('');
      setMessage({ text: 'Logged Out!', variant: 'danger' });
    }
  };

  async function signup(signUpData) {
    const { username, password, firstName, lastName, email } = signUpData;

    try {
      let newUserRes = await AdvocateAPI.createNewUser(
        username,
        password,
        firstName,
        lastName,
        email
      );
      setUser(newUserRes.user);
      setToken(newUserRes.token);

      setMessage({
        text: `Welcome! ${firstName}!`,
        variant: 'success',
      });
    } catch (err) {
      console.log(err);
      setMessage({
        text: 'Could not create user. Username is already in use',
        variant: 'danger',
      });
    }
  }

  async function editUser(editUserData) {
    const { username, firstName, lastName, email, password } = editUserData;

    try {
      let editRes = await AdvocateAPI.updateUserInfo(
        username,
        firstName,
        lastName,
        email,
        password
      );
      setUser(editRes.user);
      setMessage({ text: 'Updated Successfully!', variant: 'success' });
    } catch (err) {
      console.log(err);
      setMessage({
        text: 'Could not update user. Please double check the password and try again.',
        variant: 'danger',
      });
    }
  }
  return [login, logout, signup, editUser];
};

const useLocalStorage = (key, initialValue) => {
  const [storedVal, setStoredVal] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.log(err);
      return initialValue;
    }
  });

  const setVal = value => {
    try {
      const valueToLS = value instanceof Function ? value(storedVal) : value;
      setStoredVal(valueToLS);
      localStorage.setItem(key, JSON.stringify(valueToLS));
    } catch (err) {
      console.log(err);
    }
  };
  return [storedVal, setVal];
};

export default getHelpFunctions;
export { useLocalStorage };
