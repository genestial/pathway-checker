import { createDraftFrom } from '../services/assessments';
import { auth } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';

export default function StartPrefilledFromCurrentButton({ className = 'btn' }) {
  const { assessmentId } = useParams();
  const nav = useNavigate();

  return (
    <button
      className={className}
      onClick={async () => {
        const user = auth.currentUser;
        if (!user) return;
        const d = await createDraftFrom(user.uid, assessmentId, {});
        nav(`/questionnaire/${d.id}`);
      }}
    >
      Start New (prefilled)
    </button>
  );
}