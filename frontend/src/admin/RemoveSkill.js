import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import AlertContext from '../AlertContext';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar';

const RemoveSkill = () => {
  const user = useContext(UserContext);

  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('');
  const [needsUpdate, setNeedsUpdate] = useState(true);

  useEffect(() => {
    let isRendered = true;

    async function getSkill(filterString = '') {
      try {
        if (isRendered && needsUpdate && user.isAdmin) {
          let skillRes = await AdvocateAPI.getSkillByName(filterString);
          setSkills(skillRes);
          setNeedsUpdate(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getSkill(filter);

    return () => {
      isRendered = false;
    };
  }, [filter, user.isAdmin, needsUpdate, skills]);

  const remove = useCallback(
    async skill => {
      let removeRes = await AdvocateAPI.deletedSkill(skill.name);

      if (removeRes.deleted && removeRes.deleted === skill.name) {
        let updatedSkills = [...skills];
        let index = skills.findIndex(i => i.name === skill.name);

        updatedSkills = updatedSkills.splice(index, 1);
        setSkills(updatedSkills);
        setNeedsUpdate(true);
      }
    },
    [skills]
  );

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="RemoveSkill container">
      <SearchBar onSubmit={setFilter} />
      <hr />
      {skills.length > 0 ? (
        <ul>
          {skills.map(skill => {
            return (
              <li className="" key={skill.name}>
                <h6>{skill.name}</h6>
                <button
                  className="btn btn-outline-danger btn-sm d-inline-flex"
                  onClick={() => remove(skill)}
                >
                  Remove Skill
                </button>
                <Link to={`/skill/${skill.name}/edit`}>
                  <button className="btn btn-primary btn-sm mx-3">Edit Skill</button>
                </Link>
                <hr />
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No Skills Found</p>
      )}
      <br />
      <Link to={`/admin`}>
        <button className="btn btn-secondary btn-sm">Back</button>
      </Link>
    </div>
  );
};

export default RemoveSkill;
