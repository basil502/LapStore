import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

function Header({ onSort , onToggleFilter }) {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const navigate = useNavigate();   

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSortOption = (option) => {
    onSort(option);
    setShowSortOptions(false);
  };

  return (
    <div className="header">
      <h1 className="title">🖥️ Lapstore</h1>
      <div className="header-buttons">
        <div className="sort-dropdown">
          <button
            className="header-icon-btn"
            onClick={() => setShowSortOptions(prev => !prev)}
          >
            Sort
          </button>
          {showSortOptions && (
            <div className="dropdown-menu">
              <button onClick={() => handleSortOption('priceLowHigh')}>Price: Low to High</button>
              <button onClick={() => handleSortOption('priceHighLow')}>Price: High to Low</button>
              <button onClick={() => handleSortOption('available')}>Available</button>
              <button onClick={() => handleSortOption('unavailable')}>Unavailable</button>
            </div>
          )}
        </div>

      <button className="header-icon-btn" onClick={onToggleFilter}>Filter</button>        <button className="header-icon-btn logout" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Header;
