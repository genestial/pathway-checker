import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuestionnairePage from './pages/QuestionnairePage';
// ⬇️ Import the boundary alongside the default export
import ResultsPage, { ErrorBoundary } from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import ActionPlanPage from './pages/ActionPlanPage';
import Auth from './components/Auth';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './styles/main.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleAuthChange = useCallback((u) => {
    console.log('handleAuthChange triggered with user:', u);
    setUser(u);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed:', u);
      handleAuthChange(u);
      if (u && window.location.pathname === '/auth') {
        console.log('Attempting to navigate to / after login');
        navigate('/', { replace: true });
      }
    });
    return unsubscribe;
  }, [navigate, handleAuthChange]);

  const ProtectedRoute = ({ children }) => {
    console.log('ProtectedRoute user for path:', window.location.pathname, 'user:', user);
    if (!user && window.location.pathname !== '/auth') {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/auth" element={<Auth onAuthChange={handleAuthChange} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/questionnaire"
        element={
          <ProtectedRoute>
            <QuestionnairePage user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <ResultsPage user={user} />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <AboutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/action-plan"
        element={
          <ProtectedRoute>
            <ActionPlanPage user={user} />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Header />
      <AppContent />
    </Router>
  );
}
