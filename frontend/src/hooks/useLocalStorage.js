import { useState, useEffect } from 'react';

const useLocalStorage = (key, firstVal = null) => {
  const initVal = localStorage.getItem(key) || firstVal;

  const [item, setItem] = useState(initVal);

  useEffect(
    function setKeyInLS() {
      console.debug('hooks useLocalStorage useEffect', 'item=', item);

      if (item === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, item);
      }
    },
    [key, item]
  );
  return [item, setItem];
};

export default useLocalStorage;
