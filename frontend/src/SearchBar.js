import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ searchFor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = e => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    searchFor(searchTerm.trim() || undefined);
    setSearchTerm(searchTerm.trim());
  };

  return (
    <div className="SearchBar mb-4">
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          className="form-control form-control-lg flex-grow-1"
          name="searchTerm"
          placeholder=""
          value={searchTerm}
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
