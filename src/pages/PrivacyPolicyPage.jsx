import React from 'react';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="We are committed to protecting your personal data."
      />
      <main className="privacy-policy-page">
        <section className="page-section page-section--white">
          <div className="page-section__inner container">
            <div className="page-section__body col-12">
              <h2 className="section-heading">1. Introduction</h2>
              <p className="mb-4">
                This Privacy Policy explains how the PATHWAY Sustainability Checker (“the Tool”) collects, uses, stores, and protects your personal data. The Tool was developed under the PATHWAY project (Paving pATHs toWards footbAll’s sustainabilitY), co-funded by the European Union under Grant Agreement No. 101161202 - PATHWAY - PPPA-SPORT-2023-PEOPLE-PLANET. By using the Tool, you consent to the practices described herein.
              </p>
              <h2 className="section-heading">2. Data Controller</h2>
              <p className="mb-4">
                The Data Controller is:<br />
                Cyprus Football Association<br />
                Stasinou 1, CY - 2404 EGKOMI<br />
                As project coordinator, the Cyprus Football Association ensures compliance with EU data protection laws, including the General Data Protection Regulation (GDPR) (EU) 2016/679.
              </p>
              <h2 className="section-heading">3. What Data We Collect</h2>
              <p className="mb-4">
                We collect only the minimum data necessary for the Tool’s operation:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li><strong>User account data:</strong> Email address (or username) and encrypted password.</li>
                <li><strong>Assessment data:</strong> Responses to sustainability questions, scores, feedback selections, and N/A markings.</li>
                <li><strong>Technical data:</strong> Timestamps of access or submission, session status, or login duration.</li>
              </ul>
              <p className="mb-4">
                We do not collect sensitive personal data or data not relevant to the Tool’s operation.
              </p>
              <h2 className="section-heading">4. Why We Collect Your Data</h2>
              <p className="mb-4">
                We process your data to:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li>Enable registration and login.</li>
                <li>Generate sustainability scores and reports.</li>
                <li>Provide tailored recommendations.</li>
                <li>Support progress tracking.</li>
                <li>Allow downloading or revisiting action plans.</li>
                <li>Monitor anonymized tool usage (e.g., completion frequency).</li>
              </ul>
              <h2 className="section-heading">5. Analytics</h2>
              <p className="mb-4">
                We use Google Analytics to collect anonymized data about tool usage, such as page views, session duration, and device type. This data helps us improve the Tool’s performance and user experience. You can opt out of analytics tracking via your browser settings or by contacting us.
              </p>
              <h2 className="section-heading">6. Legal Basis for Processing</h2>
              <p className="mb-4">
                Our legal bases under GDPR are:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li><strong>Consent:</strong> You voluntarily register and use the Tool (Art. 6(1)(a)).</li>
                <li><strong>Legitimate interest:</strong> Operating and improving the Tool aligns with the project’s objectives (Art. 6(1)(f)).</li>
              </ul>
              <p className="mb-4">
                You may withdraw consent by deleting your account or contacting us.
              </p>
              <h2 className="section-heading">7. How We Use and Store Your Data</h2>
              <p className="mb-4">
                Your data is stored securely, used only for the purposes above, and not used for commercial or marketing purposes. It is accessed only by authorized project team members or technical service providers, protected by appropriate security measures.
              </p>
              <h2 className="section-heading">8. Data Sharing and Transfers</h2>
              <p className="mb-4">
                Your data may be accessed by:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li>Cyprus Football Association (Data Controller).</li>
                <li>PATHWAY project partners (anonymized or aggregated form only).</li>
                <li>Technical development team (subcontracted).</li>
              </ul>
              <p className="mb-4">
                We do not share data with third parties for commercial purposes or transfer it outside the EU.
              </p>
              <h2 className="section-heading">9. Data Retention</h2>
              <p className="mb-4">
                We retain your data:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li>While your account is active.</li>
                <li>Until you request deletion.</li>
                <li>For the duration the Tool remains publicly available, per project obligations.</li>
              </ul>
              <p className="mb-4">
                Data is securely deleted or anonymized afterward.
              </p>
              <h2 className="section-heading">10. Your Rights Under GDPR</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="ml-6 list-disc mb-4">
                <li>Access your data.</li>
                <li>Request correction of inaccurate or incomplete data.</li>
                <li>Request erasure (“right to be forgotten”).</li>
                <li>Object to processing in certain circumstances.</li>
                <li>Lodge a complaint with a Data Protection Authority.</li>
              </ul>
              <p className="mb-4">
                For inquiries or to exercise your rights, contact us at{' '}
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

export default PrivacyPolicyPage;