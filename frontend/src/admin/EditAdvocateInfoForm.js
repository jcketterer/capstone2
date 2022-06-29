import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import AlertContext from '../AlertContext';
import { Link } from 'react-router-dom';

const EditAdvocateInfoForm = () => {
  const user = useContext(UserContext);
  const { id } = useParams();
  const { setMessage } = useContext(AlertContext);
  const [advocate, setAdvocate] = useState({});
  const [needsInitFormUpdate, setNeedsInitFormUpdate] = useState(false);

  const FIELD_INIT_VALUES = {
    firstName: '',
    lastName: '',
    email: '',
    hireDate: '',
    milestone: '',
    currentMilestoneStartDate: '',
    teamLead: '',
    manager: '',
  };

  const [formData, setFormData] = useState(FIELD_INIT_VALUES);

  useEffect(() => {
    let isRendered = true;

    async function getAdvocate(id) {
      try {
        let res = await AdvocateAPI.getAdvocate(id);
        setAdvocate(res);
        console.log(setAdvocate(res));
        setNeedsInitFormUpdate(true);
      } catch (err) {
        console.log(err);
      }
    }
    getAdvocate(id);

    return () => {
      isRendered = false;
    };
  }, [user.username, id]);

  useEffect(() => {
    if (needsInitFormUpdate) {
      setFormData({
        firstName: advocate.firstName,
        lastName: advocate.lastName,
        email: advocate.email,
        hireDate: advocate.hireDate,
        milestone: advocate.milestone,
        current_milestone_start_date: advocate.current_milestone_start_date,
        teamLead: advocate.teamLead,
        manager: advocate.manager,
      });
      setNeedsInitFormUpdate(false);
    }
  }, [needsInitFormUpdate, advocate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
  };

  const edit = useCallback(async advocate => {
    try {
      await AdvocateAPI.editAdvocate(id, advocate);
      setMessage({
        text: `Edit ${advocate.firstName} Successfully!`,
        variant: 'success',
      });
    } catch (err) {
      setMessage({
        text: `Error editing advocate ${id} (${advocate.firstName})`,
        variant: 'danger',
      });
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    edit(formData);
  };

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  let hireDate = advocate.hireDate;
  let hDate = new Date(hireDate);
  let hireConvert = hDate.toDateString();

  let milestoneDate = advocate.current_milestone_start_date;
  let mDate = new Date(milestoneDate);
  let mileConvert = mDate.toDateString();

  return (
    <div className="EditAdvocateInfoForm">
      <div className="container inline-block">
        <h4 className="mb-3">{`Edit Advocate: ${advocate.firstName}`}</h4>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label for="formGroupExampleInput" className="form-label">
                  First Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required={false}
                  placeholder="New First Name"
                />
              </div>
              <div className="form-group">
                <label for="formGroupExampleInput" className="form-label">
                  Last Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required={false}
                  placeholder="New Last Name"
                />
              </div>
              <div className="form-group">
                <label for="formGroupExampleInput" className="form-label">
                  Email
                </label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={false}
                  placeholder="New Email"
                />
              </div>
              <div className="form-group">
                <label for="formGroupExampleInput" className="form-label">
                  Hire Date
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="hireDate"
                  value={formData.hireConvert}
                  onChange={handleChange}
                  required={false}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div className="form-group">
                <label for="formGroupExampleInput" className="form-label">
                  Milestone
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="Milestone"
                  value={formData.milestone}
                  onChange={handleChange}
                  required={false}
                  placeholder="New Milestone"
                />
              </div>
              <div className="form-group">
                <label for="formGroupExampleInput" className="form-label">
                  Current Milestone Start Date
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="current_milestone_start_date"
                  value={formData.mileConvert}
                  onChange={handleChange}
                  required={false}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div className="form-group">
                <label for="formGroupExampleInput" className="form-label">
                  Team Lead
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="teamLead"
                  value={formData.teamLead}
                  onChange={handleChange}
                  required={false}
                  placeholder="New Team Lead"
                />
              </div>
              <div className="form-group">
                <label for="formGroupExampleInput" className="form-label">
                  Manager
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  required={false}
                  placeholder="New Manager"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm m-2">
                Edit Advcoate
              </button>
              <Link to="/admin">
                <button className="btn btn-secondary btn-sm">Back</button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAdvocateInfoForm;
