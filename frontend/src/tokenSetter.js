import { useEffect } from 'react';
import AdvocateAPI from './AdvocateAPI';

const TokenSetter = ({ token }) => {
  useEffect(() => {
    AdvocateAPI.setToken(token);
  }, [token]);
  return null;
};

export default TokenSetter;
