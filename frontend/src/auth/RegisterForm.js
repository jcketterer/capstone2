import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Alert from '../common/Alert';

const RegisterForm = ({ register }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    'RegisterForm',
    'register=',
    typeof register,
    'formData=',
    formData,
    'formErrors=',
    formErrors
  );

  const handleSubmit = async e => {
    e.preventDefault();
    let res = await register(formData);

    if (res.success) {
      history.push('/advocates');
    } else {
      setFormErrors(res.errors);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  return (
    <div className="RegisterForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Register</h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  autoComplete="username"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  autoComplete="current-password"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {formErrors.length ? <Alert type="danger" messages={formErrors} /> : null}

              <button
                type="submit"
                className="btn btn-primary float-right mt-2"
                onSubmit={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
