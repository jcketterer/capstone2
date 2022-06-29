import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import { Link } from 'react-router-dom';
import AdvocateCard from './AdvocateCard';

const AdvocateList = () => {
  const user = useContext(UserContext);
  const [advocates, setAdvocates] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let isRendered = true;

    async function getAdvocates(filterString = '') {
      try {
        if (isRendered && user.username) {
          let advocateRes = await AdvocateAPI.getAdvocates(filterString);
          setAdvocates(advocateRes);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getAdvocates(filter);

    return () => {
      isRendered = false;
    };
  }, [filter, user.username]);

  if (!user.username) {
    return <Redirect to="/" />;
  }

  return (
    <div className="AdvocateList">
      <div className="container">
        <h3 className="display-3 mb-3">Advocates:</h3>
        <div className="d-inline-flex flex-column">
          {advocates.length > 0 ? (
            advocates.map(advocate => (
              <AdvocateCard advocate={advocate} key={advocate.advocateId} />
            ))
          ) : (
            <p>Advocate Not Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvocateList;
