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
            <h1 className="page-heading">Welcome to the PATHWAY Sustainability Checker</h1>
            <p className="home-hero__lead">
             Helping football clubs and organisations become more sustainable, one step at a time.
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
            <h2 className="section-heading">About the Tool</h2>
            <p>
              The PATHWAY Sustainability Checker is an online self-assessment tool designed to help football organisations evaluate and improve their environmental and social sustainability practices and overall sustainability performance.
            </p>
            <p>
              Through a structured set of practical questions, it helps you understand where your organisation currently stands, while offering targeted guidance on how to improve.
            </p>
            <Link to="/questionnaire" className="btn" aria-label="Start Questionnaire">
              Start now
            </Link>
          </div>
        </div>
      </section>

      {/* Why use*/}
      <section className="home-section home-section--green">
        <div className="home-section__inner">
          <div className="home-section__media home-section__media--center">
            <img src={pathwayLogo} alt="PATHWAY project logo" className="home-section__logo" />
          </div>
          <div className="home-section__body">
            <h2 className="section-heading">Why use this Tool?</h2>
            <ul>
              <li>Identify strengths and gaps in your current practices</li>  
              <li>Get tailored improvement suggestions</li>
              <li>Build a clear and actionable improvement plan</li>
              <li>Track your progress over time</li>
              <li>Align with good practices promoted across Europe and UEFA</li>
            </ul>
           
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
