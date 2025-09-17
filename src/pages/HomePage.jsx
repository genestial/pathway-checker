import React from "react";
import { Link } from "react-router-dom";
import pathwayLogo from "../assets/pathway-logo.svg"; // stays bundled by Vite

const partners = [
  { name: 'Cyprus Football Association', country: 'Cyprus - Project Coordinator', href: 'https://www.cfa.com.cy/', logo: `${import.meta.env.BASE_URL}assets/partners/cfa.png` },
  { name: 'Anorthosis Famagusta FC', country: 'Cyprus', href: 'https://anorthosisfc.com.cy/', logo: `${import.meta.env.BASE_URL}assets/partners/anorthosis_FC.png` },
  { name: 'M.G.S. Panserraikos PAE 1946', country: 'Greece', href: 'https://panserraikosfc.gr/', logo: `${import.meta.env.BASE_URL}assets/partners/panserraikos.png` },
  { name: 'Foul Training', country: 'Greece', href: 'https://akademik.bg/', logo: `${import.meta.env.BASE_URL}assets/partners/efip.png` },
  { name: 'Municipal Football Club Academic Svishtov', country: 'Bulgaria', href: 'https://www.foultraining.gr/', logo: `${import.meta.env.BASE_URL}assets/partners/OFC_Akademik_Svishtov.png` },
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
      <section className="page-section page-section--light">
        <div className="page-section__inner">
          <div className="page-section__media col-3">
            <img
              src={`${import.meta.env.BASE_URL}assets/checker-graphic.svg`}
              alt=""
              className="page-section__img"
            />
          </div>
          <div className="page-section__body col-9">
            <h2 className="section-heading">About the Tool</h2>
            <p>
              The PATHWAY Sustainability Checker is an online self-assessment tool designed to help football organisations evaluate and improve their environmental and social sustainability practices and overall sustainability performance.
            </p>
            <h3 className="mt-4">How it works</h3>
            <ol className="mb-4">
              <li>1. Answer practical questions across key topics</li>
              <li>2. View your performance score on each topic</li>
              <li>3. Receive Action plan with suggestions</li>
            </ol>
            
            <Link to="/questionnaire" className="btn mr-4" aria-label="Start Checker">
              Start now
            </Link>

            <Link to="/tool" className="btn btn-secondary" aria-label="Find out more">
              Find out more
            </Link>
          </div>
        </div>
      </section>

      {/* The project*/}
      <section className="page-section page-section--green">
        <div className="page-section__inner flex items-center">
          <div className="page-section__body col-9">
            <h2 className="section-heading">The Project</h2>
            <p>The PATHWAY project (Paving pATHs toWards footbAll’s sustainabilitY), co-funded by the European Union, promotes environmentally and socially sustainable practices in football. It brings together clubs, federations, and stakeholders from across Europe to develop, pilot, and share practical approaches that support sustainability at all levels of the game, from grassroots to professional.</p>
            <Link to="/about" className="btn mt-4" aria-label="Find out more">
              Find out more
            </Link>
            
          </div>
          <div className="page-section__media col-3">
            <img src={pathwayLogo} alt="PATHWAY project logo" className="page-section__logo" />
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="page-section page-section--partners page-section--white">
        <div className="page-section__inner">
          <div className="page-section__body">
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
                      title={`${p.name} (${p.country})`}
                    >
                      <img src={p.logo} alt={p.name} className="partners__logo" />
                      <span className="partners__name">{p.name}</span>
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
