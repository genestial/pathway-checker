import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';   // small hero band
import questions from '../data/questions';

function QuestionnairePage({ user }) {
  const [responses, setResponses] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  // Topics + helpers
  const topics = Array.from(new Set(questions.map(q => q.topic)));
  const getQuestionsByTopic = topic => questions.filter(q => q.topic === topic);

  const totalQuestions = questions.length;
  const activeQuestionIds = new Set(questions.map(q => q.id));
  const answeredCount = Object.keys(responses).filter(
    id => activeQuestionIds.has(id) && responses[id] && responses[id] !== 'N/A'
  ).length;
  const isAllComplete = answeredCount === totalQuestions; // ✅ only enable Submit at 100%

  const navigate = useNavigate();

  // Live responses
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'assessments', 'current');
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) setResponses(snap.data().responses || {});
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    document.body.classList.add('page--questionnaire');
    return () => document.body.classList.remove('page--questionnaire');
  }, []);

  // Nav handlers
  const handlePrevious = () => setTabIndex(i => Math.max(i - 1, 0));
  const handleNext = () => setTabIndex(i => Math.min(i + 1, topics.length - 1));
  const handleSubmit = async () => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid, 'assessments', 'current'), { responses }, { merge: true });
    navigate('/results');
  };

  // Change handler
  const handleResponseChange = async (id, value) => {
    if (!user) return;
    const newRes = { ...responses, [id]: value };
    setResponses(newRes);
    await setDoc(doc(db, 'users', user.uid, 'assessments', 'current'), { responses: newRes }, { merge: true });
  };

  const isTopicComplete = topic =>
    getQuestionsByTopic(topic).every(q => {
      const resp = responses[q.id];
      return resp !== undefined && resp !== null && resp !== '' && resp !== 'N/A';
    });

  return (
    <>
      {/* Small hero band with page title */}
      <PageHero title="Sustainability Checker" 
        subtitle={
          <>
            Please complete the questions below. Select <strong>Not applicable</strong> only if the question is out of scope for your association.
          </>
        }
      />

      <main className="questionnaire-page">
        <Tabs selectedIndex={tabIndex} onSelect={setTabIndex} className="questionnaire-tabs">
            {/* Sidebar */}
          <aside className="sidebar-tabs">
            {/* Progress */}
            <div className="a11y-progress mb-6 relative">
              <div
                className="a11y-progress-bar"
                role="progressbar"
                aria-valuenow={answeredCount}
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                {answeredCount} of {totalQuestions} completed
              </span>
            </div>

            <TabList className="tab-list-vertical">
              {topics.map((topic, idx) => {
                const completed = isTopicComplete(topic);
                const isActive = idx === tabIndex;
                return (
                  <Tab
                    key={idx}
                    className={`flex items-center pl-3 cursor-pointer ${
                      isActive
                        ? 'text-pathway-primary font-bold'
                        : completed
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >
                    <span
                      className={`timeline-dot mr-3 ${
                        completed ? 'completed-dot' : 'pending-dot'
                      }`}
                    >
                      {completed ? '✔️' : ''}
                    </span>
                    {topic}
                  </Tab>
                );
              })}
            </TabList>
          </aside>

          {/* Content */}
          <section className="tab-content">
           

            {topics.map((topic, idx) => (
              <TabPanel key={idx} className="space-y-6">
                {getQuestionsByTopic(topic).map(q => (
                  <div key={q.id} className="question-block">
                    <label className="question-title">{q.text} <span className="question-id">[Q: {q.id}]</span></label>
                    <select
                      value={responses[q.id] || ''}
                      onChange={e => handleResponseChange(q.id, e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pathway-primary text-lg"
                    >
                      <option value="">Select...</option>
                      {q.options.map(opt => (
                        <option key={opt.label} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </TabPanel>
            ))}

            

            {questions.map(q => (
              <Tooltip key={q.id} id={`tooltip-${q.id}`} place="top" effect="solid" />
            ))}
          </section>
        </Tabs>
      </main>
      {/* ✅ Sticky action bar always visible */}
            <div className="questionnaire-actions" role="region" aria-label="Questionnaire navigation">
              <div className="questionnaire-actions__inner">
                <button onClick={handlePrevious} className="btn btn--lg" disabled={tabIndex === 0}>
                  Previous
                </button>

                <div className="questionnaire-actions__spacer" />

                {tabIndex < topics.length - 1 && (
                  <button onClick={handleNext} className="btn btn--lg">
                    Next
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  className="btn btn--lg"
                  disabled={!isAllComplete}
                  title={isAllComplete ? 'Submit your responses' : 'Complete all questions to enable submit'}
                >
                  Submit
                </button>
              </div>
            </div>
    </>
  );
}

export default QuestionnairePage;
