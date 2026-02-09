import React from "react";
import { Link } from "react-router-dom";
import { site } from "../config/site";
import SocialIcon from "./SocialIcon"; // shared component
import euLogo from "/assets/cofunded_neg.webp"; // served from public/assets
import genestialLogo from "/assets/genestial-badge.png"; // served from public/assets

const Footer = () => {
  const year = new Date().getFullYear();
  const { social, links, name } = site;

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <div className="footer__name">{name}</div>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <ul className="footer__nav-list">
            <li className="footer__nav-item">
              <Link to="/toolkit" className="footer__link">PATHWAY Guidelines Toolkit</Link>
            </li>

            {links.privacy && (
              <li className="footer__nav-item">
                <Link to={links.privacy} className="footer__link">Privacy</Link>
              </li>
            )}
            {links.terms && (
              <li className="footer__nav-item">
                <Link to={links.terms} className="footer__link">Terms</Link>
              </li>
            )}
            {links.contact && (
              <li className="footer__nav-item">
                <a
                  href={links.contact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  Contact
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div className="footer__social" aria-label="Social media">
          <ul className="footer__social-list">
            {Object.entries(social).map(([key, url]) =>
              url ? (
                <li key={key} className="footer__social-item">
                  <a
                    className="footer__social-link"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                  >
                    <SocialIcon type={key} />
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>

      <div className="footer__eu">
        <img src={euLogo} alt="Co-Funded by the European Union" className="footer__eu-logo" />
        <p className="footer__eu-text">
          Co-Funded by the European Union. Views and opinions expressed are those of the author(s) only 
          and do not necessarily reflect those of the European Union or the European Education and Culture 
          Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.
        </p>
      </div>

      <div className="footer__bottom">
        <div className="footer__copy">© {year} {name}. All rights reserved.</div>
        <span className="footer__divider"> </span>
        <div className="footer__powered">
          <img src={genestialLogo} alt="Genestial Badge" className="footer__powered-logo" />
          <span>Powered by </span>
          <a
            href="https://genestial.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__powered-link"
          >
            GENESTIAL
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;