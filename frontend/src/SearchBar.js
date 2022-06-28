import React, { useState } from 'react';

const SearchBar = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ searchTerm: '' });

  const handleChange = e => {
    const { value } = e.target;
    setFormData({ searchTerm: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData.searchTerm);
    setFormData({ searchTerm: '' });
  };

  return (
    <div className="SearchBar">
      <div className="form-group">
        <form className="align-items-center" onSubmit={handleSubmit}>
          <label className="mx-3" htmlFor="searchTerm">
            Search
          </label>
          <input
            className="mb-3"
            id="searchTerm"
            name="searchTerm"
            value={formData.searchTerm}
            placeholder=""
            onChange={handleChange}
          />
        </form>
        <button type="submit" className="btn btn-primary mb-3">
          Submit
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
