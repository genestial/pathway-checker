import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import PageHero from '../components/PageHero';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/questionnaire');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHero
        title="Login to PATHWAY"
        subtitle="Sign in to access the Sustainability Checker and your personalized action plan."
      />
      <main className="auth-container">
        <div className="container">
          <div className="auth-container__inner">
            {error && <p className="auth-container__error">{error}</p>}
            <form onSubmit={handleLogin} className="auth-container__form">
              <div className="auth-container__field">
                <label className="auth-container__label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-container__input"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="auth-container__field">
                <label className="auth-container__label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-container__input"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="btn btn--lg"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;