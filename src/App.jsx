import { BrowserRouter, HashRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultsPage, { ErrorBoundary } from './pages/ResultsPage';
import ActionPlanPage from './pages/ActionPlanPage';
import Auth from './components/Auth';
import QuestionnaireGate from './pages/QuestionnaireGate';
import MyAssessmentsPage from './pages/MyAssessmentsPage';
import AboutPage from './pages/AboutPage';
import ToolkitPage from './pages/ToolkitPage'; 
import AboutTheToolPage from './pages/AboutTheToolPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ProfilePage from './pages/ProfilePage';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './styles/main.css';

/** Choose router by env */
const useHash = import.meta.env.VITE_ROUTER === 'hash';
const RouterImpl = useHash ? HashRouter : BrowserRouter;

/** Normalize basename for BrowserRouter only */
function getBasename() {
  let raw = import.meta.env.BASE_URL || '/';
  if (raw === './' || raw === '.') return '';
  raw = raw.replace(/\/+$/, '');
  if (raw && !raw.startsWith('/')) raw = `/${raw}`;
  return raw;
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
      <Route
        path="/questionnaire"
        element={
          <ProtectedRoute>
            <QuestionnaireGate />
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/assessments"
        element={
          <ProtectedRoute>
            <MyAssessmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/toolkit" element={<ToolkitPage />} />
      <Route path="/tool" element={<AboutTheToolPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}

export default function App() {
  const basename = useHash ? undefined : getBasename();
  return (
    <RouterImpl {...(!useHash && basename !== undefined ? { basename } : {})}>
      <ScrollToTop />
      <Header />
      <main className="page">
        <AppContent />
      </main>
      <Footer />
    </RouterImpl>
  );
}