import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import PageHero from '../components/PageHero';

const Auth = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      onAuthChange(user);
      if (user) {
        console.log('User logged in, should redirect:', user);
      }
    });
    return unsubscribe;
  }, [onAuthChange]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <>
      <PageHero
        title={isSignUp ? 'Sign Up for PATHWAY' : 'Login to PATHWAY'}
        subtitle={
          isSignUp
            ? 'Create an account to access the Sustainability Checker.'
            : 'Sign in to access the Sustainability Checker and your personalized action plan.'
        }
      />
      <main className="auth-container">
        <section className="page-section page-section--white">
          <div className="page-section__inner container flex justify-center">
            <div className="card col-6">
              <h2 className="section-heading font-ubuntu text-2xl mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
              {error && <p className="auth-container__error text-red-500 mb-4">{error}</p>}
              <button
                onClick={handleGoogleLogin}
                className="a11y-button btn--lg mb-4 w-full"
              >
                Continue with Google
              </button>
              <form onSubmit={handleEmailSubmit} className="auth-container__form mt-6 flex flex-col gap-4">
                <div className="auth-container__field">
                  <label className="auth-container__label font-open-sans font-bold">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                    required
                  />
                </div>
                <div className="auth-container__field">
                  <label className="auth-container__label font-open-sans font-bold">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="a11y-button btn--lg"
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
              </form>
              <div className="auth-container__toggle mt-4 text-center">
                <p className="font-open-sans">
                  {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="a11y-button"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Auth;