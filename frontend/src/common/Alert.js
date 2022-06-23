import React from 'react';

const Alert = ({ type = 'danger', messages = [] }) => {
  console.debug('Alert', 'type=', type, 'messages=', messages);

  return (
    <div className={`alert alert-${type}`} role="alert">
      {messages.map(e => {
        <p className="mb-0 small" key={e}>
          {e}
        </p>;
      })}
    </div>
  );
};
export default Alert;
