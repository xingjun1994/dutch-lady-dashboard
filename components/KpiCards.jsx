'use client';

const CARDS = [
  { key: 'total', label: 'Total Media Spend', color: '#003DA5' },
  { key: 'digital', label: 'Digital', color: '#FFD100' },
  { key: 'offline', label: 'Offline', color: '#00B67A' },
  { key: 'ecomm', label: 'Ecomm / Socomm', color: '#00AEEF' },
];

function formatRM(val) {
  if (val >= 1000000) return `RM ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `RM ${(val / 1000).toFixed(0)}K`;
  return `RM ${Math.round(val)}`;
}

function calcKpis(data, fromMonth, toMonth) {
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const periodMonths = months.slice(fromMonth, toMonth + 1);

  let total = 0, digital = 0, offline = 0, ecomm = 0;

  data.forEach(r => {
    const spend = periodMonths.reduce((s, m) => {
      const val = parseFloat(r[m]) || 0;
      return s + val;
    }, 0);
    total += spend;
    const mt = (r.mediumType || '').trim();
    if (mt === 'Digital') digital += spend;
    else if (mt === 'Offline') offline += spend;
    else if (mt === 'Ecomm / Socomm') ecomm += spend;
  });

  return { total, digital, offline, ecomm };
}

export default function KpiCards({ data, prevData, fromMonth, toMonth }) {
  const cur = calcKpis(data, fromMonth, toMonth);
  const prev = prevData ? calcKpis(prevData, fromMonth, toMonth) : null;

  const values = {
    total: cur.total,
    digital: cur.digital,
    offline: cur.offline,
    ecomm: cur.ecomm,
  };

  const prevValues = prev ? {
    total: prev.total,
    digital: prev.digital,
    offline: prev.offline,
    ecomm: prev.ecomm,
  } : null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14,
      marginBottom: 20,
    }}>
      {CARDS.map(card => {
        const val = values[card.key];
        const pval = prevValues?.[card.key];
        const delta = pval && pval > 0 ? ((val - pval) / pval) * 100 : null;
        const pct = cur.total > 0 && card.key !== 'total'
          ? Math.round((val / cur.total) * 100)
          : null;

        return (
          <div
            key={card.key}
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '0.5px solid #E2E8F5',
              padding: '16px 18px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
              background: card.color,
            }} />
            <div style={{ fontSize: 10, fontWeight: 600, color: '#9AA5C0', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A2340', lineHeight: 1, marginBottom: 8 }}>
              {formatRM(val)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {delta !== null && (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  padding: '2px 7px', borderRadius: 20,
                  background: delta >= 0 ? 'rgba(0,182,122,0.1)' : 'rgba(232,51,74,0.1)',
                  color: delta >= 0 ? '#00B67A' : '#E8334A',
                }}>
                  {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
                </span>
              )}
              {pct !== null && (
                <span style={{ fontSize: 10, color: '#9AA5C0' }}>{pct}% of total</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}