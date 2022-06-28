import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import AlertContext from '../AlertContext';
import { Link } from 'react-router-dom';

const EditSkillForm = () => {
  const user = useContext(UserContext);
  const { name, id } = useParams();
  const setMessage = useContext(AlertContext);
  const [skill, setSkill] = useState({});
  const [needsInitFormUpdate, setNeedsInitFormUpdate] = useState(false);

  const FIELD_INIT_VALUES = {
    name: name,
  };

  const [formData, setFormData] = useState(FIELD_INIT_VALUES);

  useEffect(() => {
    let isRendered = true;

    async function getSkill(id) {
      try {
        if (isRendered && user.username) {
          let skillRes = await AdvocateAPI.getSkill(id);
          setSkill({ ...skillRes });
          setNeedsInitFormUpdate(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getSkill(id);

    return () => {
      isRendered = false;
    };
  }, [user.username, skill, name]);

  useEffect(() => {
    if (needsInitFormUpdate) {
      setFormData({
        name: name,
      });
      setNeedsInitFormUpdate(false);
    }
  }, [needsInitFormUpdate, skill, name]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
  };

  const edit = useCallback(
    async skill => {
      try {
        await AdvocateAPI.editSkill(skill);
        setMessage({
          text: `Skill edited successfully to ${skill.name}!`,
          variant: 'success',
        });
        setSkill(skill);
      } catch (err) {
        setMessage({
          text: `Error editing skill ${skill.name}`,
          variant: 'danger',
        });
      }
    },
    [setMessage]
  );

  const handleSubmit = e => {
    e.preventDefault();
    edit(formData);
  };

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="EditIngredientForm justify-content-center">
      <div className="col-md-8 col-sm-10">
        <div className="card">
          <h4 className="card-header">{`Edit Skill: ${name}`}</h4>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <label>{`New name for Skill: ${name}`}</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required={true}
                readOnly={true}
              />
            </form>
            <button className="mr-2" type="submit">
              Complete Edit!
            </button>
            <Link to="/admin">
              <button className="btn btn-secondary">Back</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSkillForm;
