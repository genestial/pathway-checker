import React from 'react';
import PageHero from '../components/PageHero';
import pathwayLogo from '../assets/pathway-logo.svg';

const partners = [
  { name: 'Cyprus Football Association', country: 'Cyprus - Project Coordinator', href: 'https://www.cfa.com.cy/', logo: `${import.meta.env.BASE_URL}assets/partners/cfa.png` },
  { name: 'Anorthosis Famagusta FC', country: 'Cyprus', href: 'https://anorthosisfc.com.cy/', logo: `${import.meta.env.BASE_URL}assets/partners/anorthosis_FC.png` },
  { name: 'M.G.S. Panserraikos PAE 1946', country: 'Greece', href: 'https://panserraikosfc.gr/', logo: `${import.meta.env.BASE_URL}assets/partners/panserraikos.png` },
  { name: 'Foul Training', country: 'Greece', href: 'https://www.foultraining.gr/', logo: `${import.meta.env.BASE_URL}assets/partners/efip.png` },
  { name: 'Municipal Football Club Academic Svishtov', country: 'Bulgaria', href: 'https://akademik.bg/', logo: `${import.meta.env.BASE_URL}assets/partners/OFC_Akademik_Svishtov.png` },
];

const AboutPage = () => {
  return (
    <>
      <PageHero
        title="About the PATHWAY Project"
        subtitle="Learn about the PATHWAY initiative and its mission to drive sustainability in football."
      />
      <main className="about-page">
        <section className="page-section page-section--green">
          <div className="page-section__inner flex items-center">
            <div className="page-section__body col-9">
              <h2 className="section-heading">The PATHWAY Project</h2>
              <p>
                The PATHWAY project (Paving pATHs toWards footbAll’s sustainabilitY), co-funded by the European Union, promotes environmentally and socially sustainable practices in football. It brings together clubs, federations, and stakeholders from across Europe to develop, pilot, and share practical approaches that support sustainability at all levels of the game, from grassroots to professional.
              </p>
            </div>
            <div className="page-section__media col-3">
              <img
                src={pathwayLogo}
                alt="PATHWAY project logo"
                className="page-section__img"
              />
            </div>
          </div>
        </section>

        <section className="page-section page-section--light">
          <div className="page-section__inner flex items-center">
            <div className="page-section__media col-3">
              <img
                src={`${import.meta.env.BASE_URL}assets/checker-graphic.svg`}
                alt=""
                className="page-section__logo"
              />
            </div>
            <div className="page-section__body col-9">
              <h2 className="section-heading">The Sustainability Checker</h2>
              <p>
                The PATHWAY Sustainability Checker was developed as part of the project’s Work Package 3, with the goal of helping football organisations assess their current sustainability performance and take meaningful action through tailored guidance and structured improvement planning.
              </p>
              <p>
                The tool was developed collaboratively by the PATHWAY consortium, coordinated by the Cyprus Football Association, and informed by real-world experiences gathered throughout the project, including study visits, pilot actions, and consultations with clubs, academies, and grassroots stakeholders.
              </p>
            </div>
          </div>
        </section>

        <section className="page-section page-section--partners page-section--white">
          <div className="page-section__inner">
            <div className="page-section__body">
              <h2 className="section-heading">Project Partners</h2>
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
    </>
  );
};

export default AboutPage;
