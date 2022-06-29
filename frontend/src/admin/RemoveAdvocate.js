import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import { Link } from 'react-router-dom';

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

  useEffect(function getCompanyOnMount() {
    console.debug('CompanyList useEffect getCompaniesOnMount');
    search();
  }, []);

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

  const search = async filter => {
    let advocate = await AdvocateAPI.getAdvocates(filter);
    setAdvocates(advocate);
  };

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="RemoveAdvocate">
      <div className="container">
        <h3 className="display-6 mb-4">Edit/Remove Advocates</h3>
        {advocates.length > 0 ? (
          <ul style={{ listStyleType: 'none' }}>
            {advocates.map(advo => {
              return (
                <div className="card">
                  <div className="card-body">
                    <li key={advo.email}>
                      <h4 className="mb-2">
                        {advo.firstName} {advo.lastName}
                      </h4>
                      <h5 className="">{advo.email}</h5>
                      <div className="d-flex justify-content-end">
                        <div>
                          <Link to={`advocate/${advo.advocateId}/editadvocateinfo`}>
                            <button className="btn btn-primary btn-sm mx-3">
                              Edit Advocate Information
                            </button>
                          </Link>
                          <button
                            onClick={() => remove(advo)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Remove Advocate
                          </button>
                        </div>
                      </div>
                    </li>
                  </div>
                </div>
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
