import React, { useState, useEffect, useRef, Component } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import ScoreCard from '../components/ScoreCard';
import TopicSection from '../components/TopicSection';
import PageHero from '../components/PageHero';
import questions from '../data/questions';

// topic icons (bundled via Vite from src/assets)
import accessibilityIcon from '../assets/icons/accessibility.png';
import wasteIcon from '../assets/icons/waste.png';
import transportIcon from '../assets/icons/transport.png';
import energyIcon from '../assets/icons/energy.png';
import communityIcon from '../assets/icons/community.png';
import diversityIcon from '../assets/icons/diversity.png';
import eventIcon from '../assets/icons/events.png';
import fanIcon from '../assets/icons/fans.png';
import waterIcon from '../assets/icons/water.png';

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
  const topicsByPillar = {
    'Environmental Sustainability': ['Energy and Emissions', 'Transport', 'Waste', 'Water'],
    'Social Sustainability': ['Accessibility', 'Community Engagement', 'Diversity and Inclusion', 'Event Safety', 'Fan Engagement and Education'],
  };

  const [responses, setResponses] = useState({});
  const canvasRefs = {
    overall: useRef(null),
    'environmental-sustainability-pillar': useRef(null),
    'social-sustainability-pillar': useRef(null),
  };

  useEffect(() => {
    const fetchResponses = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid, 'assessments', 'current');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().responses || {};
          setResponses(data);
        } else {
          await setDoc(docRef, { responses: {} }, { merge: true });
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
    fetchResponses();
  }, [user]);

  const getOptionValue = (question, response) => {
    if (response === undefined || response === null) return 0;
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

  const actionItems = questions
    .map(q => ({
      id: q.id,
      topic: q.topic,
      text: q.text,
      value: getOptionValue(q, responses[q.id]),
    }))
    .filter(item => item.value !== null && item.value < 2);
  const hasActionItems = actionItems.length > 0;

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

  const getIconComponent = (topic) => {
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
    const iconPath = iconMap[topic.toLowerCase()];
    return iconPath
      ? ({ style }) => (
          <img
            src={iconPath}
            alt={`${topic} Icon`}
            style={{ ...style, width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )
      : null;
  };

  const overallScore = calculateOverallScore();
  const envScore = calculatePillarScore('Environmental Sustainability');
  const socialScore = calculatePillarScore('Social Sustainability');

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

        {hasActionItems && (
          <div className="text-center mb-8">
            <Link to="/action-plan">
              <button className="btn">Review Action Plan</button>
            </Link>
          </div>
        )}

        <ScoreCard
          title="Overall Sustainability"
          percentage={overallScore.complete ? overallScore.percentage : null}
          canvasRef={canvasRefs.overall}
          ariaLabel="Overall Sustainability Gauge"
          displayText={overallScore.complete ? `${Math.round(overallScore.percentage)}%` : 'In progress'}
        />

        <div className="pillars-container">
          <TopicSection
            pillar="Environmental Sustainability"
            topics={topicsByPillar['Environmental Sustainability']}
            responses={responses}
            calculateTopicScore={calculateTopicScore}
            getIconComponent={getIconComponent}
            canvasRef={canvasRefs['environmental-sustainability-pillar']}
            pillarScore={envScore}
          />
          <TopicSection
            pillar="Social Sustainability"
            topics={topicsByPillar['Social Sustainability']}
            responses={responses}
            calculateTopicScore={calculateTopicScore}
            getIconComponent={getIconComponent}
            canvasRef={canvasRefs['social-sustainability-pillar']}
            pillarScore={socialScore}
          />
        </div>

        {Object.keys(responses).length === 0 && (
          <p className="results-page__no-results">No results yet. Please complete the questionnaire.</p>
        )}
      </main>
    </>
  );
};

export default ResultsPage;
