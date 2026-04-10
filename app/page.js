'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterBar from '@/components/FilterBar';
import KpiCards from '@/components/KpiCards';
import MonthlyChart from '@/components/MonthlyChart';
import DonutChart from '@/components/DonutChart';
import Timeline from '@/components/Timeline';
import SpendBar from '@/components/SpendBar';

const BRAND_COLORS = {
  'Dutch Lady TAF': '#003DA5',
  'Dutch Lady IFT & Kids': '#00B67A',
  'Friso': '#E8B800',
};

const MEDIUM_COLORS = {
  'Digital': '#1A6FE0',
  'Offline': '#003DA5',
  'Ecomm / Socomm': '#00B67A',
};

export default function Home() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState({ type: 'overview' });
  const [year, setYear] = useState(2026);
  const [fromMonth, setFromMonth] = useState(0);
  const [toMonth, setToMonth] = useState(11);

  useEffect(() => {
    fetch('/api/sheets')
      .then(r => r.json())
      .then(d => {
        if (d.success) setAllData(d.data);
        else setError(d.error);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  function handlePeriodChange(from, to) {
    setFromMonth(from);
    setToMonth(to);
  }

  const curData = allData.filter(r => r.year === year);
  const prevData = allData.filter(r => r.year === year - 1);

  function getPageData() {
    if (activePage.type === 'overview') return { cur: curData, prev: prevData };
    if (activePage.type === 'brand') {
      let cur = curData.filter(r => r.brand === activePage.brand);
      let prev = prevData.filter(r => r.brand === activePage.brand);
      if (activePage.subBrand) {
        cur = cur.filter(r => r.subBrand === activePage.subBrand);
        prev = prev.filter(r => r.subBrand === activePage.subBrand);
      }
      return { cur, prev };
    }
    if (activePage.type === 'analysis') return { cur: curData, prev: prevData };
    return { cur: curData, prev: prevData };
  }

  const { cur, prev } = getPageData();

  function getPageTitle() {
    if (activePage.type === 'overview') return { title: 'Overview Dashboard', sub: 'All brands · Dutch Lady Malaysia' };
    if (activePage.type === 'brand') {
      const sub = activePage.subBrand ? ` — ${activePage.subBrand}` : '';
      return { title: `${activePage.brand}${sub}`, sub: 'Brand detail · Net media spend' };
    }
    if (activePage.type === 'analysis') {
      const labels = { medium: 'Medium Type', channel: 'Broad Channel', owner: 'Media Owner' };
      return { title: labels[activePage.analysis], sub: 'Spend analysis · all brands' };
    }
    return { title: 'Dashboard', sub: '' };
  }

  const { title, sub } = getPageTitle();

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #EBF1FB', borderTop: '3px solid #003DA5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontSize: 13, color: '#9AA5C0' }}>Loading data...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#E8334A' }}>Connection error</div>
      <div style={{ fontSize: 12, color: '#9AA5C0' }}>{error}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F7FD' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          background: '#fff', borderBottom: '0.5px solid #E2E8F5',
          padding: '0 28px', height: 58,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#003DA5' }}>{title}</div>
            <div style={{ fontSize: 11, color: '#9AA5C0' }}>{sub}</div>
          </div>
        </div>

        {/* Filter bar */}
        <FilterBar
          year={year}
          fromMonth={fromMonth}
          toMonth={toMonth}
          onYearChange={setYear}
          onPeriodChange={handlePeriodChange}
        />

        {/* Page content */}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>

          {/* OVERVIEW PAGE */}
          {activePage.type === 'overview' && (
            <div>
              <KpiCards data={cur} prevData={prev} fromMonth={fromMonth} toMonth={toMonth} />
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }}>
                <MonthlyChart data={cur} prevData={prev} fromMonth={fromMonth} toMonth={toMonth} year={year} />
                <DonutChart data={cur} fromMonth={fromMonth} toMonth={toMonth} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <SpendBar
                  data={cur} prevData={prev}
                  groupKey="brand"
                  title="Spend by Brand"
                  subtitle="YoY comparison · Net media (RM)"
                  fromMonth={fromMonth} toMonth={toMonth}
                  colorMap={BRAND_COLORS}
                />
                <SpendBar
                  data={cur} prevData={prev}
                  groupKey="mediaOwner"
                  title="Top Media Owners"
                  subtitle="Net spend · 2026"
                  fromMonth={fromMonth} toMonth={toMonth}
                  colorMap={{}}
                />
              </div>
            </div>
          )}

          {/* BRAND PAGE */}
          {activePage.type === 'brand' && (
            <div>
              <KpiCards data={cur} prevData={prev} fromMonth={fromMonth} toMonth={toMonth} />
              <div style={{ marginBottom: 16 }}>
                <Timeline data={cur} fromMonth={fromMonth} toMonth={toMonth} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }}>
                <MonthlyChart data={cur} prevData={prev} fromMonth={fromMonth} toMonth={toMonth} year={year} />
                <DonutChart data={cur} fromMonth={fromMonth} toMonth={toMonth} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <SpendBar
                  data={cur} prevData={prev}
                  groupKey="broadChannel"
                  title="Spend by Broad Channel"
                  subtitle="Net media (RM)"
                  fromMonth={fromMonth} toMonth={toMonth}
                  colorMap={{}}
                />
                <SpendBar
                  data={cur} prevData={prev}
                  groupKey="mediaOwner"
                  title="Spend by Media Owner"
                  subtitle="Net media (RM)"
                  fromMonth={fromMonth} toMonth={toMonth}
                  colorMap={{}}
                />
              </div>
            </div>
          )}

          {/* ANALYSIS PAGES */}
          {activePage.type === 'analysis' && (
            <div>
              <KpiCards data={cur} prevData={prev} fromMonth={fromMonth} toMonth={toMonth} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {activePage.analysis === 'medium' && (
                  <>
                    <SpendBar
                      data={cur} prevData={prev}
                      groupKey="mediumType"
                      title="Spend by Medium Type"
                      subtitle="All brands · Net media (RM)"
                      fromMonth={fromMonth} toMonth={toMonth}
                      colorMap={MEDIUM_COLORS}
                    />
                    <DonutChart data={cur} fromMonth={fromMonth} toMonth={toMonth} />
                  </>
                )}
                {activePage.analysis === 'channel' && (
                  <>
                    <SpendBar
                      data={cur} prevData={prev}
                      groupKey="broadChannel"
                      title="Spend by Broad Channel"
                      subtitle="All brands · Net media (RM)"
                      fromMonth={fromMonth} toMonth={toMonth}
                      colorMap={{}}
                    />
                    <SpendBar
                      data={cur} prevData={prev}
                      groupKey="channel"
                      title="Spend by Channel"
                      subtitle="All brands · Net media (RM)"
                      fromMonth={fromMonth} toMonth={toMonth}
                      colorMap={{}}
                    />
                  </>
                )}
                {activePage.analysis === 'owner' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <SpendBar
                      data={cur} prevData={prev}
                      groupKey="mediaOwner"
                      title="Spend by Media Owner"
                      subtitle="All brands · Net media (RM)"
                      fromMonth={fromMonth} toMonth={toMonth}
                      colorMap={{}}
                    />
                  </div>
                )}
              </div>
              <MonthlyChart data={cur} prevData={prev} fromMonth={fromMonth} toMonth={toMonth} year={year} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}