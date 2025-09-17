import React from 'react';
import PageHero from '../components/PageHero';
import { site } from '../config/site';

export default function ToolkitPage() {
  const rawUrl = site?.links?.toolkit || '';
  const isConfigured =
    typeof rawUrl === 'string' &&
    rawUrl.trim() !== '' &&
    rawUrl.trim() !== '#';
  const toolkitUrl = isConfigured ? rawUrl : null;

  return (
    <>
      <PageHero
        title="PATHWAY Guidelines Toolkit"
      />
      <main className="toolkit-page">
        <section className="home-section home-section--light">
          <div className="home-section__inner flex items-center">
            <div className="about-section__body--wide">
              <p>
                The PATHWAY Guidelines Toolkit provides step-by-step guidance on how football organisations can improve their sustainability performance. It complements the PATHWAY Sustainability Checker by explaining in more detail how to implement recommended actions, with practical solutions, examples of good practice, and monitoring tips.
              </p>
            

              {toolkitUrl ? (
                <a
                  href={toolkitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  Download the Toolkit
                </a>
              ) : (
                <>
                  <button className="btn" disabled aria-disabled="true">
                    Download the Toolkit
                  </button>
                  <div className="muted mt-2">Coming soon...</div>
                </>
              )}
            </div>

            <div className="about-section__media about-section__media--second">
              <img
                src={`${import.meta.env.BASE_URL}assets/checker-graphic.svg`}
                alt=""
                className="about-section__logo"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
