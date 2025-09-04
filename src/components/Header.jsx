import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import pathwayLogo from "../assets/pathway-logo.svg";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
            <li className="header__nav-item relative">
              {user ? (
                <div className="header__user">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="header__profile-btn"
                    aria-label="User profile"
                  >
                    <img
                      src={user.photoURL || `${import.meta.env.BASE_URL}assets/default-profile.png`}
                      alt="Profile"
                      className="header__profile-img"
                    />
                  </button>
                  {showDropdown && (
                    <div className="header__dropdown">
                      <span className="header__dropdown-email">
                        {user.email}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="header__dropdown-btn"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/login" className="header__nav-link btn btn-login">
                  Log In
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;