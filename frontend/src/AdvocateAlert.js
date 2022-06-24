import React, { useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import AlertContext from './AlertContext';

const AdvocateAlert = () => {
  const { message, setMessage } = useContext(AlertContext);

  const clearMessage = () => {
    setMessage({ text: '', variant: '' });
  };

  useEffect(() => {
    let timeoutToClearMessage = setTimeout(clearMessage, 7000);

    return () => {
      clearTimeout(timeoutToClearMessage);
    };
  }, [message]);

  if (message.text) {
    return (
      <Alert
        variant={message.variant ? message.variant : 'primary'}
        onClose={() => clearMessage()}
        className="mt-3"
        dismissable
      >
        {message.text}
      </Alert>
    );
  } else {
    return null;
  }
};

export default AdvocateAlert;
