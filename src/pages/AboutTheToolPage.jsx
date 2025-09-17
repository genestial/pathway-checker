import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import pathwayLogo from '../assets/pathway-logo.svg';

const AboutTheToolPage = () => {
  return (
    <>
      <PageHero
        title="About the Tool"
        subtitle="Learn about the PATHWAY initiative and its mission to drive sustainability in football."
      />
      <main className="about-tool-page">
        <section className="page-section page-section--green">
          <div className="page-section__inner flex items-center">
            <div className="page-section__body col-9">
              <h2 className="section-heading">The Tool </h2>
              <p>
                The PATHWAY Sustainability Checker is an online self-assessment tool designed to help football organisations evaluate and improve their environmental and social sustainability practices and overall sustainability performance.
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

        {/* Why use*/}
        <section className="page-section page-section--white">
          <div className="page-section__inner flex items-center">
            <div className="page-section__body col-9">
              <h2 className="section-heading">Why use this Tool?</h2>
              <ul>
                <li>Identify strengths and gaps in your current practices</li>
                <li>Get tailored improvement suggestions</li>
                <li>Build a clear and actionable improvement plan</li>
                <li>Track your progress over time</li>
                <li>Align with good practices promoted across Europe and UEFA</li>
              </ul>
            </div>
            <div className="page-section__media col-3">
              <img src={pathwayLogo} alt="PATHWAY project logo" className="page-section__logo" />
            </div>
          </div>
        </section>

        {/* Who it's for — transformed into 4-column grid with icons */}
        <section className="page-section page-section--green">
          <div className="page-section__inner flex items-center">
            <div className="page-section__media col-3">
              <img src={pathwayLogo} alt="PATHWAY project logo" className="page-section__logo" />
            </div>
            <div className="page-section__body col-9">
              <h2 className="section-heading">Who is this for?</h2>

              {/* 4-column responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                {/* Card 1 */}
                <div className="bg-white rounded shadow p-4 text-center h-full">
                  <div className="mb-3 flex justify-center">
                    {/* Users / community icon */}
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M16 11a4 4 0 10-8 0 4 4 0 008 0z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 20a7 7 0 0118 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="font-semibold">Grassroots clubs & academies</div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded shadow p-4 text-center h-full">
                  <div className="mb-3 flex justify-center">
                    {/* Trophy icon */}
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7 4h10v3a5 5 0 01-5 5 5 5 0 01-5-5V4z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M17 7h2a3 3 0 110 6h-2M7 7H5a3 3 0 100 6h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M12 12v3M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="font-semibold">Professional clubs</div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded shadow p-4 text-center h-full">
                  <div className="mb-3 flex justify-center">
                    {/* Building / federation icon */}
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 20V8l8-4 8 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="font-semibold">Federations / facility managers</div>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded shadow p-4 text-center h-full">
                  <div className="mb-3 flex justify-center">
                    {/* Leaf / sustainability icon */}
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 4c-6 0-10 2-12 4-3 3-3 7 0 10s7 3 10 0c2-2 4-6 4-12V4z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 12c2 0 4 2 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="font-semibold">Any club committed to sustainability</div>
                </div>
              </div>

              <p className="mt-4">
                No matter your size or structure, the tool is designed to be relevant and useful to football organisations of all types.
                The option to mark some questions as “Not Applicable” ensures that your results reflect your actual scope and level of control.
              </p>

              <Link to="/about" className="btn mt-3" aria-label="Learn more about the project">
                More about the project
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutTheToolPage;
