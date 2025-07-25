import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Tooltip } from 'react-tooltip';
import Header from '../components/Header';
import questions from '../data/questions';
import { useNavigate } from 'react-router-dom';

function QuestionnairePage({ user }) {
  const [responses, setResponses] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const totalQuestions = questions.length; // 38 questions
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid, 'assessments', 'current'), (doc) => {
        if (doc.exists()) setResponses(doc.data().responses || {});
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleResponseChange = async (questionId, value) => {
    if (user) {
      const newResponses = { ...responses, [questionId]: value };
      setResponses(newResponses);
      await setDoc(doc(db, 'users', user.uid, 'assessments', 'current'), { responses: newResponses }, { merge: true });
    }
  };

  const topics = [...new Set(questions.map(q => q.topic))];
  const getQuestionsByTopic = (topic) => questions.filter(q => q.topic === topic);

  const handlePrevious = () => setTabIndex(Math.max(tabIndex - 1, 0));
  const handleNext = () => setTabIndex(Math.min(tabIndex + 1, topics.length - 1));

  const progress = ((tabIndex + 1) / topics.length) * 100;
  const answeredCount = Object.keys(responses).filter(id => responses[id] && !responses[id].startsWith('N/A')).length;

  const handleSubmit = async () => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'assessments', 'current'), { responses }, { merge: true });
      console.log('Submitted responses:', responses);
      navigate('/results');
    }
  };

  return (
    <main className="questionnaire-page">
      <h1 className="page-heading">Sustainability Questionnaire</h1>
      <p className="text-md font-montserrat text-gray-600 mb-6">This questionnaire assesses your organization's sustainability practices across various topics. Please answer each question to the best of your knowledge, selecting 'N/A' if a question is outside your control or scope.</p>
      <div className="mb-6">
        <div className="a11y-progress relative">
          <div
            className="a11y-progress-bar"
            role="progressbar"
            aria-valuenow={answeredCount}
            aria-valuemin="0"
            aria-valuemax={totalQuestions}
            aria-label="Questionnaire progress"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          ></div>
          <span className="text-sm font-montserrat text-gray-600 absolute inset-0 flex items-center justify-center">
            {answeredCount} of {totalQuestions} questions completed
          </span>
        </div>
      </div>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList className="tab-list">
          {topics.map((topic, index) => (
            <Tab
              key={topic}
              className={tabIndex === index ? 'tab tab-active' : 'tab tab-inactive'}
            >
              {topic}
            </Tab>
          ))}
        </TabList>
        {topics.map((topic, index) => (
          <TabPanel key={`tabpanel-${topic}`} className="mt-4">
            <div className="space-y-6">
              {getQuestionsByTopic(topic).map((q) => (
                <div
                  key={q.id}
                  className="question-block"
                >
                  <label className="sr-only" id={`question-${q.id}-label`}>Question {q.id}</label>
                  <label className="block text-xs font-montserrat text-gray-400 mb-1 font-mono" aria-labelledby={`question-${q.id}-label`}>[Q: {q.id}]</label>
                  <label className="block text-xl font-poppins font-black text-gray-800 mb-4" aria-labelledby={`question-${q.id}-label`}>{q.text}</label>
                  <select
                    value={responses[q.id] || ''}
                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                    className="a11y-button w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pathway-primary text-lg"
                    aria-describedby={`guidance-${q.id}`}
                  >
                    <option value="">Select...</option>
                    {q.options.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </TabPanel>
          ))}
        </Tabs>
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className="a11y-button bg-pathway-secondary text-white rounded-lg hover:bg-pathway-dark transition disabled:opacity-50"
            disabled={tabIndex === 0}
            aria-label="Previous section"
          >
            Previous
          </button>
          {tabIndex === topics.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="a11y-button bg-pathway-primary text-white rounded-lg hover:bg-pathway-dark transition"
              aria-label="Submit questionnaire"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="a11y-button bg-pathway-primary text-white rounded-lg hover:bg-pathway-dark transition disabled:opacity-50"
              disabled={tabIndex === topics.length - 1}
              aria-label="Next section"
            >
              Next
            </button>
          )}
        </div>
        {questions.map((q) => (
          <Tooltip key={`tooltip-${q.id}`} id={`tooltip-${q.id}`} place="top" effect="solid" className="z-50" />
        ))}
      </main>
    );
}

export default QuestionnairePage;