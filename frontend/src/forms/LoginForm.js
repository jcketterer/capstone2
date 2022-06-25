import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateForm from './AdvocateForm';
import './LoginForm.css';

const LoginForm = ({ loginFunction }) => {
  const user = useContext(UserContext);

  if (user.username) {
    return <Redirect to="/" />;
  }

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      inputType: 'text',
      placeholder: 'Please enter your username',
      initialValue: '',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      inputType: 'password',
      placeholder: 'Please enter your password',
      initialValue: '',
      required: true,
    },
  ];

  return (
    <div className="LoginForm">
      <div className="container justify-content-center">
        <AdvocateForm
          formTitle="Login"
          fields={formFields}
          submitButtonText="Login"
          processData={loginFunction}
        />
      </div>
    </div>
  );
};

export default LoginForm;
