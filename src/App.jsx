import { BrowserRouter, HashRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultsPage, { ErrorBoundary } from './pages/ResultsPage';
import ActionPlanPage from './pages/ActionPlanPage';
import Auth from './components/Auth';
import QuestionnaireGate from './pages/QuestionnaireGate';
import MyAssessmentsPage from './pages/MyAssessmentsPage';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './styles/main.css';

/** Choose router by env */
const useHash = import.meta.env.VITE_ROUTER === 'hash';
const RouterImpl = useHash ? HashRouter : BrowserRouter;

/** Normalize basename for BrowserRouter only */
function getBasename() {
  let raw = import.meta.env.BASE_URL || '/';
  // Guard against "./" or "." producing "/./"
  if (raw === './' || raw === '.') return '';
  // Remove trailing slash(es)
  raw = raw.replace(/\/+$/, '');
  // Ensure leading slash if not empty
  if (raw && !raw.startsWith('/')) raw = `/${raw}`;
  return raw; // e.g. "/clients/aspon/pathwaychecker"
}

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleAuthChange = useCallback((u) => {
    setUser(u);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      handleAuthChange(u);
      // If user logs in while on /login, send them to the app root (relative to basename)
      if (u && window.location.pathname.endsWith('/login')) {
        navigate('/', { replace: true });
      }
    });
    return unsubscribe;
  }, [navigate, handleAuthChange]);

  const ProtectedRoute = ({ children }) => {
    if (!user && !window.location.pathname.endsWith('/login') && window.location.pathname !== '/') {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<Auth onAuthChange={handleAuthChange} />} />
      <Route path="/" element={<HomePage />} />
      {/* Gate that decides resume/edit/new */}
<Route
  path="/questionnaire"
  element={
    <ProtectedRoute>
      <QuestionnaireGate />
    </ProtectedRoute>
  }
/>

{/* Canonical param routes */}
<Route
  path="/questionnaire/:assessmentId"
  element={
    <ProtectedRoute>
      <QuestionnairePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/results/:assessmentId"
  element={
    <ProtectedRoute>
      <ResultsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/action-plan/:assessmentId"
  element={
    <ProtectedRoute>
      <ActionPlanPage />
    </ProtectedRoute>
  }
/>

{/* Assessments log */}
<Route
  path="/assessments"
  element={
    <ProtectedRoute>
      <MyAssessmentsPage />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default function App() {
  const basename = useHash ? undefined : getBasename();
  return (
    <RouterImpl {...(!useHash && basename !== undefined ? { basename } : {})}>
      <Header />
      <main className="page">
        <AppContent />
      </main>
      <Footer />
    </RouterImpl>
  );
}