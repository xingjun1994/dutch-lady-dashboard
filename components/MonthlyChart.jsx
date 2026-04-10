'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';
import { MONTHS, MONTH_LABELS } from '@/lib/data';

function formatRM(val) {
  if (val >= 1000000) return `RM ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `RM ${(val / 1000).toFixed(0)}K`;
  return `RM ${Math.round(val)}`;
}

function buildTrend(data, prevData, fromMonth, toMonth) {
  return MONTHS.map((m, i) => {
    const cur = data.reduce((s, r) => s + (r[m] || 0), 0);
    const prev = prevData ? prevData.reduce((s, r) => s + (r[m] || 0), 0) : 0;
    return {
      month: MONTH_LABELS[i],
      current: Math.round(cur),
      previous: Math.round(prev),
      inRange: i >= fromMonth && i <= toMonth,
    };
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '0.5px solid #E2E8F5',
      borderRadius: 8, padding: '10px 14px', fontSize: 11,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: '#1A2340' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {formatRM(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function MonthlyChart({ data, prevData, fromMonth, toMonth, year }) {
  const trend = buildTrend(data, prevData, fromMonth, toMonth);

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '0.5px solid #E2E8F5', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#003DA5' }}>Monthly Spend Trend</div>
          <div style={{ fontSize: 11, color: '#9AA5C0', marginTop: 2 }}>Net media (RM) · {year} vs {year - 1}</div>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 600, padding: '3px 9px',
          borderRadius: 20, background: '#EBF1FB', color: '#003DA5',
        }}>
          YoY
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={trend} barCategoryGap="25%" barGap={2}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#9AA5C0' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => `${(v/1000000).toFixed(1)}M`}
            tick={{ fontSize: 10, fill: '#9AA5C0' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value) => value === 'current' ? `${year}` : `${year - 1}`}
          />
          <Bar dataKey="previous" name="previous" radius={[3, 3, 0, 0]}>
            {trend.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.inRange ? '#B5D4F4' : '#E8EDF8'}
              />
            ))}
          </Bar>
          <Bar dataKey="current" name="current" radius={[3, 3, 0, 0]}>
            {trend.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.inRange ? '#003DA5' : '#C8D8F0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}