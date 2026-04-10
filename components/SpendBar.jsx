'use client';

import { MONTHS } from '@/lib/data';

function formatRM(val) {
  if (val >= 1000000) return `RM ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `RM ${(val / 1000).toFixed(0)}K`;
  return `RM ${Math.round(val)}`;
}

function buildSpend(data, prevData, groupKey, fromMonth, toMonth, color) {
  const months = MONTHS.slice(fromMonth, toMonth + 1);
  const cur = {};
  const prev = {};

  data.forEach(r => {
    const k = r[groupKey];
    if (!k) return;
    const spend = months.reduce((s, m) => s + (r[m] || 0), 0);
    cur[k] = (cur[k] || 0) + spend;
  });

  if (prevData) {
    prevData.forEach(r => {
      const k = r[groupKey];
      if (!k) return;
      const spend = months.reduce((s, m) => s + (r[m] || 0), 0);
      prev[k] = (prev[k] || 0) + spend;
    });
  }

  return Object.entries(cur)
    .map(([name, value]) => {
      const prevVal = prev[name] || 0;
      const delta = prevVal > 0 ? ((value - prevVal) / prevVal) * 100 : null;
      return { name, value: Math.round(value), prevValue: Math.round(prevVal), delta };
    })
    .sort((a, b) => b.value - a.value);
}

export default function SpendBar({ data, prevData, groupKey, title, subtitle, fromMonth, toMonth, colorMap }) {
  const items = buildSpend(data, prevData, groupKey, fromMonth, toMonth, colorMap);
  const max = items[0]?.value || 1;

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '0.5px solid #E2E8F5', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#003DA5' }}>{title}</div>
          <div style={{ fontSize: 11, color: '#9AA5C0', marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 600, padding: '3px 9px',
          borderRadius: 20, background: '#EBF1FB', color: '#003DA5',
        }}>YoY</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.slice(0, 10).map(item => {
          const color = colorMap?.[item.name] || '#003DA5';
          const barWidth = Math.round((item.value / max) * 100);
          return (
            <div key={item.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color }}>{item.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#1A2340' }}>{formatRM(item.value)}</span>
                  {item.delta !== null && (
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      padding: '2px 6px', borderRadius: 4,
                      background: item.delta >= 0 ? 'rgba(0,182,122,0.1)' : 'rgba(232,51,74,0.1)',
                      color: item.delta >= 0 ? '#00B67A' : '#E8334A',
                    }}>
                      {item.delta >= 0 ? '▲' : '▼'}{Math.abs(item.delta).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div style={{ height: 6, background: '#F0F4FC', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${barWidth}%`,
                  background: color, borderRadius: 4,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}