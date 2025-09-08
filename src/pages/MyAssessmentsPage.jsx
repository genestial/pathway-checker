// Lists all past assessments with quick actions and a trend chart.
// Requires: npm i recharts

import { useEffect, useMemo, useState } from 'react';
import { listAssessments, getLatestCompleted, createDraft, createDraftFrom } from '../services/assessments';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function BandPill({ band }) {
  if (!band) return null;
  const cls = `pill pill--${band.replace(/\s+/g, '-').toLowerCase()}`;
  return <span className={cls} style={{ marginLeft: 6 }}>{band}</span>;
}

export default function MyAssessmentsPage() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [latestCompleted, setLatestCompleted] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const list = await listAssessments(user.uid);
      setItems(list);
      const lc = await getLatestCompleted(user.uid);
      setLatestCompleted(lc);
    })();
  }, [user]);

  const trendData = useMemo(() => {
    return items
      .filter(a => a.status === 'completed' && a.results?.overall != null)
      .map(a => {
        const dt = a.completedAt?.toDate?.() ? a.completedAt.toDate() :
                   a.createdAt?.toDate?.() ? a.createdAt.toDate() : null;
        return dt ? { date: dt, label: dt.toLocaleDateString?.() ?? '', score: Math.round(a.results.overall) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.date - b.date);
  }, [items]);

  if (!user) return <div className="page">Please log in…</div>;

  return (
    <div className="page">
      <div className="page-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h1>My Assessments</h1>
        <div className="btn-group" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={async () => {
            const d = await createDraft(user.uid, {});
            nav(`/questionnaire/${d.id}`);
          }}>
            Start New (empty)
          </button>
          <button
            className="btn"
            disabled={!latestCompleted}
            title={latestCompleted ? '' : 'No completed assessment yet'}
            onClick={async () => {
              if (!latestCompleted) return;
              const d = await createDraftFrom(user.uid, latestCompleted.id, {});
              nav(`/questionnaire/${d.id}`);
            }}
          >
            Start New (prefilled)
          </button>
        </div>
      </div>

      {trendData.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 className="card__title">Overall score trend</h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(v) => [`${v}`, 'Score']} labelFormatter={(l) => `Date: ${l}`} />
                <Line type="monotone" dataKey="score" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table assessments-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Created</th>
              <th>Status</th>
              <th>Score</th>
              <th style={{ width: 320 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => {
              const created = a.createdAt?.toDate?.()?.toLocaleDateString?.() ?? '—';
              const score = a.results?.overall ?? '—';
              return (
                <tr key={a.id}>
                  <td>{a.title || a.id.slice(0, 6)}</td>
                  <td>{created}</td>
                  <td>{a.status === 'draft' ? <span className="badge">Draft</span> : 'Completed'}</td>
                  <td>
                    {score !== '—'
                      ? (<><strong>{Math.round(score)}</strong><BandPill band={a.results?.band} /></>)
                      : '—'}
                  </td>
                  <td className="actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {a.status === 'draft' ? (
                      <button className="btn" onClick={() => nav(`/questionnaire/${a.id}`)}>Continue</button>
                    ) : (
                      <>
                        <button className="btn" onClick={() => nav(`/results/${a.id}`)}>View Results</button>
                        <button className="btn" onClick={() => nav(`/action-plan/${a.id}`)}>Action Plan</button>
                        <button className="btn" onClick={() => nav(`/questionnaire/${a.id}`)}>Edit</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, textAlign: 'center', color: '#666' }}>
                  No assessments yet. Start your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
