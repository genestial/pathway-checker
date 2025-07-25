import React from 'react';
import { Link } from 'react-router-dom';
import pathwayLogo from '../assets/pathway-logo.svg';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <img src={pathwayLogo} alt="Pathway Sustainability Logo" className="header__logo" />
        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/" className="header__nav-link">Home</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/questionnaire" className="header__nav-link">Questionnaire</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/results" className="header__nav-link active" aria-current="page">Results</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/action-plan" className="header__nav-link active" aria-current="page">Action Plan</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/about" className="header__nav-link">About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;