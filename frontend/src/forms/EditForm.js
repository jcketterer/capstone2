import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AdvocateForm from './AdvocateForm';
import UserContext from '../UserContext';

const EditUserForm = ({ editUserFunction }) => {
  const user = useContext(UserContext);

  if (!user.username) {
    return <Redirect to="/" />;
  }

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      inputType: 'text',
      initialValue: user.username,
      required: true,
      readOnly: true,
      styleOverride: {
        backgroundColor: '#eeeeee',
        borderRadius: '5px',
        paddingLeft: '10px',
      },
    },
    {
      name: 'firstName',
      label: 'First Name',
      inputType: 'text',
      initialValue: user.firstName,
      required: true,
      readOnly: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      inputType: 'text',
      initialValue: user.lastName,
      required: true,
      readOnly: true,
    },
    {
      name: 'email',
      label: 'Email',
      inputType: 'email',
      initialValue: user.email,
      required: true,
      readOnly: true,
    },
    {
      name: 'password',
      label: 'Please confirm password to make changes.',
      inputType: 'password',
      initialValue: user.password,
      required: true,
      readOnly: true,
    },
  ];

  return (
    <div className="EditUserForm justify-content-center">
      <AdvocateForm
        formTitle={`Edit ${user.username}'s Profile`}
        fields={formFields}
        submitButtonText="Save Changes"
        processData={editUserFunction}
        backButtonTo="/profile"
      />
    </div>
  );
};

export default EditUserForm;
