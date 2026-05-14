import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import SummaryCards from '../components/SummaryCards';
import SpendingChart from '../components/SpendingChart';
import CategoryChart from '../components/CategoryChart';
import TransactionTable from '../components/TransactionTable';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions/');
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const flaggedCount = transactions.filter((t) => t.is_flagged).length;
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingLogo}>💹</div>
          <p style={styles.loadingText}>Loading your dashboard...</p>
          <div style={styles.loadingBar}>
            <div style={styles.loadingBarFill} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* BACKGROUND GLOW */}
      <div style={styles.glow} />

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoWrapper}>
            <span style={styles.logoIcon}>💹</span>
            <span style={styles.logoText}>FinSight</span>
          </div>
          <div style={styles.headerDivider} />
          <span style={styles.headerSubtitle}>Personal Finance Dashboard</span>
        </div>
        <div style={styles.headerRight}>
          {flaggedCount > 0 && (
            <div style={styles.alertPill}>
              ⚠ {flaggedCount} alert{flaggedCount > 1 ? 's' : ''}
            </div>
          )}
          <button style={styles.logoutButton} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>

      {/* GREETING */}
      <div style={styles.greeting}>
        <div>
          <h2 style={styles.greetingTitle}>
            Good {getTimeOfDay()}, Zablon 👋
          </h2>
          <p style={styles.greetingSubtitle}>
            Here's your financial overview
          </p>
        </div>
        <div style={styles.totalBalance}>
          <p style={styles.balanceLabel}>Total Spent</p>
          <p style={styles.balanceValue}>
            ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* AI INSIGHT BANNER */}
      {flaggedCount > 0 && (
        <div style={styles.insightBanner}>
          <span style={styles.insightIcon}>🤖</span>
          <div>
            <p style={styles.insightTitle}>AI Insight</p>
            <p style={styles.insightText}>
              Your Isolation Forest model detected {flaggedCount} suspicious transaction{flaggedCount > 1 ? 's' : ''} — 
              unusual amounts or late-night activity that deviates from your normal spending patterns.
            </p>
          </div>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <SummaryCards transactions={transactions} />

      {/* CHARTS */}
      <div style={styles.chartsGrid}>
        <SpendingChart transactions={transactions} />
        <CategoryChart transactions={transactions} />
      </div>

      {/* TRANSACTION TABLE */}
      <TransactionTable transactions={transactions} />

      {/* FOOTER */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Powered by Isolation Forest ML · FinSight v1.0
        </p>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0B0F14',
    padding: '24px 32px',
    maxWidth: '1280px',
    margin: '0 auto',
    position: 'relative',
  },
  glow: {
    position: 'fixed',
    width: '800px',
    height: '800px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)',
    top: '0',
    right: '0',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '36px',
    position: 'relative',
    zIndex: 1,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    fontSize: '22px',
  },
  logoText: {
    color: '#10B981',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  headerDivider: {
    width: '1px',
    height: '20px',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: '14px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  alertPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94A3B8',
    padding: '8px 18px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  greeting: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '32px',
    position: 'relative',
    zIndex: 1,
  },
  greetingTitle: {
    color: '#F8FAFC',
    fontSize: '26px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px',
  },
  greetingSubtitle: {
    color: '#94A3B8',
    fontSize: '14px',
    margin: '0',
  },
  totalBalance: {
    textAlign: 'right',
  },
  balanceLabel: {
    color: '#94A3B8',
    fontSize: '13px',
    margin: '0 0 4px 0',
  },
  balanceValue: {
    color: '#10B981',
    fontSize: '36px',
    fontWeight: '700',
    margin: '0',
    letterSpacing: '-1px',
  },
  insightBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    borderRadius: '16px',
    padding: '20px 24px',
    marginBottom: '28px',
    position: 'relative',
    zIndex: 1,
  },
  insightIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  insightTitle: {
    color: '#10B981',
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  insightText: {
    color: '#94A3B8',
    fontSize: '14px',
    margin: '0',
    lineHeight: '1.6',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    position: 'relative',
    zIndex: 1,
  },
  footer: {
    textAlign: 'center',
    padding: '32px 0 16px',
  },
  footerText: {
    color: '#334155',
    fontSize: '12px',
  },
  loadingScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B0F14',
  },
  loadingCard: {
    textAlign: 'center',
  },
  loadingLogo: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: '15px',
    marginBottom: '20px',
  },
  loadingBar: {
    width: '200px',
    height: '3px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: '2px',
    margin: '0 auto',
    overflow: 'hidden',
  },
  loadingBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: '2px',
  },
};