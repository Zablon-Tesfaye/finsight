import { useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, ArrowUpRight, ShieldCheck, Wallet } from 'lucide-react';
import api from './api';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health'];
const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'register') await api.post('/auth/register', { email, password });
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('finsight_token', data.access_token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to sign in. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return <main className="login-page"><form className="auth-card" onSubmit={submit}>
    <div className="brand"><ShieldCheck size={28} /> FinSight</div>
    <h1>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1>
    <p>Understand your spending. Catch unusual transactions.</p>
    <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
    <label>Password<input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" /></label>
    {error && <div className="error">{error}</div>}
    <button disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Register'}</button>
    <button type="button" className="text-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
      {mode === 'login' ? 'Need an account? Register' : 'Already registered? Sign in'}
    </button>
  </form></main>;
}

function TransactionForm({ onSaved }) {
  const [form, setForm] = useState({ merchant: '', amount: '', category: 'Food', date: new Date().toISOString().slice(0, 16) });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/transactions/', { ...form, amount: Number(form.amount), date: new Date(form.date).toISOString() });
      setForm(previous => ({ ...previous, merchant: '', amount: '' }));
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to add transaction.');
    } finally {
      setBusy(false);
    }
  }
  return <form className="panel transaction-form" onSubmit={submit}>
    <h2>Add transaction</h2>
    <div className="form-grid">
      <label>Merchant<input required maxLength={120} value={form.merchant} onChange={e => setForm({ ...form, merchant: e.target.value })} placeholder="Coffee shop" /></label>
      <label>Amount<input type="number" required min="0.01" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="24.50" /></label>
      <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></label>
      <label>Date<input type="datetime-local" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
    </div>
    {error && <div className="error">{error}</div>}
    <button disabled={busy}>{busy ? 'Analyzing...' : 'Add and analyze'}</button>
  </form>;
}

function Dashboard({ onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  async function refresh() {
    try {
      const { data } = await api.get('/transactions/');
      setTransactions(data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) return onLogout();
      setError('Could not load transactions. Is the API running?');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  const summary = useMemo(() => {
    const total = transactions.reduce((sum, item) => sum + item.amount, 0);
    const flagged = transactions.filter(item => item.is_flagged);
    const byDay = new Map();
    for (const item of transactions) {
      const day = item.date.slice(0, 10);
      byDay.set(day, (byDay.get(day) || 0) + item.amount);
    }
    const chart = [...byDay].sort(([a], [b]) => a.localeCompare(b)).map(([date, amount]) => ({ date: date.slice(5), amount: Math.round(amount * 100) / 100 }));
    return { total, flagged, chart };
  }, [transactions]);

  return <div className="shell">
    <aside className="sidebar"><div className="brand"><ShieldCheck size={26} /> FinSight</div><div className="nav-active"><Activity size={18} /> Overview</div><div className="sidebar-bottom">ML-powered finance insights</div></aside>
    <main className="content">
      <header><div><div className="eyebrow">FINANCIAL OVERVIEW</div><h1>Your dashboard</h1><p>Review your spending and suspicious activity.</p></div><button className="outline" onClick={onLogout}>Sign out</button></header>
      <section className="stats">
        <div className="stat"><div className="stat-label"><Wallet size={19}/> Total spending</div><strong>{money(summary.total)}</strong><small>Across {transactions.length} transactions</small></div>
        <div className="stat"><div className="stat-label"><AlertTriangle size={19}/> Flagged transactions</div><strong>{summary.flagged.length}</strong><small>Worth {money(summary.flagged.reduce((sum, item) => sum + item.amount, 0))}</small></div>
        <div className="stat"><div className="stat-label"><ShieldCheck size={19}/> Cleared transactions</div><strong>{transactions.length - summary.flagged.length}</strong><small>Not flagged by the model</small></div>
      </section>
      {error && <div className="error">{error}</div>}
      <div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><h2>Spending over time</h2><ArrowUpRight size={20}/></div>
        {summary.chart.length ? <ResponsiveContainer width="100%" height={260}><AreaChart data={summary.chart}><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5b82f8" stopOpacity={0.25}/><stop offset="100%" stopColor="#5b82f8" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e9edf4"/><XAxis dataKey="date" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip formatter={value => money(value)}/><Area type="monotone" dataKey="amount" stroke="#5b82f8" fill="url(#fill)" strokeWidth={2}/></AreaChart></ResponsiveContainer> : <div className="empty">Add a transaction to see your spending trends.</div>}
      </section><TransactionForm onSaved={refresh}/></div>
      <section className="panel"><div className="panel-heading"><h2>Recent transactions</h2><span>{transactions.length} total</span></div>
        {loading ? <p>Loading transactions...</p> : transactions.length === 0 ? <div className="empty">No transactions yet. Add your first one above.</div> : <div className="table-scroll"><table><thead><tr><th>Merchant</th><th>Category</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>{transactions.map(item => <tr key={item.id}><td className="merchant">{item.merchant}</td><td>{item.category}</td><td>{new Date(item.date).toLocaleDateString()}</td><td>{money(item.amount)}</td><td><span className={item.is_flagged ? 'flag flagged' : 'flag clear'}>{item.is_flagged ? 'Suspicious' : 'Normal'}</span></td></tr>)}</tbody></table></div>}
      </section>
    </main>
  </div>;
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem('finsight_token')));
  function logout() { localStorage.removeItem('finsight_token'); setAuthenticated(false); }
  return authenticated ? <Dashboard onLogout={logout}/> : <Login onLogin={() => setAuthenticated(true)}/>;
}
