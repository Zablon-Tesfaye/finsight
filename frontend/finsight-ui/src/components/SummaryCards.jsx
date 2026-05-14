// ============================================
// SUMMARY CARDS
// Shows 3 key metrics at the top of the dashboard
// Total Spent, Flagged Transactions, Top Category
// ============================================
export default function SummaryCards({ transactions }) {
    // calculate total amount spent
    const totalSpent = transactions
      .reduce((sum, t) => sum + t.amount, 0)
      .toFixed(2);
  
    // count how many transactions were flagged
    const flaggedCount = transactions
      .filter((t) => t.is_flagged).length;
  
    // find the category with the most transactions
    const categoryCounts = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    const topCategory = Object.keys(categoryCounts).sort(
      (a, b) => categoryCounts[b] - categoryCounts[a]
    )[0] || 'N/A';
  
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.label}>Total Spent</p>
          <p style={styles.value}>${totalSpent}</p>
        </div>
        <div style={{...styles.card, ...styles.flaggedCard}}>
          <p style={styles.label}>Flagged Transactions</p>
          <p style={styles.value}>{flaggedCount}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.label}>Top Category</p>
          <p style={styles.value}>{topCategory}</p>
        </div>
      </div>
    );
  }
  
  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    card: {
      backgroundColor: '#1e293b',
      padding: '24px',
      borderRadius: '12px',
      borderLeft: '4px solid #38bdf8',
    },
    flaggedCard: {
      borderLeft: '4px solid #f87171',
    },
    label: {
      color: '#94a3b8',
      fontSize: '14px',
      margin: '0 0 8px 0',
    },
    value: {
      color: '#f1f5f9',
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '0',
    },
  };