import { useEffect } from 'react';
import AdvocateAPI from './api';

const TokenSetter = ({ token }) => {
  useEffect(() => {
    AdvocateAPI.setToken(token);
  }, [token]);
  return null;
};

export default TokenSetter;
