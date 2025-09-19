import React from 'react';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <>
      <PageHero
        title="Terms of Use"
        subtitle="By using our service, you agree to these terms."
      />
      <main className="terms-page">
        <section className="page-section page-section--white">
          <div className="page-section__inner container">
            <div className="page-section__body col-12">
              <h2 className="section-heading">1. Introduction</h2>
              <p className="mb-4">
                The PATHWAY Sustainability Checker (“the Tool”) is an online self-assessment platform developed under the PATHWAY project (Paving pATHs toWards footbAll’s sustainabilitY), co-funded by the European Union under Grant Agreement No. 101161202 - PATHWAY - PPPA-SPORT-2023-PEOPLE-PLANET. It supports football organisations in evaluating and improving sustainability practices. The Tool is provided free of charge for informational and educational purposes. By using the Tool, you agree to these Terms of Use.
              </p>
              <h2 className="section-heading">2. Ownership and Credits</h2>
              <p className="mb-4">
                The Tool and its content were developed by the PATHWAY project consortium, coordinated by the Cyprus Football Association, with contributions from:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li>Anorthosis Famagusta FC (Cyprus)</li>
                <li>M.G.S. Panserraikos PAE 1946 (Greece)</li>
                <li>Foul Training (Greece)</li>
                <li>Municipal Football Club Academic Svishtov (Bulgaria)</li>
              </ul>
              <p className="mb-4">
                Content is publicly available for non-commercial use with appropriate acknowledgement of the PATHWAY project and its partners.
              </p>
              <h2 className="section-heading">3. Scope of Use</h2>
              <p className="mb-4">
                The Tool is intended for grassroots and professional football clubs, academies, federations, and other sustainability-committed organisations. Permitted use includes:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li>Completing the assessment.</li>
                <li>Viewing and downloading sustainability scores and actions.</li>
                <li>Using results for internal planning and progress tracking.</li>
              </ul>
              <p className="mb-4">
                Prohibited uses include commercial use, resale, distribution, copying, modifying, or reverse-engineering the Tool.
              </p>
              <h2 className="section-heading">4. User Account and Responsibilities</h2>
              <p className="mb-4">
                Users must create a profile and are responsible for:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li>Providing accurate and lawful information.</li>
                <li>Keeping login credentials confidential.</li>
                <li>Using the Tool in accordance with these Terms and applicable laws.</li>
              </ul>
              <p className="mb-4">
                The consortium is not responsible for losses from unauthorised account access.
              </p>
              <h2 className="section-heading">5. Limitations and Disclaimer</h2>
              <p className="mb-4">
                The Tool is a self-assessment and educational tool, not providing official certification, legal/financial advice, or compliance guarantees. Results and recommendations are provided “as is” at the user’s discretion and risk.
              </p>
              <h2 className="section-heading">6. Availability and Modifications</h2>
              <p className="mb-4">
                The PATHWAY consortium may modify, update, or suspend the Tool without prior notice. We are not liable for interruptions or changes.
              </p>
              <h2 className="section-heading">7. Data and Privacy</h2>
              <p className="mb-4">
                User and response data are collected to enable login, score generation, and progress tracking. See our Privacy Policy for details.
              </p>
              <h2 className="section-heading">8. EU Funding Disclaimer</h2>
              <p className="mb-4">
                Co-funded by the European Union. Views and opinions expressed are those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.
              </p>
              <p className="mb-4">
                For inquiries, contact us at{' '}
                <a href="mailto:info@pathwaychecker.eu" className="text-blue-600 hover:underline">
                  info@pathwaychecker.eu
                </a>.
              </p>
              <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TermsPage;