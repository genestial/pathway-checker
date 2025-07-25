import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
    <div className="min-h-screen bg-pathway-light flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-pathway-primary mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-pathway-dark mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-pathway-secondary rounded"
              required
            />
          </div>
          <div>
            <label className="block text-pathway-dark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-pathway-secondary rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pathway-primary text-white p-2 rounded hover:bg-pathway-dark transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;