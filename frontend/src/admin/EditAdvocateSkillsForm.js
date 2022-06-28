import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import AlertContext from '../AlertContext';
import { Link } from 'react-router-dom';

const EditAdvocateSkills = () => {
  const { advocateId } = useParams();
  const user = useContext(UserContext);
  const { setMessage } = useContext(AlertContext);
  const [advocate, setAdvocate] = useState({});
  const [needUpdate, setNeedUpdate] = useState(true);

  const INIT_FORM_DATA = {
    name: '',
  };

  const [formData, setFormData] = useState(INIT_FORM_DATA);

  useEffect(() => {
    let isRendered = true;

    async function getAdvocate(advocateId) {
      try {
        if (isRendered && user.username && needUpdate) {
          let advocateRes = await AdvocateAPI.getAdvocate(advocateId);
          let indicatedSkills = await AdvocateAPI.indicateSkillsAssingedToAdvocate(
            advocateRes.skills.map(skill => {
              return { name: skill.skillName };
            }),
            user.username
          );

          setAdvocate({ ...advocateRes, skills: indicatedSkills });
          setNeedUpdate(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getAdvocate(advocateId);

    return () => {
      isRendered = false;
    };
  }, [user.username, advocateId, needUpdate]);

  const addSkill = useCallback(
    async data => {
      try {
        let additionRes = await AdvocateAPI.addSkillToAdvo(advocateId, data.skillName);
        if (additionRes.added && additionRes.added.skillName === data.skillName) {
          let updatedSkills = [...advocate.skills];
          updatedSkills.push({
            name: data.skillName,
          });

          setAdvocate({ ...advocate, skills: updatedSkills });
          setFormData({ skillName: '' });
          setNeedUpdate(true);
        } else {
          setMessage({
            text: 'Could not add that skill. It may not exist - check your spelling.',
            variant: 'danger',
          });
        }
      } catch (err) {
        setMessage({
          text: err.message,
          variant: 'danger',
        });
      }
    },
    [advocate, advocateId, setMessage]
  );

  const handleSubmit = e => {
    e.preventDefault();
    addSkill(formData);
  };

  const removeSkill = useCallback(
    async skill => {
      let removeRes = await AdvocateAPI.removeSkillFromAdvocate(advocateId, skill.name);

      if (removeRes.deletedSkill && removeRes.deletedSkill.skillName === skill.name) {
        let updatedSkills = { ...advocate.skills };
        let index = advocate.skills.findIndex(i => i.skillName === skill.name);
        updatedSkills = updatedSkills.splice(index, 1);
        setAdvocate({ ...advocate, skills: updatedSkills });
        setNeedUpdate(true);
      }
    },
    [advocateId, advocate]
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
  };

  if (!user.Admin) {
    return <Redirect to="/advocate/${advocateId}/addskills" />;
  }

  return (
    <div className="EditAdvocateSkills container">
      <h2>
        {advocate.email}
        <Link to={`/advocate/${advocateId}/editadvocateinfo`}>
          <button className="btn btn-primary btn-sm">Edit Advocate Info</button>
        </Link>
      </h2>
      <h5>
        {advocate.firstName} {advocate.lastName}
      </h5>
      <h3 className="mt-3">Skills:</h3>
      {advocate.skills && advocate.skills.length > 0 ? (
        <ul>
          {advocate.skills?.map(skill => (
            <li key={skill.name}>
              <span>
                <b>Skill:</b> {skill.name}
              </span>
              <button onClick={() => removeSkill(skill)} className="btn btn-sm btn-danger">
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>This advocate has no listed skills.</p>
      )}

      <h3>Add Skills:</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Skill Name:</label>
          <input
            type="text"
            name="skillName"
            value={formData.skillName || ''}
            onChange={handleChange}
            required={true}
            placeholder="Please enter Skill name."
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Add Skill to Advocate
        </button>
      </form>
      <br />
      <Link to="/removeadvocate">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default EditAdvocateSkills;
