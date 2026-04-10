export function parseSheetData(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? null;
    });
    return {
      year: parseInt(obj['Year']) || null,
      file: obj['File'],
      brand: obj['Brand'],
      subBrand: obj['Sub-Brand'],
      mediaOwner: obj['Media Owner'],
      mediumType: obj['Medium Type'],
      broadChannel: obj['Broad Channel'],
      channel: obj['Channel'],
      format: obj['Format'],
      netCost: parseFloat(obj['Net Media Cost (RM)']) || 0,
      jan: parseFloat(obj['Jan']) || 0,
      feb: parseFloat(obj['Feb']) || 0,
      mar: parseFloat(obj['Mar']) || 0,
      apr: parseFloat(obj['Apr']) || 0,
      may: parseFloat(obj['May']) || 0,
      jun: parseFloat(obj['Jun']) || 0,
      jul: parseFloat(obj['Jul']) || 0,
      aug: parseFloat(obj['Aug']) || 0,
      sep: parseFloat(obj['Sep']) || 0,
      oct: parseFloat(obj['Oct']) || 0,
      nov: parseFloat(obj['Nov']) || 0,
      dec: parseFloat(obj['Dec']) || 0,
    };
  });
}

export const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
export const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const BRAND_COLORS = {
  'Dutch Lady TAF': '#003DA5',
  'Dutch Lady IFT & Kids': '#00B67A',
  'Friso': '#E8B800',
};

export const MEDIUM_COLORS = {
  'Digital': '#1A6FE0',
  'Offline': '#003DA5',
  'Ecomm / Socomm': '#00B67A',
};

export function filterByPeriod(data, year, fromMonth, toMonth) {
  const monthKeys = MONTHS.slice(fromMonth, toMonth + 1);
  return data
    .filter(r => r.year === year)
    .map(r => ({
      ...r,
      periodCost: monthKeys.reduce((sum, m) => sum + (r[m] || 0), 0),
    }));
}

export function sumBy(data, key) {
  const result = {};
  data.forEach(r => {
    const k = r[key];
    if (!k) return;
    result[k] = (result[k] || 0) + (r.periodCost ?? r.netCost);
  });
  return Object.entries(result)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
}

export function monthlyTrend(data, year, compareYear, allData) {
  return MONTHS.map((m, i) => {
    const cur = data.filter(r => r.year === year).reduce((s, r) => s + (r[m] || 0), 0);
    const prev = allData.filter(r => r.year === compareYear).reduce((s, r) => s + (r[m] || 0), 0);
    return { month: MONTH_LABELS[i], current: Math.round(cur), previous: Math.round(prev) };
  });
}

export function getSubBrands(data, brand) {
  const subs = [...new Set(data.filter(r => r.brand === brand).map(r => r.subBrand).filter(Boolean))];
  return subs;
}