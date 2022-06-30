import React from 'react';
import { Link } from 'react-router-dom';

const AdvocateCard = ({ advocate }) => {
  return (
    <div className="card">
      <div className="card-body">
        <Link to={`/advocate/${advocate.advocateId}`}>
          <div className="card-title">{advocate.email}</div>
        </Link>
      </div>
    </div>
  );
};

export default AdvocateCard;
