import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className="home-page">
      <h1 className="page-heading">Welcome to the PATHWAY Sustainability Checker</h1>
      <p>The Sustainability Checker assesses your organization's sustainability practices across various topics. </p>
      <p>Please answer each question to the best of your knowledge, selecting 'N/A' if a question is outside your control or scope.</p>

      <Link
        to="/questionnaire"
        className="btn"
        aria-label="Start Questionnaire"
      >
        Get Started
      </Link>
    </main>
  );
};

export default HomePage;