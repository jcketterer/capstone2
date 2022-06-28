import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar';

const RemoveAdvocate = () => {
  const user = useContext(UserContext);

  const [advocates, setAdvocates] = useState([]);
  const [filter, setFilter] = useState('');
  const [needsUpdate, setNeedsUpdate] = useState(true);

  useEffect(() => {
    let isRendered = true;

    async function getAdvocates(filterString = '') {
      try {
        if (isRendered && needsUpdate && user.isAdmin) {
          let advocateRes = await AdvocateAPI.getAdvocates(filterString);
          console.log(advocateRes);
          setAdvocates(advocateRes);
          setNeedsUpdate(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getAdvocates(filter);

    return () => {
      isRendered = false;
    };
  }, [filter, user.isAdmin, advocates, needsUpdate]);

  const remove = useCallback(
    async advocates => {
      let removeRes = await AdvocateAPI.deleteAdvocate(advocates.advocateId);
      console.log(removeRes);

      if (removeRes.deleted && removeRes.deleted === `${advocates.advcoateId}`) {
        let updatedAdvocate = [...advocates];
        let index = advocates.findIndex(a => a.name === advocates.name);

        updatedAdvocate = updatedAdvocate.splice(index, 1);
        setAdvocates(updatedAdvocate);
        setNeedsUpdate(true);
      }
    },
    [advocates]
  );

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="RemoveAdvocate">
      <div className="container">
        <SearchBar onSubmit={setFilter} />
        {advocates.length > 0 ? (
          <ul>
            {advocates.map(advo => {
              return (
                <li key={advo.advcoateId}>
                  <h5 className="">{advo.email}</h5>
                  <div className="d-inline-flex flex-column justify-content-end">
                    <Link to={`advocate/${advo.advocateId}/editadvocateinfo`}>
                      <button className="btn btn-primary btn-sm">
                        Edit Advocate Information
                      </button>
                    </Link>
                    <Link to={`advocate/${advo.advocateId}/editadvocateskills`}>
                      <button className="btn btn-primary btn-sm mt-1">
                        Edit Advocate Skills
                      </button>
                    </Link>
                    <button
                      onClick={() => remove(advo)}
                      className="btn btn-outline-danger btn-sm mt-1"
                    >
                      Remove Advocate
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No Skills Found</p>
        )}
        <br />
        <Link to={'/admin'}>
          <button className="btn btn-secondary btn-sm">Back</button>
        </Link>
      </div>
    </div>
  );
};

export default RemoveAdvocate;
