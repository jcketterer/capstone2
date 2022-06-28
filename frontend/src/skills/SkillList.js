import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../UserContext';
import SkillsCard from './SkillsCard';
import SearchBar from '../SearchBar';
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

  // const add = useCallback(
  //   async skill => {
  //     let addRes = await AdvocateAPI.addSkillToAdvo(advocate.advocateId, skill.name);

  //     if (addRes.added && addRes.added === skill.name) {
  //       let updatedSkills = [...skills];
  //       let index = skills.findIndex(i => i.name === skill.name);

  //       let updatedSkill = {
  //         ...skill,
  //         onHand: true,
  //       };

  //       updatedSkills[index] = updatedSkill;
  //       setSkills(updatedSkills);
  //     }
  //   },
  //   [user.username, skills]
  // );

  // const remove = useCallback(
  //   async skill => {
  //     let removeRes = await AdvocateAPI.removeSkillToAdvo(advocate.advocateId, skill.name);
  //     message;
  //     if (
  //       removeRes.message &&
  //       removeRes.message === `Removed skill ${skill.name} from advocate ${advocate.email}`
  //     ) {
  //       let updatedSkills = [...skills];
  //       let index = skills.findIndex(i => i.name === skill.name);

  //       let updatedSkill = {
  //         ...skill,
  //         onHand: false,
  //       };

  //       updatedSkills[index] = updatedSkill;
  //       setSkills(updatedSkills);
  //     }
  //   },
  //   [user.username, skills]
  // );

  if (!user.username) {
    return <Redirect to="/" />;
  }

  return (
    <div className="SkillList">
      <SearchBar onSubmit={setFilter} />
      {skills.length > 0 ? (
        skills.map(skill => (
          <SkillsCard
            skill={skill}
            key={skill.skillName}
            name={skill.name}
            // add={() => add(skill)}
            // remove={() => remove(skill)}
          />
        ))
      ) : (
        <p>No skills found.</p>
      )}
    </div>
  );
};

export default SkillList;
