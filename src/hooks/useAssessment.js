import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getAssessment, saveResponses, completeAssessment } from '../services/assessments';

/** Parse stored entry into a number or -1 (N/A). Return null if unanswered. */
export function valueFromResponse(entry) {
  if (entry == null) return null;
  if (typeof entry === 'number') return Number.isNaN(entry) ? null : entry;
  if (typeof entry === 'string') {
    const n = Number(entry);
    return Number.isNaN(n) ? null : n;
  }
  if (typeof entry === 'object') {
    if (entry.na) return -1;
    if (entry.value != null) {
      const n = Number(entry.value);
      return Number.isNaN(n) ? null : n;
    }
  }
  return null;
}

/** Normalize to { value: number, na: boolean } for future consistency. */
export function normalizeForStore(val) {
  const n = Number(val);
  if (Number.isNaN(n)) return { value: 0, na: false };
  if (n === -1) return { value: -1, na: true };
  return { value: n, na: false };
}

/** Options helper (fallback to -1/0/1/2) */
export function optionsForQuestion(q) {
  if (Array.isArray(q?.options) && q.options.length > 0) {
    return q.options.map((o, idx) => {
      if (typeof o === 'number') return { value: o, label: String(o) };
      if (typeof o === 'string') {
        const n = Number(o);
        return Number.isNaN(n) ? { value: idx, label: o } : { value: n, label: o };
      }
      const raw = o?.value;
      const n = Number(raw);
      const value = Number.isNaN(n) ? idx : n;
      return { value, label: o?.label ?? String(value) };
    });
  }
  return [
    { value: -1, label: 'N/A' },
    { value: 0, label: 'No' },
    { value: 1, label: 'Partially' },
    { value: 2, label: 'Yes' },
  ];
}

function getPillarKey(q) { return q.pillar || q.pillarId || q.pillarName || 'General'; }
function getTopicKey(q)  { return q.topic  || q.topicId  || q.topicName  || 'General'; }

/** Compute a results snapshot (overall/bands/byPillar/byTopic/actionItems). */
export function computeResultsSnapshot(questions, responses) {
  const perQuestion = [];
  questions.forEach(q => {
    const val = valueFromResponse(responses?.[q.id]);
    if (val == null) return;
    perQuestion.push({ q, val });
  });

  const acc = { overall:{sum:0,count:0}, pillars:{}, topics:{} };
  for (const { q, val } of perQuestion) {
    if (val < 0) continue; // N/A
    const opts = optionsForQuestion(q).filter(o => o.value >= 0);
    const max = opts.length ? Math.max(...opts.map(o => o.value)) : 2;
    const pct = max > 0 ? (val / max) * 100 : 0;

    acc.overall.sum += pct; acc.overall.count += 1;
    const pk = getPillarKey(q);
    acc.pillars[pk] = acc.pillars[pk] || { sum:0, count:0 };
    acc.pillars[pk].sum += pct; acc.pillars[pk].count += 1;
    const tk = getTopicKey(q);
    acc.topics[tk] = acc.topics[tk] || { sum:0, count:0 };
    acc.topics[tk].sum += pct; acc.topics[tk].count += 1;
  }

  const overall = acc.overall.count ? acc.overall.sum / acc.overall.count : 0;
  const byPillar = Object.fromEntries(Object.entries(acc.pillars).map(([k,v]) => [k, v.count ? v.sum / v.count : 0]));
  const byTopic  = Object.fromEntries(Object.entries(acc.topics).map(([k,v]) => [k, v.count ? v.sum / v.count : 0]));

  const actionItems = questions
    .map(q => {
      const val = valueFromResponse(responses?.[q.id]);
      return { questionId: q.id, topic: getTopicKey(q), text: q.text, value: val };
    })
    .filter(i => i.value === 0 || i.value === 1);

  const band = (s => s>=85?'Leading':s>=65?'Advancing':s>=40?'Developing':'Needs Improvement')(overall);
  return { overall, band, byPillar, byTopic, actionItems };
}

/**
 * Hook: loads/saves an assessment by id; you keep your own JSX/UI.
 * Returns: { user, loading, responses, setAnswer, selectValue, answeredCount, isComplete, submitAssessment }
 */
export function useAssessment(assessmentId, questions) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const saveTimer = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || !assessmentId) return;
    (async () => {
      setLoading(true);
      const a = await getAssessment(user.uid, assessmentId);
      setResponses(a?.responses || {});
      setLoading(false);
    })();
  }, [user, assessmentId]);

  const setAnswer = useCallback((qid, rawVal) => {
    const normalized = normalizeForStore(rawVal);
    setResponses(prev => {
      const next = { ...prev, [qid]: normalized };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (user) saveResponses(user.uid, assessmentId, next);
      }, 250);
      return next;
    });
  }, [user, assessmentId]);

  const answeredCount = useMemo(() => {
    return questions.reduce((n, q) => n + (valueFromResponse(responses[q.id]) != null ? 1 : 0), 0);
  }, [responses, questions]);

  const isComplete = useMemo(() => {
    if (!questions.length) return false;
    for (const q of questions) {
      if (valueFromResponse(responses[q.id]) == null) return false;
    }
    return true;
  }, [responses, questions]);

  const submitAssessment = useCallback(async () => {
    if (!user) return;
    const snapshot = computeResultsSnapshot(questions, responses);
    await completeAssessment(user.uid, assessmentId, snapshot);
  }, [user, assessmentId, questions, responses]);

  /** For controlled <select>, returns '' or String(number). */
  const selectValue = useCallback((qid) => {
    const v = valueFromResponse(responses[qid]);
    return v == null ? '' : String(v);
  }, [responses]);

  return {
    user, loading, responses,
    setAnswer, selectValue,
    answeredCount, isComplete,
    submitAssessment,
  };
}
