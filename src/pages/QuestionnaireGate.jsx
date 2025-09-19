import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getLatestDraft,
  getLatestCompleted,
  createDraft,
  createDraftFrom,
} from '../services/assessments';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';

export default function QuestionnaireGate() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [latestCompleted, setLatestCompleted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChoice, setShowChoice] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const draft = await getLatestDraft(user.uid);
      if (draft) {
        nav(`/questionnaire/${draft.id}`, { replace: true });
        return;
      }
      const completed = await getLatestCompleted(user.uid);
      if (completed) {
        setLatestCompleted(completed);
        setShowChoice(true);
        setLoading(false);
      } else {
        const d = await createDraft(user.uid, {});
        nav(`/questionnaire/${d.id}`, { replace: true });
      }
    })();
  }, [user, nav]);

  if (!user) return <div className="page">Please log in…</div>;
  if (loading) return <div className="page">Loading…</div>;
  if (!showChoice) return null;

  const completedDate =
    latestCompleted?.completedAt?.toDate?.()?.toLocaleDateString?.() ?? '—';

  return (
    <>
      <PageHero 
        title="Sustainability Checker"
        subtitle={<>This tool will help you understand where your organisation currently stands, while offering targeted guidance on how to improve.</>}
      />
      <main className="questionnaire-gate">
        <div className="container">
          <p className="muted">
            You completed an assessment on <strong>{completedDate}</strong>. What would you like to do?
          </p>
          <div className="buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn"
              onClick={async () => {
                const d = await createDraft(user.uid, {});
                nav(`/questionnaire/${d.id}`);
              }}
            >
              Start new (empty)
            </button>
            <button
              className="btn"
              onClick={async () => {
                const d = await createDraftFrom(user.uid, latestCompleted.id, {});
                nav(`/questionnaire/${d.id}`);
              }}
            >
              Start new (prefilled from last)
            </button>
          </div>
          <div className="mt-6">
            <Link to="/assessments" className="text-pathway-primary hover:text-pathway-dark">
              View My Assessments
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}