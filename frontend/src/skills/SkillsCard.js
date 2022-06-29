import React from 'react';

const SkillCard = ({ skill }) => {
  return (
    <div className="card">
      <div className="card-body">
        <ul style={{ listStyleType: 'none' }}>
          <li className="lead">{skill.name}</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillCard;
