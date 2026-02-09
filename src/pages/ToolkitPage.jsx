import React from 'react';
import PageHero from '../components/PageHero';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

export default function ToolkitPage() {
  const toolkitPdfUrl = `${import.meta.env.BASE_URL}assets/toolkit.pdf`;

  const handleDownload = () => {
    if (analytics) {
      logEvent(analytics, 'file_download', {
        file_name: 'PATHWAY Guidelines Toolkit',
        file_extension: 'pdf',
        link_url: toolkitPdfUrl,
      });
    }
  };

  return (
    <>
      <PageHero
        title="PATHWAY Guidelines Toolkit"
      />
      <main className="toolkit-page">
        <section className="page-section page-section--light">
          <div className="page-section__inner container max-w-7xl mx-auto px-4">
            <div className="page-section__body col-8">
              <p>
                The PATHWAY Guidelines Toolkit provides step-by-step guidance on how football organisations can improve their sustainability performance. It complements the PATHWAY Sustainability Checker by explaining in more detail how to implement recommended actions, with practical solutions, examples of good practice, and monitoring tips.
              </p>
              <a
                href={toolkitPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                onClick={handleDownload}
                download="PATHWAY-Guidelines-Toolkit.pdf"
              >
                Download the Toolkit
              </a>
            </div>
            <div className="page-section__media col-4 flex justify-end">
              <img
                src={`${import.meta.env.BASE_URL}assets/earth.svg`}
                alt=""
                className="toolkit-page__image"
              />
            </div>
          </div>
          
          {/* Full-width PDF embed row */}
          <div className="container max-w-7xl mx-auto px-4 mt-8">
            <div className="w-full">
              <embed
                src={`${toolkitPdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                type="application/pdf"
                className="w-full border border-gray-300 rounded-lg"
                style={{ minHeight: '800px', height: '80vh' }}
                title="PATHWAY Guidelines Toolkit PDF"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}