import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Alert from '../common/Alert';

const LoginForm = ({ login }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState([]);

  console.debug('LoginForm', 'login=', typeof login, 'formData=', 'formErrors', formErrors);

  const handleSubmit = async e => {
    e.preventDefault();
    let res = await login(formData);
    if (res.success) {
      history.push('/users');
    } else {
      setFormErrors(res.errors);
      console.log('formErrors', formErrors);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(list => ({ ...list, [name]: value }));
  };

  return (
    <div className="LoginForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h3 className="mb-3">Log In</h3>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
                <div className="form-group mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                </div>

                {formErrors.length > 0 ? <Alert type="danger" messages={formErrors} /> : null}

                <button className="btn btn-primary float-right mt-2" onSubmit={handleSubmit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
