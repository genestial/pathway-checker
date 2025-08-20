import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import PageHero from '../components/PageHero';
import questions from '../data/questions';

// Topic icons (bundled by Vite from src/assets)
import accessibilityIcon from '../assets/icons/accessibility.png';
import wasteIcon from '../assets/icons/waste.png';
import transportIcon from '../assets/icons/transport.png';
import energyIcon from '../assets/icons/energy.png';
import communityIcon from '../assets/icons/community.png';
import diversityIcon from '../assets/icons/diversity.png';
import eventIcon from '../assets/icons/events.png';
import fanIcon from '../assets/icons/fans.png';
import waterIcon from '../assets/icons/water.png';
import defaultIcon from '../assets/icons/default.png';

const iconMap = {
  'accessibility': accessibilityIcon,
  'community engagement': communityIcon,
  'diversity and inclusion': diversityIcon,
  'energy and emissions': energyIcon,
  'event safety': eventIcon,
  'fan engagement and education': fanIcon,
  'transport': transportIcon,
  'waste': wasteIcon,
  'water': waterIcon,
};

const ActionPlanPage = ({ user }) => {
  const [responses, setResponses] = useState({});

  // Firestore: init doc if missing + subscribe to updates
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'assessments', 'current');

    getDoc(docRef).then(snap => {
      if (!snap.exists()) setDoc(docRef, { responses: {} }, { merge: true });
    });

    const unsub = onSnapshot(docRef, snap => {
      if (snap.exists()) setResponses(snap.data().responses || {});
    });

    return () => unsub();
  }, [user]);

  // Map response to numeric value
  const getOptionValue = (question, response) => {
    if (response == null) return null;
    const num = parseInt(response, 10);
    if (!isNaN(num) && [0, 1, 2].includes(num)) return num;
    const option = question.options.find(o => o.label === response);
    return option ? option.value : null;
  };

  // Build actionable items (score 0 or 1)
  const actionItems = useMemo(() => {
    return questions
      .map(q => {
        const val = getOptionValue(q, responses[q.id]);
        return { ...q, value: val };
      })
      .filter(item => item.value !== null && item.value < 2);
  }, [responses]);

  // Group by topic
  const itemsByTopic = useMemo(() => {
    return actionItems.reduce((acc, item) => {
      (acc[item.topic] = acc[item.topic] || []).push(item);
      return acc;
    }, {});
  }, [actionItems]);

  const topics = useMemo(() => Object.keys(itemsByTopic), [itemsByTopic]);

  // Accordion state: by default, open all topics that have items
  const [openTopics, setOpenTopics] = useState(() => new Set(topics));
  useEffect(() => {
    // Reset when topics change
    setOpenTopics(new Set(topics));
  }, [topics]);

  const toggleTopic = (topic) => {
    setOpenTopics(prev => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const expandAll = () => setOpenTopics(new Set(topics));
  const collapseAll = () => setOpenTopics(new Set());

  return (
    <>
      <PageHero
        title="Action Plan"
        subtitle={
          <>
            Review recommended actions for any questions answered as <strong>“No”</strong> or <strong>“Partially”</strong>. You can print this page or revisit the questionnaire to update your responses.
          </>
        }
      />

      <main className="action-plan-page container">
        <div className="flex justify-between items-center mb-6">

          {topics.length > 0 && (
            <div className="flex items-center mb-6">
              <div className="ml-auto flex gap-3">
                <button
                  onClick={expandAll}
                  className="btn"
                  aria-label="Expand all sections"
                  title="Expand all"
                >
                  Expand all
                </button>
                <button
                  onClick={collapseAll}
                  className="btn"
                  aria-label="Collapse all sections"
                  title="Collapse all"
                >
                  Collapse all
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-print"
                  aria-label="Print Action Plan"
                  title="Print"
                >
                  🖨️
                </button>
              </div>
            </div>
          )}

        </div>

        {topics.length === 0 && (
          <p className="mt-4 text-lg">🎉 All set! No action items at this time.</p>
        )}

        {topics.map((topic) => {
          const items = itemsByTopic[topic];
          const iconSrc = iconMap[topic.toLowerCase()] || defaultIcon;
          const isOpen = openTopics.has(topic);
          const panelId = `accordion-panel-${topic.replace(/\s+/g, '-').toLowerCase()}`;
          const btnId = `accordion-button-${topic.replace(/\s+/g, '-').toLowerCase()}`;

          return (
            <section key={topic} className="mb-8">
              {/* Accordion header button for accessibility */}
              <button
                id={btnId}
                className="btn-accordion"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleTopic(topic)}
              >
                {/* Left: topic + icon */}
                <span className="flex items-center">
                  {topic}
                  <img
                    src={iconSrc}
                    alt={`${topic} icon`}
                    className="w-6 h-6 ml-2 inline-block"
                  />
                </span>

               
              </button>


              {/* Panel */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={`${isOpen ? 'block' : 'hidden'} accordion-panel`}
              >
                {items.map(item => {
                  const answerOption = item.options.find(o => o.value === item.value);
                  const answerLabel = answerOption ? answerOption.label : '';
                  return (
                    <div key={item.id} className="item-block">
                      <h3 className="subheading">{item.text}</h3>
                      <p><strong>Your answer:</strong> {answerLabel}</p>
                      <p><strong>Recommendation:</strong> {item.recommendation}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
};

export default ActionPlanPage;
