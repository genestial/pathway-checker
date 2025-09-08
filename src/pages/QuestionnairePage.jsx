import { useState, useEffect, useRef, useMemo } from 'react';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Tooltip } from 'react-tooltip';
import { useNavigate, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';   // small hero band
import questions from '../data/questions';

const DEBUG = false; // set false to hide the panel/logs

function QuestionnairePage() {
  const [user, setUser] = useState(null);            // <-- get user from auth (no prop)
  const [responses, setResponses] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [showDebug, setShowDebug] = useState(DEBUG);

  const navigate = useNavigate();
  const { assessmentId } = useParams();

  // Subscribe to auth so `user` is always available here
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  // --- normalization: always keep strings in state ---
  const normalizeEntryToString = (v) => {
    if (v == null) return '';
    if (typeof v === 'string') return v;           // '0'|'1'|'2'|'-1'|'N/A'
    if (typeof v === 'number') return String(v);   // 0|1|2|-1 -> "0"|"1"|"2"|"-1"
    if (typeof v === 'object') {
      if (v.na) return 'N/A';
      if (v.value != null) return String(v.value);
      return '';
    }
    return '';
  };
  const normalizeMapToStrings = (obj = {}) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [String(k), normalizeEntryToString(v)]));

  // Track fields briefly to avoid snapshot overwriting a fresh local pick
  const pendingRef = useRef(new Map()); // Map<qid, expiresAtMs>
  const prevResponsesRef = useRef({});

  // Topics + helpers (unchanged layout)
  const topics = useMemo(() => Array.from(new Set(questions.map(q => q.topic))), []);
  const getQuestionsByTopic = (topic) => questions.filter(q => q.topic === topic);

  const totalQuestions = questions.length;
  const activeQuestionIds = useMemo(() => new Set(questions.map(q => String(q.id))), []);
  const answeredCount = Object.keys(responses).filter(
    id => activeQuestionIds.has(String(id)) && responses[id] && responses[id] !== 'N/A'
  ).length;
  const isAllComplete = answeredCount === totalQuestions;

  // Live responses from Firestore (by assessmentId)
  useEffect(() => {
    if (!user || !assessmentId) return;
    const ref = doc(db, 'users', user.uid, 'assessments', assessmentId);
    const path = `users/${user.uid}/assessments/${assessmentId}`;

    const unsub = onSnapshot(ref, snap => {
      if (!snap.exists()) {
        if (DEBUG) console.warn('[SNAPSHOT] missing doc:', path);
        return;
      }
      const serverRes = normalizeMapToStrings(snap.data().responses || {});
      const now = Date.now();
      const merged = { ...serverRes };
      // keep any very-recent local picks
      pendingRef.current.forEach((expiresAt, qid) => {
        if (expiresAt > now && responses[qid] !== undefined) merged[qid] = responses[qid];
        else if (expiresAt <= now) pendingRef.current.delete(qid);
      });

      if (DEBUG) {
        const prev = prevResponsesRef.current || {};
        const changed = [];
        const allKeys = new Set([...Object.keys(prev), ...Object.keys(merged)]);
        for (const k of allKeys) if ((prev[k] ?? '') !== (merged[k] ?? '')) changed.push({ qid: k, prev: prev[k] ?? '', next: merged[k] ?? '' });
        if (changed.length) {
          console.groupCollapsed('[SNAPSHOT] applied', path, `(${changed.length} changes)`);
          console.table(changed);
          console.groupEnd();
        }
      }

      prevResponsesRef.current = merged;
      setResponses(merged);
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, assessmentId /* responses read via ref inside */]);

  // Body class (unchanged)
  useEffect(() => {
    document.body.classList.add('page--questionnaire');
    return () => document.body.classList.remove('page--questionnaire');
  }, []);

  // Nav handlers (unchanged)
  const handlePrevious = () => setTabIndex(i => Math.max(i - 1, 0));
  const handleNext = () => setTabIndex(i => Math.min(i + 1, topics.length - 1));

  // Save one answer (strings) with short "pending" window
  const handleResponseChange = async (id, value) => {
    if (!user || !assessmentId) {
      if (DEBUG) console.warn('[SELECT ignored] no user or assessmentId', { id, value, user, assessmentId });
      return;
    }
    const qid = String(id);
    const strVal = normalizeEntryToString(value);
    const path = `users/${user.uid}/assessments/${assessmentId}`;

    // Validate option membership (debug)
    const q = questions.find(x => String(x.id) === qid);
    if (DEBUG && q) {
      const opts = (q.options || []).map(o => String(o?.value));
      const present = opts.includes(strVal);
      if (!present) console.warn('[SELECT] value not in options', { qid, selected: strVal, available: opts });
      else console.log('[SELECT] local change', { qid, selected: strVal });
    }

    const newRes = { ...responses, [qid]: strVal };
    setResponses(newRes);               // optimistic UI
    prevResponsesRef.current = newRes;  // baseline for next snapshot diff
    pendingRef.current.set(qid, Date.now() + 1200);

    try {
      const ref = doc(db, 'users', user.uid, 'assessments', assessmentId);
      await setDoc(ref, { responses: newRes, updatedAt: serverTimestamp() }, { merge: true });
      if (DEBUG) console.log('[WRITE ok]', path, { qid, value: strVal });
    } catch (err) {
      console.error('[WRITE error]', path, err);
    }
  };

  // Topic completion (unchanged)
  const isTopicComplete = (topic) =>
    getQuestionsByTopic(topic).every(q => {
      const resp = responses[String(q.id)];
      return resp !== undefined && resp !== null && resp !== '' && resp !== 'N/A';
    });

  // Results snapshot for submit
  const computeResultsSnapshot = () => {
    const parseVal = (v) => {
      if (v === 'N/A') return null;
      if (v === '' || v == null) return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : n;
    };

    const byPillar = {};
    const byTopic  = {};
    let sum = 0, cnt = 0;

    for (const q of questions) {
      const raw = responses[String(q.id)];
      const val = parseVal(raw);
      if (val == null) continue;

      const numericOpts = (q.options || [])
        .map(o => (typeof o.value === 'number' ? o.value : Number(o.value)))
        .filter(v => Number.isFinite(v) && v >= 0);
      const max = numericOpts.length ? Math.max(...numericOpts) : 2;

      const pct = max > 0 ? (val / max) * 100 : 0;
      sum += pct; cnt += 1;

      const pk = q.pillar || q.pillarId || q.pillarName || 'General';
      const tk = q.topic  || q.topicId  || q.topicName  || 'General';

      byPillar[pk] = byPillar[pk] || { sum: 0, count: 0 };
      byPillar[pk].sum += pct; byPillar[pk].count += 1;

      byTopic[tk] = byTopic[tk] || { sum: 0, count: 0 };
      byTopic[tk].sum += pct; byTopic[tk].count += 1;
    }

    const overall = cnt ? sum / cnt : 0;
    const finalize = (obj) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v.count ? v.sum / v.count : 0]));
    const band = (s => (s>=85?'Leading':s>=65?'Advancing':s>=40?'Developing':'Needs Improvement'))(overall);

    const actionItems = questions
      .map(q => {
        const n = Number(responses[String(q.id)]);
        return {
          questionId: q.id,
          topic: q.topic || q.topicId || q.topicName || 'General',
          text: q.text,
          value: Number.isNaN(n) ? null : n,
        };
      })
      .filter(i => i.value === 0 || i.value === 1);

    return { overall, band, byPillar: finalize(byPillar), byTopic: finalize(byTopic), actionItems };
  };

  // Submit: mark completed + persist snapshot
  const handleSubmit = async () => {
    if (!user || !assessmentId) return;
    const ref = doc(db, 'users', user.uid, 'assessments', assessmentId);
    const resultsSnapshot = computeResultsSnapshot();
    try {
      await updateDoc(ref, {
        status: 'completed',
        results: resultsSnapshot,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate(`/results/${assessmentId}`, { replace: true });
    } catch (err) {
      console.error('[SUBMIT error]', `users/${user.uid}/assessments/${assessmentId}`, err);
    }
  };

  // Debug helpers
  const currentTopicQs = getQuestionsByTopic(topics[tabIndex] || topics[0] || '');
  const debugRows = currentTopicQs.map(q => {
    const picked = responses[String(q.id)] ?? '';
    const opts = (q.options || []).map(o => String(o?.value));
    const present = opts.includes(String(picked));
    return { id: String(q.id), picked, present, opts: opts.join(',') };
  });

  return (
    <>
      <PageHero
        title="Sustainability Checker"
        subtitle={<>Please complete the questions below. Select <strong>Not applicable</strong> only if the question is out of scope for your association.</>}
      />

      <main className="questionnaire-page">
        <Tabs selectedIndex={tabIndex} onSelect={setTabIndex} className="questionnaire-tabs">
          {/* Sidebar */}
          <aside className="sidebar-tabs">
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
                    <span className={`timeline-dot mr-3 ${completed ? 'completed-dot' : 'pending-dot'}`}>
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
            {DEBUG && (
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <label style={{ fontSize: 12 }}>
                  <input type="checkbox" checked={showDebug} onChange={e => setShowDebug(e.target.checked)} /> Debug
                </label>
              </div>
            )}

            {showDebug && (
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 }}>
                  <div><strong>assessmentId:</strong> {assessmentId}</div>
                  <div><strong>user:</strong> {user?.uid || '—'}</div>
                  <div><strong>tab:</strong> {topics[tabIndex]}</div>
                  <div style={{ overflowX: 'auto', marginTop: 6 }}>
                    <table className="table" style={{ width: '100%' }}>
                      <thead><tr><th>QID</th><th>picked</th><th>present in options?</th><th>option values</th></tr></thead>
                      <tbody>
                        {debugRows.map(r => (
                          <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{String(r.picked)}</td>
                            <td style={{ color: r.present ? 'green' : 'red' }}>{String(r.present)}</td>
                            <td>{r.opts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {topics.map((topic, idx) => (
              <TabPanel key={idx} className="space-y-6">
                {getQuestionsByTopic(topic).map(q => {
                  const qid = String(q.id);
                  const current = responses[qid] ?? '';
                  const opts = q.options || [];
                  return (
                    <div key={qid} className="question-block">
                      <label className="question-title">
                        {q.text} <span className="question-id">[Q: {qid}]</span>
                      </label>
                      <select
                        value={current === undefined || current === null ? '' : String(current)}
                        onChange={e => handleResponseChange(qid, e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pathway-primary text-lg"
                      >
                        <option value="">Select...</option>
                        {opts.map(opt => (
                          <option key={String(opt.label ?? opt.value)} value={String(opt.value)}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </TabPanel>
            ))}

            {questions.map(q => (
              <Tooltip key={String(q.id)} id={`tooltip-${String(q.id)}`} place="top" effect="solid" />
            ))}
          </section>
        </Tabs>
      </main>

      {/* ✅ Sticky action bar */}
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
