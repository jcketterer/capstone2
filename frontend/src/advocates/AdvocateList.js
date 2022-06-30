import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import AdvocateCard from './AdvocateCard';

const AdvocateList = () => {
  const user = useContext(UserContext);
  const [advocates, setAdvocates] = useState([]);
  const [filter, setFilter] = useState(advocates);

  useEffect(() => {
    async function getAdvocates(filterString = 'leon') {
      try {
        let advocateRes = await AdvocateAPI.getAdvocates(filterString);
        console.log(advocateRes);
        setAdvocates(advocateRes);
      } catch (err) {
        console.log(err);
      }
    }
    getAdvocates(filter);
    console.log(getAdvocates(filter));
  }, [filter, user.username]);

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
