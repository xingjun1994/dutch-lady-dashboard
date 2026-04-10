'use client';

const PRESETS = [
  { label: 'Full year', from: 0, to: 11 },
  { label: 'YTD Mar', from: 0, to: 2 },
  { label: 'YTD Jun', from: 0, to: 5 },
  { label: '1H', from: 0, to: 5 },
  { label: '2H', from: 6, to: 11 },
  { label: 'Q1', from: 0, to: 2 },
  { label: 'Q2', from: 3, to: 5 },
  { label: 'Q3', from: 6, to: 8 },
  { label: 'Q4', from: 9, to: 11 },
  { label: 'Custom', from: null, to: null },
];

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const YEARS = [2024, 2025, 2026];

export default function FilterBar({ year, fromMonth, toMonth, onYearChange, onPeriodChange }) {
  const activePreset = PRESETS.find(p => p.from === fromMonth && p.to === toMonth)?.label || 'Custom';

  function handlePreset(preset) {
    if (preset.label === 'Custom') return;
    onPeriodChange(preset.from, preset.to);
  }

  return (
    <div style={{
      background: '#fff',
      borderBottom: '0.5px solid #E2E8F5',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
    }}>
      {/* Year selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#9AA5C0', textTransform: 'uppercase', letterSpacing: 0.5 }}>Year</span>
        <div style={{ display: 'flex', border: '0.5px solid #E2E8F5', borderRadius: 6, overflow: 'hidden' }}>
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 500,
                border: 'none',
                borderRight: y !== 2026 ? '0.5px solid #E2E8F5' : 'none',
                background: year === y ? '#003DA5' : 'transparent',
                color: year === y ? '#fff' : '#6B7A99',
                cursor: 'pointer',
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '0.5px', height: 20, background: '#E2E8F5' }} />

      {/* Period presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#9AA5C0', textTransform: 'uppercase', letterSpacing: 0.5 }}>Period</span>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {PRESETS.filter(p => p.label !== 'Custom').map(preset => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset)}
              style={{
                padding: '4px 9px',
                fontSize: 10,
                fontWeight: 500,
                border: '0.5px solid',
                borderColor: activePreset === preset.label ? '#003DA5' : '#E2E8F5',
                borderRadius: 5,
                background: activePreset === preset.label ? '#003DA5' : '#fff',
                color: activePreset === preset.label ? '#fff' : '#6B7A99',
                cursor: 'pointer',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '0.5px', height: 20, background: '#E2E8F5' }} />

      {/* Custom range */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#9AA5C0', textTransform: 'uppercase', letterSpacing: 0.5 }}>Custom</span>
        <select
          value={fromMonth}
          onChange={e => onPeriodChange(parseInt(e.target.value), toMonth)}
          style={{
            fontSize: 10, padding: '4px 6px', border: '0.5px solid #E2E8F5',
            borderRadius: 5, color: '#4A5568', background: '#fff', cursor: 'pointer',
          }}
        >
          {MONTH_LABELS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <span style={{ fontSize: 10, color: '#9AA5C0' }}>to</span>
        <select
          value={toMonth}
          onChange={e => onPeriodChange(fromMonth, parseInt(e.target.value))}
          style={{
            fontSize: 10, padding: '4px 6px', border: '0.5px solid #E2E8F5',
            borderRadius: 5, color: '#4A5568', background: '#fff', cursor: 'pointer',
          }}
        >
          {MONTH_LABELS.map((m, i) => (
            <option key={m} value={i} disabled={i < fromMonth}>{m}</option>
          ))}
        </select>
      </div>

      {/* Active filter tag */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          padding: '3px 10px', borderRadius: 4,
          background: 'rgba(0,61,165,0.07)',
          fontSize: 10, fontWeight: 600, color: '#003DA5',
        }}>
          {MONTH_LABELS[fromMonth]} – {MONTH_LABELS[toMonth]} {year}
        </div>
      </div>
    </div>
  );
}