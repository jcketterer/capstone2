import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ searchTerm: '' });

  const handleChange = evt => {
    const { value } = evt.target;
    setFormData({ searchTerm: value });
  };

  const getInput = evt => {
    evt.preventDefault();
    onSubmit(formData.searchTerm);
    setFormData({ searchTerm: '' });
  };

  return (
    <div className="SearchBar mb-4">
      <form className="form-inline" onSubmit={getInput}>
        <input
          className="form-control form-control-lg flex-grow-1"
          id="search"
          name="searchTerm"
          placeholder=""
          value={formData.searchTerm}
          onChange={handleChange}
        />
        <button className="btn btn-sm btn-primary mt-2" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
