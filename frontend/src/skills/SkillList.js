import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../UserContext';
import SkillsCard from './SkillsCard';
import AdvocateAPI from '../api';

const SkillList = () => {
  const user = useContext(UserContext);
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let isRendered = true;

    async function getSkills(filterString = '') {
      try {
        if (isRendered && user.username) {
          let skillRes = await AdvocateAPI.getSkillByName(filterString);
          setSkills(skillRes);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getSkills(filter);

    return () => {
      isRendered = false;
    };
  }, [filter, user.username]);

  if (!user.username) {
    return <Redirect to="/" />;
  }

  return (
    <div className="SkillList">
      <div className="container">
        <h3 className="display-3 mb-3">Skills:</h3>
        <div className="d-inline-flex flex-column">
          {skills.length > 0 ? (
            skills.map(skill => (
              <SkillsCard skill={skill} key={skill.skillName} name={skill.name} />
            ))
          ) : (
            <p>No skills found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillList;
