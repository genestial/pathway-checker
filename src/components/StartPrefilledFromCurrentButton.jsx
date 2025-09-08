// Small reusable button for Results page to spin up a prefilled new draft
// from the *current* assessment.

import { createDraftFrom } from '../services/assessments';
import { auth } from '../firebase'; // use initialized singleton
import { useNavigate, useParams } from 'react-router-dom';

export default function StartPrefilledFromCurrentButton({ className = 'btn' }) {
  const { assessmentId } = useParams();
  const nav = useNavigate();

  return (
    <button
      className={className}
      onClick={async () => {
        const user = auth.currentUser;
        if (!user) return; // optionally navigate('/login')
        const d = await createDraftFrom(user.uid, assessmentId, {});
        nav(`/questionnaire/${d.id}`);
      }}
    >
      Start New (prefilled)
    </button>
  );
}
