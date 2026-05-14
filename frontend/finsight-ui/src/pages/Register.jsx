import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

// ============================================
// REGISTER PAGE
// Handles new user registration
// ============================================
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      // create the account
      await api.post('/auth/register', { email, password });
      
      // immediately log them in after registering
      const response = await api.post('/auth/login', { email, password });
      
      // store token and redirect
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Email may already be taken.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>FinSight</h1>
        <p style={styles.subtitle}>Create your account</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button style={styles.button} onClick={handleSubmit}>
            Create Account
          </button>
        </div>

        <p style={styles.link}>
          Already have an account?{' '}
          <Link to="/login" style={styles.linkText}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#38bdf8',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: '16px',
  },
  link: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
  },
  linkText: {
    color: '#38bdf8',
    textDecoration: 'none',
  },
};