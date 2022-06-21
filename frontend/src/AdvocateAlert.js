import React, { useEffect, useContext } from 'react';
import Alert from 'react-bootstrap/Alert';
import AlertContext from './AlertContext';

const AdvocateAlert = () => {
  const { message, setMessage } = useContext(AlertContext);

  const emptyMessage = () => {
    setMessage({ text: '', variant: '' });
  };

  useEffect(() => {
    let timeToClearMessage = setTimeout(emptyMessage, 8000);

    return () => {
      clearTimeout(timeToClearMessage);
    };
  });
};
