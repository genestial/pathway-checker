import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import pathwayLogo from "../assets/pathway-logo.svg";
import { site } from "../config/site";
import SocialIcon from "./SocialIcon";

const Header = () => {
  const { social } = site;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__container">
        <Link to="/" aria-label="Go to homepage">
          <img
            src={pathwayLogo}
            alt="Pathway Sustainability Logo"
            className="header__logo"
          />
        </Link>

        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <NavLink to="/" className="header__nav-link">Home</NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink to="/questionnaire" className="header__nav-link">Questionnaire</NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink to="/results" className="header__nav-link">Results</NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink to="/action-plan" className="header__nav-link">Action Plan</NavLink>
            </li>
          </ul>
        </nav>

        <div className="header__social" aria-label="Social media">
          <ul className="header__social-list">
            {Object.entries(social).map(([key, url]) =>
              url ? (
                <li key={key} className="header__social-item">
                  <a
                    className="header__social-link"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    title={key}
                  >
                    <SocialIcon type={key} />
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
