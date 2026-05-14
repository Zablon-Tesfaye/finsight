import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  
  export default function SpendingChart({ transactions }) {
    const dataMap = transactions.reduce((acc, t) => {
      const date = t.date.split(' ')[0];
      acc[date] = (acc[date] || 0) + t.amount;
      return acc;
    }, {});
  
    const data = Object.entries(dataMap)
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div style={styles.tooltip}>
            <p style={styles.tooltipDate}>{label}</p>
            <p style={styles.tooltipValue}>
              ${payload[0].value.toLocaleString()}
            </p>
          </div>
        );
      }
      return null;
    };
  
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Spending Over Time</h3>
          <span style={styles.badge}>2024</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              stroke="#334155"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              interval="preserveStartEnd"
              tickLine={false}
            />
            <YAxis
              stroke="#334155"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorAmount)"
              dot={false}
              activeDot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
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
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      color: '#F8FAFC',
      fontSize: '15px',
      fontWeight: '600',
      margin: '0',
      letterSpacing: '-0.3px',
    },
    badge: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10B981',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
    },
    tooltip: {
      backgroundColor: '#161B22',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      padding: '10px 14px',
    },
    tooltipDate: {
      color: '#94A3B8',
      fontSize: '12px',
      margin: '0 0 4px 0',
    },
    tooltipValue: {
      color: '#10B981',
      fontSize: '16px',
      fontWeight: '700',
      margin: '0',
    },
  };