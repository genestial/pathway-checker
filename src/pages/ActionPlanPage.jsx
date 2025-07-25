import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import questions from '../data/questions';


// Import topic icons
import accessibilityIcon from '../assets/icons/accessibility.png';
import wasteIcon from '../assets/icons/waste.png';
import transportIcon from '../assets/icons/transport.png';
import energyIcon from '../assets/icons/energy.png';
import communityIcon from '../assets/icons/community.png';
import diversityIcon from '../assets/icons/diversity.png';
import eventIcon from '../assets/icons/events.png';
import fanIcon from '../assets/icons/fans.png';
import waterIcon from '../assets/icons/water.png';
import defaultIcon from '../assets/icons/default.png'; // fallback icon

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

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'assessments', 'current');
    // initialize if missing
    getDoc(docRef).then(docSnap => {
      if (!docSnap.exists()) {
        setDoc(docRef, { responses: {} }, { merge: true });
      }
    });
    // subscribe for real-time updates
    const unsub = onSnapshot(docRef, snap => {
      if (snap.exists()) {
        setResponses(snap.data().responses || {});
      }
    });
    return () => unsub();
  }, [user]);

  // Helper: map response label/value
  const getOptionValue = (question, response) => {
    if (response == null) return null;
    const num = parseInt(response, 10);
    if (!isNaN(num) && [0,1,2].includes(num)) return num;
    const option = question.options.find(o => o.label === response);
    return option ? option.value : null;
  };

  // Build action items (score 0 or 1)
  const actionItems = questions
    .map(q => {
      const resp = responses[q.id];
      const val = getOptionValue(q, resp);
      return { ...q, value: val };
    })
    .filter(item => item.value !== null && item.value < 2);

  // Group by topic
  const itemsByTopic = actionItems.reduce((acc, item) => {
    (acc[item.topic] = acc[item.topic] || []).push(item);
    return acc;
  }, {});

  return (
    <main className="action-plan-page p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-heading">Action Plan</h1>
        {Object.keys(itemsByTopic).length > 0 && (
          <button
            onClick={() => window.print()}
            className=""
            aria-label="Print Action Plan"
          >
            🖨️
          </button>
        )}
      </div>

      {Object.keys(itemsByTopic).length === 0 && (
        <p className="mt-4 text-lg">🎉 All set! No action items at this time.</p>
      )}

      {Object.entries(itemsByTopic).map(([topic, items]) => {
        const iconSrc = iconMap[topic.toLowerCase()] || defaultIcon;
        return (
          <section key={topic} className="mb-12">
            <h2 className="section-heading">
              {topic}
              <img
                src={iconSrc}
                alt={`${topic} icon`}
                className="w-6 h-6 ml-2"
              />
            </h2>

            <div className="mt-4 space-y-4">
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
  );
};

export default ActionPlanPage;
