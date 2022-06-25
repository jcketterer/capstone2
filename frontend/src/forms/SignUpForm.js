import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AdvocateForm from './AdvocateForm';
import UserContext from '../UserContext';

const SignUpForm = ({ signUpFunction }) => {
  const user = useContext(UserContext);

  if (user.username) {
    return <Redirect to="/" />;
  }

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      inputType: 'text',
      placeholder: 'Please enter a username',
      initialValue: '',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      inputType: 'password',
      placeholder: 'Please enter a password',
      initialValue: '',
      required: true,
    },
    {
      name: 'firstName',
      label: 'First Name',
      inputType: 'text',
      placeholder: 'Please enter you first name',
      initialValue: '',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      inputType: 'text',
      placeholder: 'Please enter you last name',
      initialValue: '',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      inputType: 'email',
      placeholder: 'Please enter an email',
      initialValue: '',
      required: true,
    },
  ];

  return (
    <div className="container justify-content-center">
      <AdvocateForm
        formTitle="Please create an account to use Advocate Search"
        fields={formFields}
        submitButtonText="Sign Up"
        processData={signUpFunction}
      />
    </div>
  );
};

export default SignUpForm;
