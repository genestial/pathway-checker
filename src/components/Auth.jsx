import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

const Auth = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      onAuthChange(user);
      if (user) {
        // Optionally log to debug
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-container__title">Please Log In</h2>
      <button onClick={handleGoogleLogin} className="a11y-button bg-pathway-primary text-white mt-4 px-6 py-3 rounded-[2rem]">
        Continue with Google
      </button>
      <form onSubmit={handleEmailLogin} className="mt-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
        />
        <button type="submit" className="a11y-button bg-pathway-primary text-white px-6 py-3 rounded-[2rem]">
          Log In with Email
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Auth;