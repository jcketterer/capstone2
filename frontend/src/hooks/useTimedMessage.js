import { useRef, useState, useEffect } from 'react';

const useTimedMessage = (time = 3000) => {
  const [active, setActive] = useState(false);

  const messageInRef = useRef(false);

  useEffect(
    function showMessage() {
      console.debug('useTimedMessage useEffect showMessage', 'active=', active);

      if (active && !messageInRef.current) {
        messageInRef.current = true;
        setTimeout(function removeMessage() {
          setActive(false);
          messageInRef.current = false;
        }, time);
      }
    },
    [active, time]
  );
  return [active, setActive];
};

export default useTimedMessage;
