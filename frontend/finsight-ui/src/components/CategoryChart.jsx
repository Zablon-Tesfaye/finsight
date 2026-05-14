import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  
  // ============================================
  // CATEGORY CHART
  // Bar chart showing spending by category
  // ============================================
  export default function CategoryChart({ transactions }) {
    // group transactions by category and sum amounts
    const dataMap = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  
    // convert to array sorted by amount
    const data = Object.entries(dataMap)
      .map(([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => b.amount - a.amount);
  
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
            />
            <Bar dataKey="amount" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
  };