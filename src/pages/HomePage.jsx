import React from "react";
import { Link } from "react-router-dom";
// ❌ remove: import { asset } from "../utils/asset";
import pathwayLogo from "../assets/pathway-logo.svg"; // stays bundled by Vite

const partners = [
  { name: "Partner A", href: "https://example.com", logo: `${import.meta.env.BASE_URL}assets/partners/cfa.png` },
  { name: "Partner B", href: "https://example.com", logo: `${import.meta.env.BASE_URL}assets/partners/panserraikos.png` },
  { name: "Partner C", href: "https://example.com", logo: `${import.meta.env.BASE_URL}assets/partners/anorthosis_FC.png` },
  { name: "Partner D", href: "https://example.com", logo: `${import.meta.env.BASE_URL}assets/partners/OFC_Akademik_Svishtov.png` },
  { name: "Partner E", href: "https://example.com", logo: `${import.meta.env.BASE_URL}assets/partners/efip.png` },
];

const HomePage = () => {
  return (
    <main className="home-page">
      {/* Hero */}
      <section
        className="home-hero"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/hero.jpg)` }}
      >
        <div className="home-hero__overlay" />
        <div className="container">
          <div className="home-hero__content">
            <h1 className="page-heading">PATHWAY Sustainability Checker</h1>
            <p className="home-hero__lead">
              Assess your organisation’s sustainability practices across key topics and pillars.
              See your stage and generate a tailored action plan to improve.
            </p>
            <Link to="/questionnaire" className="btn" aria-label="Start Questionnaire">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* The Sustainability Checker */}
      <section className="home-section home-section--light">
        <div className="home-section__inner">
          <div className="home-section__media">
            <img
              src={`${import.meta.env.BASE_URL}assets/checker-graphic.svg`}
              alt=""
              className="home-section__img"
            />
          </div>
          <div className="home-section__body">
            <h2 className="section-heading">The Sustainability Checker</h2>
            <p>
              The checker evaluates how your practices align with sustainability goals across multiple
              topics. It excludes “N/A” answers from scoring, highlights gaps, and builds an Action Plan
              with practical steps to move from Developing to Leading.
            </p>
            <Link to="/questionnaire" className="btn" aria-label="Start Questionnaire">
              Start now
            </Link>
          </div>
        </div>
      </section>

      {/* About the project */}
      <section className="home-section home-section--green">
        <div className="home-section__inner">
          <div className="home-section__media home-section__media--center">
            <img src={pathwayLogo} alt="PATHWAY project logo" className="home-section__logo" />
          </div>
          <div className="home-section__body">
            <h2 className="section-heading">About the project</h2>
            <p>
              PATHWAY supports organisations with practical tools to measure, understand, and improve
              sustainability performance. Explore the approach, methodology, and resources available to your team.
            </p>
            <Link to="/about" className="btn" aria-label="Learn more about the project">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="home-section home-section--partners home-section--white">
        <div className="home-section__inner">
          <div className="home-section__body">
            <h2 className="section-heading">Partners</h2>
            <ul className="partners">
              {partners.map((p) => (
                <li key={p.name} className="partners__item">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={p.name}
                    className="partners__link"
                    title={p.name}
                  >
                    <img src={p.logo} alt={p.name} className="partners__logo" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
