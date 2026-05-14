import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { email, password });
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Email may already be taken.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>💹</div>
          <h1 style={styles.logo}>FinSight</h1>
        </div>

        <p style={styles.subtitle}>
          Create your account to get started
        </p>

        {error && (
          <div style={styles.errorBox}>
            <span>⚠ {error}</span>
          </div>
        )}

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
            />
          </div>

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
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
    backgroundColor: '#0B0F14',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  card: {
    backgroundColor: 'rgba(22, 27, 34, 0.9)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '48px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logo: {
    color: '#10B981',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '36px',
    letterSpacing: '0.3px',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#EF4444',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#94A3B8',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#F8FAFC',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
  },
  button: {
    padding: '14px',
    backgroundColor: '#10B981',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    letterSpacing: '0.3px',
  },
  footer: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: '28px',
    fontSize: '14px',
  },
  link: {
    color: '#10B981',
    textDecoration: 'none',
    fontWeight: '500',
  },
};