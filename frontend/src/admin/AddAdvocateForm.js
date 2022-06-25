import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AdvocateForm from '../forms/AdvocateForm';
import UserContext from '../UserContext';
import AlertContext from '../AlertContext';
import AdvocateAPI from '../api';

const AddAdvocateForm = () => {
  const user = useContext(UserContext);

  const { setMessage } = useContext(AlertContext);

  if (!user) {
    return <Redirect to="/" />;
  }

  const formFields = [
    {
      name: 'firstName',
      label: 'First Name',
      inputType: 'text',
      initialValue: '',
      placeholder: 'Please enter advocates first name',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      inputType: 'text',
      initialValue: '',
      placeholder: 'Please enter advocates last name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      inputType: 'email',
      initialValue: '',
      placeholder: 'Please enter advocates email',
      required: true,
    },
    {
      name: 'hireDate',
      label: 'Hire Date',
      inputType: 'date',
      initialValue: '',
      placeholder: 'Please enter advocates date of hire',
      required: true,
    },
    {
      name: 'milestone',
      label: 'Milestone',
      inputType: 'text',
      initialValue: '',
      placeholder: 'Please enter advocates Milesonte (e.g. M1)',
      required: true,
    },
    {
      name: 'currentMilestoneStartDate',
      label: 'Milestone Start Date',
      inputType: 'date',
      initialValue: '',
      placeholder: 'Please enter advocates current milestone start date',
      required: true,
    },
    {
      name: 'teamLead',
      label: 'Team Lead',
      inputType: 'text',
      initialValue: '',
      placeholder: 'Please enter advocates current Team Lead',
      required: true,
    },
    {
      name: 'Manager',
      label: 'Manager',
      inputType: 'text',
      initialValue: '',
      placeholder: 'Please enter Team Leads current Manager',
      required: true,
    },
  ];

  async function add(advocate) {
    try {
      let newAdvocate = await AdvocateAPI.addAdvocate(advocate);
      if (newAdvocate.firstName && newAdvocate.firstName === advocate.firstName) {
        setMessage({
          text: `${newAdvocate.firstName} was added successfully!`,
          variant: 'success',
        });
      }
    } catch (err) {
      setMessage({
        text: `Error adding advocate ${advocate.firstName}`,
        variant: 'danger',
      });
    }
  }

  return (
    <div className="AddAdvocateForm">
      <div className="container">
        <AdvocateForm
          formTitle={`Add Advocate`}
          fields={formFields}
          submitButtonText="Add!"
          processData={data => add(data)}
          backButtonTo="/admin"
        />
      </div>
    </div>
  );
};

export default AddAdvocateForm;
