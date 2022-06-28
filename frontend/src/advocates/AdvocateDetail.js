import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import AdvocateAPI from '../api';
import { Link } from 'react-router-dom';
import SkillCard from '../skills/SkillsCard';

const AdvocateDetail = () => {
  const { id } = useParams();
  const user = useContext(UserContext);
  const [advocate, setAdvocate] = useState(true);

  useEffect(
    function getAdvoInfo() {
      async function getAdvocate() {
        setAdvocate(await AdvocateAPI.getAdvocate(id));
      }
      getAdvocate();
    },
    [id]
  );

  let hireDate = advocate.hireDate;
  let hDate = new Date(hireDate);
  let hireConvert = hDate.toDateString();

  let milestoneDate = advocate.current_milestone_start_date;
  let mDate = new Date(milestoneDate);
  let mileConvert = mDate.toDateString();

  return (
    <div className="AdvocateDetail col-md-8 offset-md-2">
      <div className="card">
        <div className="card-header">
          <h2 className="display-4">
            {advocate.firstName} {advocate.lastName}
          </h2>
        </div>
        <div className="card-body" key={advocate.advcoateId}>
          <h3>Email: {advocate.email}</h3>
          <h3>Hire Date: {hireConvert}</h3>
          <h3>Milestone: {advocate.milestone}</h3>
          <h3>Current Milestone Start Date: {mileConvert}</h3>
          <h3>Team Lead: {advocate.teamLead}</h3>
          <h3>Manager: {advocate.manager}</h3>
          <div className="blockquote">
            Skills:
            <ul style={{ listStyleType: 'none' }}>
              {advocate.skills?.map(skill => (
                <li className="lead">{skill.skillName}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateDetail;
