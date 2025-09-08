import React, { useState, useEffect, useRef, Component, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import ScoreCard from '../components/ScoreCard';
import TopicSection from '../components/TopicSection';
import PageHero from '../components/PageHero';
import questions from '../data/questions';

// Pillar icons (one per pillar)
import energyIcon from '../assets/icons/energy.png';
import diversityIcon from '../assets/icons/diversity.png';

// Topic icons (for Action Plan, as in your original)
import accessibilityIcon from '../assets/icons/accessibility.png';
import wasteIcon from '../assets/icons/waste.png';
import transportIcon from '../assets/icons/transport.png';
import energyTopicIcon from '../assets/icons/energy.png';
import communityIcon from '../assets/icons/community.png';
import diversityTopicIcon from '../assets/icons/diversity.png';
import eventIcon from '../assets/icons/events.png';
import fanIcon from '../assets/icons/fans.png';
import waterIcon from '../assets/icons/water.png';
import defaultIcon from '../assets/icons/default.png';

export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <h2 className="a11y-heading needs-improvement">
          Something went wrong with the icons. Please check the console.
        </h2>
      );
    }
    return this.props.children;
  }
}

const ResultsPage = ({ user }) => {
  const { assessmentId } = useParams();

  const topicsByPillar = {
    'Environmental Sustainability': ['Energy and Emissions', 'Transport', 'Waste', 'Water'],
    'Social Sustainability': ['Accessibility', 'Community Engagement', 'Diversity and Inclusion', 'Event Safety', 'Fan Engagement and Education'],
  };

  const [authedUser, setAuthedUser] = useState(user || null); // support prop OR auth
  const [responses, setResponses] = useState({});
  const canvasRefs = {
    overall: useRef(null),
    'environmental-sustainability-pillar': useRef(null),
    'social-sustainability-pillar': useRef(null),
  };

  // keep user in this page even if not passed as prop
  useEffect(() => {
    if (user) { setAuthedUser(user); return; }
    const unsub = onAuthStateChanged(auth, (u) => setAuthedUser(u || null));
    return () => unsub();
  }, [user]);

  // Load responses for this *specific* assessment
  useEffect(() => {
    const fetchResponses = async () => {
      if (!authedUser || !assessmentId) return;
      try {
        const docRef = doc(db, 'users', authedUser.uid, 'assessments', assessmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().responses || {};
          setResponses(data);
        } else {
          setResponses({});
        }
        const unsubscribe = onSnapshot(
          docRef,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data().responses || {};
              setResponses(data);
            }
          },
          (error) => {
            console.error('Firestore snapshot error:', error.message);
          }
        );
        return unsubscribe;
      } catch (error) {
        console.error('Firestore fetch error:', error.message);
      }
    };
    const unsub = fetchResponses();
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [authedUser, assessmentId]);

  // ----- scoring helpers (your original logic) -----
  const getOptionValue = (question, response) => {
    if (response === undefined || response === null) return 0;
    // supports "0"/"1"/"2"/"-1" and legacy label storage
    const numericValue = parseInt(response, 10);
    if (!isNaN(numericValue) && [0, 1, 2, -1].includes(numericValue)) {
      return numericValue;
    }
    const option = question.options.find(opt => opt.label === String(response).trim());
    return option ? option.value : 0;
  };

  const calculateTopicScore = (topic) => {
    const topicQuestions = questions.filter(q => q.topic === topic);
    if (topicQuestions.length === 0) return { percentage: null, valid: false, complete: false };

    const allAnswered = topicQuestions.every(q => responses[q.id] !== undefined);
    if (!allAnswered) {
      return { percentage: null, valid: true, complete: false };
    }

    const validResponses = topicQuestions.filter(q => {
      const value = getOptionValue(q, responses[q.id]);
      return value !== -1 && value !== undefined;
    });

    const totalScore = validResponses.reduce((sum, q) => sum + getOptionValue(q, responses[q.id]), 0);
    const maxScore = validResponses.length * 2;
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    return { percentage, valid: true, complete: true };
  };

  const calculatePillarScore = (pillar) => {
    const topics = topicsByPillar[pillar];
    const topicScores = topics.map(topic => calculateTopicScore(topic));
    const completedCount = topicScores.filter(s => s.complete).length;

    if (completedCount === 0) return { percentage: null, valid: false, complete: false };
    if (completedCount < topics.length) return { percentage: null, valid: true, complete: false };

    const totalPerc = topicScores.reduce((sum, s) => sum + s.percentage, 0);
    const avg = totalPerc / topicScores.length;
    return { percentage: avg, valid: true, complete: true };
  };

  const calculateOverallScore = () => {
    const allTopicScores = Object.values(topicsByPillar).flatMap(topics => topics.map(calculateTopicScore));
    const validTopics = allTopicScores.filter(score => score.valid);
    const completeTopics = allTopicScores.filter(score => score.complete);
    if (validTopics.length === 0) return { percentage: null, valid: false, complete: false };
    if (completeTopics.length < allTopicScores.length) return { percentage: null, valid: true, complete: false };

    const totalPercentage = validTopics.reduce((sum, score) => sum + score.percentage, 0) / validTopics.length;
    return { percentage: totalPercentage, valid: true, complete: true };
  };

  // Pillar-level icons (one per pillar)
  const pillarIconFor = (pillar) => {
    if (pillar === 'Environmental Sustainability') return energyIcon;
    if (pillar === 'Social Sustainability') return diversityIcon;
    return null;
  };

  // ===========================================================
  // ===============  ACTION PLAN (exact format)  ==============
  // ===========================================================
  // This block is your original ActionPlan (UI + logic), adapted to:
  //  - use this page's `responses`
  //  - show count next to each topic title
  //  - NOT fetch/subscribe again (we already did above)

  const iconMap = {
    'accessibility': accessibilityIcon,
    'community engagement': communityIcon,
    'diversity and inclusion': diversityTopicIcon,
    'energy and emissions': energyTopicIcon,
    'event safety': eventIcon,
    'fan engagement and education': fanIcon,
    'transport': transportIcon,
    'waste': wasteIcon,
    'water': waterIcon,
  };

  // Map response to numeric value (unchanged from your original)
  const apGetOptionValue = (question, response) => {
    if (response == null) return null;
    const num = parseInt(response, 10);
    if (!isNaN(num) && [0, 1, 2].includes(num)) return num;
    const option = question.options.find(o => o.label === response);
    return option ? option.value : null;
  };

  // Build actionable items (score 0 or 1) — unchanged filter logic
  const actionItems = useMemo(() => {
    return questions
      .map(q => {
        const val = apGetOptionValue(q, responses[q.id]);
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

  // Accordion state: by default, open all topics that have items (exactly like your original)
  const [openTopics, setOpenTopics] = useState(() => new Set(topics));
  useEffect(() => {
    setOpenTopics(new Set());

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

  // ===========================================================

  const overallScore = calculateOverallScore();
  const envScore = calculatePillarScore('Environmental Sustainability');
  const socialScore = calculatePillarScore('Social Sustainability');

  // Hide subtopic icons inside TopicSection to keep pillar sections compact
  const noTopicIcons = () => null;

  return (
    <>
      {/* Small hero band */}
      <PageHero
        title="Your Sustainability Results"
        subtitle={
          <>
            View your overall score and per-pillar performance. You can revisit the questionnaire anytime and then refresh results.
          </>
        }
      />

      <main className="results-page">
        {/* Print button for the whole Results page */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => window.print()}
            className="btn-print"
            aria-label="Print Results"
            title="Print Results"
          >
            🖨️
          </button>
        </div>

        {/* Overall */}
        <ScoreCard
          title="Overall Sustainability"
          percentage={overallScore.complete ? overallScore.percentage : null}
          canvasRef={canvasRefs.overall}
          ariaLabel="Overall Sustainability Gauge"
          displayText={overallScore.complete ? `${Math.round(overallScore.percentage)}%` : 'In progress'}
        />

        {/* Environmental pillar (single icon) */}
        <div className="pillar-block">
          <div className="pillar-header" style={{ display:'flex', alignItems:'center', gap:12, marginTop: 12 }}>
            <img
              src={pillarIconFor('Environmental Sustainability')}
              alt="Environmental pillar icon"
              style={{ width: 40, height: 40, objectFit:'contain' }}
            />
            <h2 className="a11y-heading">Environmental Sustainability</h2>
          </div>
          <TopicSection
            pillar="Environmental Sustainability"
            topics={topicsByPillar['Environmental Sustainability']}
            responses={responses}
            calculateTopicScore={calculateTopicScore}
            getIconComponent={noTopicIcons}
            canvasRef={canvasRefs['environmental-sustainability-pillar']}
            pillarScore={envScore}
          />
        </div>

        {/* Social pillar (single icon) */}
        <div className="pillar-block">
          <div className="pillar-header" style={{ display:'flex', alignItems:'center', gap:12, marginTop: 16 }}>
            <img
              src={pillarIconFor('Social Sustainability')}
              alt="Social pillar icon"
              style={{ width: 40, height: 40, objectFit:'contain' }}
            />
            <h2 className="a11y-heading">Social Sustainability</h2>
          </div>
          <TopicSection
            pillar="Social Sustainability"
            topics={topicsByPillar['Social Sustainability']}
            responses={responses}
            calculateTopicScore={calculateTopicScore}
            getIconComponent={noTopicIcons}
            canvasRef={canvasRefs['social-sustainability-pillar']}
            pillarScore={socialScore}
          />
        </div>

        {/* ======================= FULL ACTION PLAN ======================= */}
        <section className="action-plan-page container" style={{ marginTop: 16 }}>
          {/* (kept from your original ActionPlan header) */}
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
            const count = items.length; // <-- added count

            return (
              <section key={topic} className="mb-8">
                {/* Accordion header button for accessibility */}
                <button
                  id={btnId}
                  className="btn-accordion actionplan-topic"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleTopic(topic)}
                >
                  {/* Left: topic + icon + count */}
                  <span className="flex items-center">
                    <img
                      src={iconSrc}
                      alt={`${topic} icon`}
                      className="w-6 h-6 ml-2 inline-block"
                    /> 
                    {topic}
                    <span class="recommendation-count">
                      {count} {count === 1 ? 'recommendation' : 'recommendations'}
                    </span>
                    
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
        </section>
        {/* ===================== /FULL ACTION PLAN ======================= */}

        {Object.keys(responses).length === 0 && (
          <p className="results-page__no-results">No results yet. Please complete the questionnaire.</p>
        )}
      </main>
    </>
  );
};

export default ResultsPage;
