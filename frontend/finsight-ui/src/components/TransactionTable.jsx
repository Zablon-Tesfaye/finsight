// ============================================
// TRANSACTION TABLE
// Shows all transactions in a table
// Flagged transactions are highlighted in red
// ============================================
export default function TransactionTable({ transactions }) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>All Transactions</h3>
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
                  style={t.is_flagged ? styles.flaggedRow : styles.normalRow}
                >
                  <td style={styles.td}>{t.date}</td>
                  <td style={styles.td}>{t.merchant}</td>
                  <td style={styles.td}>{t.category}</td>
                  <td style={styles.td}>${t.amount.toFixed(2)}</td>
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
      backgroundColor: '#1e293b',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '24px',
    },
    title: {
      color: '#f1f5f9',
      fontSize: '16px',
      fontWeight: '600',
      margin: '0 0 16px 0',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      color: '#94a3b8',
      fontSize: '13px',
      fontWeight: '600',
      textAlign: 'left',
      padding: '12px 16px',
      borderBottom: '1px solid #334155',
    },
    td: {
      color: '#f1f5f9',
      fontSize: '14px',
      padding: '12px 16px',
      borderBottom: '1px solid #1e293b',
    },
    normalRow: {
      backgroundColor: 'transparent',
    },
    flaggedRow: {
      backgroundColor: 'rgba(248, 113, 113, 0.1)',
    },
    flaggedBadge: {
      backgroundColor: 'rgba(248, 113, 113, 0.2)',
      color: '#f87171',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
    },
    normalBadge: {
      backgroundColor: 'rgba(56, 189, 248, 0.2)',
      color: '#38bdf8',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
    },
  }; 