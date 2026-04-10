'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MONTHS } from '@/lib/data';

const COLORS = {
  'Digital': '#1A6FE0',
  'Offline': '#003DA5',
  'Ecomm / Socomm': '#00B67A',
};

function formatRM(val) {
  if (val >= 1000000) return `RM ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `RM ${(val / 1000).toFixed(0)}K`;
  return `RM ${Math.round(val)}`;
}

function buildMix(data, fromMonth, toMonth) {
  const months = MONTHS.slice(fromMonth, toMonth + 1);
  const totals = {};

  data.forEach(r => {
    const key = r.mediumType;
    if (!key) return;
    const spend = months.reduce((s, m) => s + (r[m] || 0), 0);
    totals[key] = (totals[key] || 0) + spend;
  });

  const total = Object.values(totals).reduce((s, v) => s + v, 0);

  return Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
      pct: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#fff', border: '0.5px solid #E2E8F5',
      borderRadius: 8, padding: '8px 12px', fontSize: 11,
    }}>
      <div style={{ fontWeight: 700, color: '#1A2340' }}>{d.name}</div>
      <div style={{ color: '#6B7A99' }}>{formatRM(d.value)} · {d.pct}%</div>
    </div>
  );
};

export default function DonutChart({ data, fromMonth, toMonth }) {
  const mix = buildMix(data, fromMonth, toMonth);
  const total = mix.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '0.5px solid #E2E8F5', padding: '18px 20px',
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#003DA5' }}>Budget Mix</div>
        <div style={{ fontSize: 11, color: '#9AA5C0', marginTop: 2 }}>By medium type</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mix}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={55}
                dataKey="value"
                strokeWidth={0}
              >
                {mix.map((entry, i) => (
                  <Cell key={i} fill={COLORS[entry.name] || '#9AA5C0'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 9, color: '#9AA5C0', fontWeight: 600 }}>RM</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#003DA5' }}>
              {(total / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {mix.map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 10, height: 10, borderRadius: 3, flexShrink: 0,
                background: COLORS[item.name] || '#9AA5C0',
              }} />
              <span style={{ fontSize: 11, color: '#4A5568', flex: 1 }}>{item.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1A2340' }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}