import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  
  // ============================================
  // SPENDING CHART
  // Line chart showing spending over time
  // Takes transactions as a prop and groups
  // them by date to show the trend
  // ============================================
  export default function SpendingChart({ transactions }) {
    // group transactions by date and sum amounts
    const dataMap = transactions.reduce((acc, t) => {
      const date = t.date.split(' ')[0]; // get just the date part
      acc[date] = (acc[date] || 0) + t.amount;
      return acc;
    }, {});
  
    // convert to array and sort by date
    const data = Object.entries(dataMap)
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Spending Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
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