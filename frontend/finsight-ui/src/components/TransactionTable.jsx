export default function TransactionTable({ transactions }) {
    const flaggedCount = transactions.filter((t) => t.is_flagged).length;
  
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>All Transactions</h3>
            <p style={styles.subtitle}>{transactions.length} total transactions</p>
          </div>
          {flaggedCount > 0 && (
            <div style={styles.alertBadge}>
              ⚠ {flaggedCount} suspicious transaction{flaggedCount > 1 ? 's' : ''} detected
            </div>
          )}
        </div>
  
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Merchant</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  style={t.is_flagged ? styles.flaggedRow : styles.row}
                >
                  <td style={styles.td}>
                    <span style={styles.date}>{t.date.split(' ')[0]}</span>
                    <span style={styles.time}>{t.date.split(' ')[1]}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.merchant}>{t.merchant}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>{t.category}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.amount,
                      color: t.is_flagged ? '#EF4444' : '#F8FAFC'
                    }}>
                      ${t.amount.toFixed(2)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {t.is_flagged ? (
                      <span style={styles.flaggedBadge}>⚠ Flagged</span>
                    ) : (
                      <span style={styles.normalBadge}>✓ Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  const styles = {
    container: {
      backgroundColor: 'rgba(22, 27, 34, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '28px',
      borderRadius: '20px',
      marginBottom: '24px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px',
    },
    title: {
      color: '#F8FAFC',
      fontSize: '15px',
      fontWeight: '600',
      margin: '0 0 4px 0',
      letterSpacing: '-0.3px',
    },
    subtitle: {
      color: '#94A3B8',
      fontSize: '13px',
      margin: '0',
    },
    alertBadge: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      color: '#EF4444',
      padding: '8px 14px',
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '500',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      color: '#94A3B8',
      fontSize: '12px',
      fontWeight: '600',
      textAlign: 'left',
      padding: '10px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      verticalAlign: 'middle',
    },
    row: {
      transition: 'background-color 0.15s',
    },
    flaggedRow: {
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      borderLeft: '3px solid #EF4444',
    },
    date: {
      color: '#F8FAFC',
      fontSize: '14px',
      display: 'block',
    },
    time: {
      color: '#94A3B8',
      fontSize: '12px',
      display: 'block',
      marginTop: '2px',
    },
    merchant: {
      color: '#F8FAFC',
      fontSize: '14px',
      fontWeight: '500',
    },
    categoryBadge: {
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      color: '#818CF8',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
    },
    amount: {
      fontSize: '14px',
      fontWeight: '600',
    },
    flaggedBadge: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#EF4444',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    normalBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10B981',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    },
  };