import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AdvocateForm from '../forms/AdvocateForm';
import UserContext from '../UserContext';
import AlertContext from '../AlertContext';
import AdvocateAPI from '../api';

const AddSkillForm = () => {
  const user = useContext(UserContext);

  const { setMessage } = useContext(AlertContext);

  const formFields = [
    {
      name: 'name',
      label: 'Name:',
      inputType: 'text',
      initialValue: '',
      placeholder: 'Please enter new skill name',
      required: true,
    },
  ];

  async function add(skill) {
    try {
      let newSkill = await AdvocateAPI.addSkill(skill);
      if (newSkill.name && newSkill.name === skill.name) {
        setMessage({
          text: `Skill ${newSkill.name} added successfully!`,
          variant: 'success',
        });
      }
    } catch (err) {
      setMessage({
        text: `Error Adding Skill ${skill.name}`,
        variant: 'danger',
      });
    }
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="AddSkillForm">
      <div className="container">
        <AdvocateForm
          formTitle={`Add Skill`}
          fields={formFields}
          submitButtonText="Add Skill"
          processData={data => add(data)}
          backButtonTo={user.isAdmin ? '/admin' : '/skills'}
        />
      </div>
    </div>
  );
};

export default AddSkillForm;
