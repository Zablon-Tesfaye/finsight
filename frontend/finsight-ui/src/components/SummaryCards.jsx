export default function SummaryCards({ transactions }) {
    const totalSpent = transactions
      .reduce((sum, t) => sum + t.amount, 0)
      .toFixed(2);
  
    const flaggedCount = transactions.filter((t) => t.is_flagged).length;
  
    const categoryCounts = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    const topCategory = Object.keys(categoryCounts).sort(
      (a, b) => categoryCounts[b] - categoryCounts[a]
    )[0] || 'N/A';
  
    const cards = [
      {
        label: 'Total Spent',
        value: `$${Number(totalSpent).toLocaleString()}`,
        icon: '💰',
        accent: '#10B981',
        sub: 'All transactions',
      },
      {
        label: 'Flagged Transactions',
        value: flaggedCount,
        icon: '⚠️',
        accent: '#EF4444',
        sub: flaggedCount > 0 ? 'Requires attention' : 'All clear',
      },
      {
        label: 'Top Category',
        value: topCategory,
        icon: '📊',
        accent: '#6366F1',
        sub: 'Most transactions',
      },
    ];
  
    return (
      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.label} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.icon}>{card.icon}</span>
              <span style={{ ...styles.accent, color: card.accent }}>
                {card.sub}
              </span>
            </div>
            <p style={styles.label}>{card.label}</p>
            <p style={{ ...styles.value, color: card.accent }}>
              {card.value}
            </p>
            <div style={{
              ...styles.accentBar,
              backgroundColor: card.accent
            }} />
          </div>
        ))}
      </div>
    );
  }
  
  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '28px',
    },
    card: {
      backgroundColor: 'rgba(22, 27, 34, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '20px',
      padding: '28px',
      position: 'relative',
      overflow: 'hidden',
    },
    cardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    icon: {
      fontSize: '24px',
    },
    accent: {
      fontSize: '12px',
      fontWeight: '500',
    },
    label: {
      color: '#94A3B8',
      fontSize: '13px',
      fontWeight: '500',
      marginBottom: '8px',
      letterSpacing: '0.3px',
    },
    value: {
      fontSize: '32px',
      fontWeight: '700',
      letterSpacing: '-1px',
      margin: '0',
    },
    accentBar: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '3px',
      opacity: 0.6,
    },
  };