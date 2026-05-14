import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
  } from 'recharts';
  
  export default function CategoryChart({ transactions }) {
    const dataMap = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  
    const data = Object.entries(dataMap)
      .map(([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => b.amount - a.amount);
  
    const colors = [
      '#10B981',
      '#6366F1',
      '#38BDF8',
      '#F59E0B',
      '#EC4899',
      '#8B5CF6',
    ];
  
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div style={styles.tooltip}>
            <p style={styles.tooltipLabel}>{label}</p>
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
          <h3 style={styles.title}>Spending by Category</h3>
          <span style={styles.badge}>{data.length} categories</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barSize={32}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="category"
              stroke="#334155"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#334155"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
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
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      color: '#6366F1',
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
    tooltipLabel: {
      color: '#94A3B8',
      fontSize: '12px',
      margin: '0 0 4px 0',
    },
    tooltipValue: {
      color: '#F8FAFC',
      fontSize: '16px',
      fontWeight: '700',
      margin: '0',
    },
  };