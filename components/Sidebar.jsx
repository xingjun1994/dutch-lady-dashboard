'use client';

import { useState } from 'react';

const BRANDS = [
  {
    id: 'dutch-lady-taf',
    name: 'Dutch Lady TAF',
    color: '#003DA5',
    dataName: 'Dutch Lady TAF',
    subBrands: ['Morning Nutrition', 'Flavoured Milk', 'Juicy Milk', 'Chilled', 'UHT', 'Pasteurized'],
  },
  {
    id: 'dl-ift-kids',
    name: 'DL IFT & Kids',
    color: '#00B67A',
    dataName: 'Dutch Lady IFT & Kids',
    subBrands: ['Core', 'Maxgro', 'F4K', 'Omega'],
  },
  {
    id: 'friso',
    name: 'Friso',
    color: '#E8B800',
    dataName: 'Friso',
    subBrands: [],
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  const [expanded, setExpanded] = useState(null);

  function handleBrandClick(brand) {
    if (brand.subBrands.length === 0) {
      onNavigate({ type: 'brand', brand: brand.dataName, subBrand: null });
      setExpanded(brand.id);
    } else {
      setExpanded(expanded === brand.id ? null : brand.id);
    }
  }

  function handleSubBrandClick(brand, subBrand) {
    onNavigate({ type: 'brand', brand: brand.dataName, subBrand });
  }

  function handleAllSubBrands(brand) {
    onNavigate({ type: 'brand', brand: brand.dataName, subBrand: null });
  }

  const isActive = (type, extra = {}) => {
    if (!activePage) return false;
    if (activePage.type !== type) return false;
    if (extra.brand && activePage.brand !== extra.brand) return false;
    if (extra.subBrand !== undefined && activePage.subBrand !== extra.subBrand) return false;
    if (extra.analysis && activePage.analysis !== extra.analysis) return false;
    return true;
  };

  return (
    <div style={{
      width: 200,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '0.5px solid #E2E8F5',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 14px 14px', borderBottom: '0.5px solid #E2E8F5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, background: '#003DA5', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#FFD100', flexShrink: 0,
          }}>DL</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#003DA5' }}>Dutch Lady</div>
            <div style={{ fontSize: 10, color: '#6B7A99' }}>Media Hub</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {/* Overview */}
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#9AA5C0', padding: '8px 8px 4px' }}>Overview</div>
        <NavItem
          label="Dashboard"
          icon="⊞"
          active={isActive('overview')}
          onClick={() => onNavigate({ type: 'overview' })}
        />

        {/* Brands */}
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#9AA5C0', padding: '12px 8px 4px' }}>Brands</div>
        {BRANDS.map(brand => (
          <div key={brand.id}>
            <div
              onClick={() => handleBrandClick(brand)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 8px', borderRadius: 7, cursor: 'pointer',
                background: isActive('brand', { brand: brand.dataName }) ? '#EBF1FB' : 'transparent',
                color: isActive('brand', { brand: brand.dataName }) ? '#003DA5' : '#4A5568',
                fontSize: 11, fontWeight: isActive('brand', { brand: brand.dataName }) ? 600 : 400,
                marginBottom: 1,
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: brand.color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{brand.name}</span>
              {brand.subBrands.length > 0 && (
                <span style={{ fontSize: 9, color: '#9AA5C0' }}>{expanded === brand.id ? '▾' : '▸'}</span>
              )}
            </div>

            {expanded === brand.id && brand.subBrands.length > 0 && (
              <div style={{ marginLeft: 8 }}>
                <SubNavItem
                  label="All sub-brands"
                  active={isActive('brand', { brand: brand.dataName, subBrand: null })}
                  onClick={() => handleAllSubBrands(brand)}
                  color={brand.color}
                />
                {brand.subBrands.map(sub => (
                  <SubNavItem
                    key={sub}
                    label={sub}
                    active={isActive('brand', { brand: brand.dataName, subBrand: sub })}
                    onClick={() => handleSubBrandClick(brand, sub)}
                    color={brand.color}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Analysis */}
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#9AA5C0', padding: '12px 8px 4px' }}>Analysis</div>
        <NavItem label="Medium Type" icon="≡" active={isActive('analysis', { analysis: 'medium' })} onClick={() => onNavigate({ type: 'analysis', analysis: 'medium' })} />
        <NavItem label="Broad Channel" icon="◫" active={isActive('analysis', { analysis: 'channel' })} onClick={() => onNavigate({ type: 'analysis', analysis: 'channel' })} />
        <NavItem label="Media Owner" icon="◎" active={isActive('analysis', { analysis: 'owner' })} onClick={() => onNavigate({ type: 'analysis', analysis: 'owner' })} />

        {/* Tools */}
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#9AA5C0', padding: '12px 8px 4px' }}>Tools</div>
        <NavItem label="Export" icon="⬇" active={false} onClick={() => {}} />
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '0.5px solid #E2E8F5', fontSize: 10, color: '#9AA5C0' }}>
        Last updated: live
      </div>
    </div>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px', borderRadius: 7, cursor: 'pointer',
        background: active ? '#EBF1FB' : 'transparent',
        color: active ? '#003DA5' : '#4A5568',
        fontSize: 11, fontWeight: active ? 600 : 400,
        marginBottom: 1,
      }}
    >
      <span style={{ fontSize: 12, width: 14, textAlign: 'center' }}>{icon}</span>
      {label}
    </div>
  );
}

function SubNavItem({ label, active, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
        background: active ? '#EBF1FB' : 'transparent',
        color: active ? color : '#6B7A99',
        fontSize: 10, fontWeight: active ? 600 : 400,
        marginBottom: 1,
      }}
    >
      <div style={{ width: 3, height: 3, borderRadius: '50%', background: active ? color : '#CBD5E0', flexShrink: 0 }} />
      {label}
    </div>
  );
}