import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import SummaryCards from '../components/SummaryCards';
import SpendingChart from '../components/SpendingChart';
import CategoryChart from '../components/CategoryChart';
import TransactionTable from '../components/TransactionTable';

// ============================================
// DASHBOARD PAGE
// Main page of the app — fetches transactions
// and passes them to all the components
// ============================================
export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ============================================
  // FETCH TRANSACTIONS
  // Runs once when the page loads
  // Gets all transactions for the logged in user
  // ============================================
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions/');
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        // if token is invalid, redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchTransactions();
  }, []);

  // ============================================
  // LOGOUT
  // Removes token and redirects to login
  // ============================================
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p style={{ color: '#94a3b8' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>FinSight</h1>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <SummaryCards transactions={transactions} />

      {/* CHARTS */}
      <div style={styles.chartsGrid}>
        <SpendingChart transactions={transactions} />
        <CategoryChart transactions={transactions} />
      </div>

      {/* TRANSACTION TABLE */}
      <TransactionTable transactions={transactions} />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    color: '#38bdf8',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
};