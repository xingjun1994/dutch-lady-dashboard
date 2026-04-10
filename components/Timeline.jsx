'use client';

import { useState } from 'react';
import { MONTHS, MONTH_LABELS } from '@/lib/data';

const MEDIUM_COLORS = {
  'Digital': '#1A6FE0',
  'Offline': '#003DA5',
  'Ecomm / Socomm': '#00B67A',
};

function buildTimeline(data, fromMonth, toMonth) {
  const sections = {};

  data.forEach(r => {
    const medium = r.mediumType || 'Other';
    const channel = r.channel || 'Unknown';
    if (!sections[medium]) sections[medium] = {};
    if (!sections[medium][channel]) {
      sections[medium][channel] = { months: Array(12).fill(0) };
    }
    MONTHS.forEach((m, i) => {
      sections[medium][channel].months[i] += r[m] || 0;
    });
  });

  return Object.entries(sections).map(([medium, channels]) => ({
    medium,
    color: MEDIUM_COLORS[medium] || '#9AA5C0',
    channels: Object.entries(channels)
      .map(([channel, val]) => ({ channel, months: val.months }))
      .filter(c => c.months.some(v => v > 0))
      .sort((a, b) => b.months.reduce((s, v) => s + v, 0) - a.months.reduce((s, v) => s + v, 0)),
  }));
}

function formatRM(val) {
  if (val >= 1000000) return `RM ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `RM ${(val / 1000).toFixed(0)}K`;
  return `RM ${Math.round(val)}`;
}

export default function Timeline({ data, fromMonth, toMonth }) {
  const [tooltip, setTooltip] = useState(null);
  const sections = buildTimeline(data, fromMonth, toMonth);

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '0.5px solid #E2E8F5', overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px 12px', borderBottom: '0.5px solid #E2E8F5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#003DA5' }}>Media Flowchart</div>
          <div style={{ fontSize: 11, color: '#9AA5C0', marginTop: 2 }}>Channel flights · hover blocks for spend</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(MEDIUM_COLORS).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6B7A99' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: v }} />
              {k}
            </div>
          ))}
        </div>
      </div>

      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '130px repeat(12, 1fr)',
        background: '#F4F7FD',
        borderBottom: '0.5px solid #E2E8F5',
        padding: '0 16px',
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#003DA5', textTransform: 'uppercase', padding: '6px 0' }}>Channel</div>
        {MONTH_LABELS.map((m, i) => (
          <div key={m} style={{
            fontSize: 9, fontWeight: 600, color: '#9AA5C0',
            textAlign: 'center', padding: '6px 2px',
            background: i >= fromMonth && i <= toMonth ? 'rgba(0,61,165,0.05)' : 'transparent',
            borderRadius: 3,
          }}>
            {m}
          </div>
        ))}
      </div>

      {/* Sections */}
      {sections.map(section => (
        <div key={section.medium}>
          {/* Section header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '130px repeat(12, 1fr)',
            padding: '4px 16px',
            background: '#F9FAFB',
            borderBottom: '0.5px solid #E2E8F5',
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: 0.5, color: section.color, padding: '2px 0',
            }}>
              {section.medium}
            </div>
          </div>

          {/* Channel rows */}
          {section.channels.map(ch => (
            <div
              key={ch.channel}
              style={{
                display: 'grid',
                gridTemplateColumns: '130px repeat(12, 1fr)',
                padding: '3px 16px',
                borderBottom: '0.5px solid #F0F4FC',
                alignItems: 'center',
              }}
            >
              <div style={{
                fontSize: 10, fontWeight: 500, color: '#4A5568',
                display: 'flex', alignItems: 'center', gap: 5,
                paddingRight: 8, overflow: 'hidden',
              }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: section.color, flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.channel}</span>
              </div>

              {ch.months.map((spend, i) => {
                const inRange = i >= fromMonth && i <= toMonth;
                const hasSpend = spend > 0;
                return (
                  <div key={i} style={{ padding: '3px 2px', position: 'relative' }}>
                    {hasSpend && (
                      <div
                        onMouseEnter={e => setTooltip({
                          x: e.clientX, y: e.clientY,
                          text: `${ch.channel} · ${MONTH_LABELS[i]}: ${formatRM(spend)}`,
                        })}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          height: 12,
                          borderRadius: 3,
                          background: section.color,
                          opacity: inRange ? 1 : 0.2,
                          cursor: 'pointer',
                          transition: 'opacity 0.15s',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 12,
          top: tooltip.y - 32,
          background: '#1A2340',
          color: '#fff',
          fontSize: 11,
          fontWeight: 500,
          padding: '5px 10px',
          borderRadius: 6,
          pointerEvents: 'none',
          zIndex: 9999,
          whiteSpace: 'nowrap',
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}