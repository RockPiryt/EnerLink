import React, { useEffect, useState } from 'react';
import { getContractAnalytics } from '../../services/analyticsService';
import { getEfficiency, SalespersonEfficiency } from '../../services/managerService';
import './Manager.css';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BAR_COLORS = ['#0066ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Icon = {
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
};

const SalespersonEfficiencyChart: React.FC = () => {
  const [data, setData] = useState<SalespersonEfficiency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [allYears, setAllYears] = useState<number[]>([]);
  const [selectedSalespeople, setSelectedSalespeople] = useState<string[]>([]);

  useEffect(() => {
    getContractAnalytics().then(json => {
      if (json.yearly) setAllYears(json.yearly.map((y: any) => y.year));
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEfficiency(year)
      .then(json => {
        const eff = json.efficiency || [];
        setData(eff);
        if (selectedSalespeople.length === 0 && eff.length > 0) {
          setSelectedSalespeople(eff.map((e: SalespersonEfficiency) => e.salesperson));
        }
      })
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const toggleSalesperson = (name: string) => {
    setSelectedSalespeople(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const filteredData = data.filter(d => selectedSalespeople.includes(d.salesperson));
  const maxCount = Math.max(...filteredData.flatMap(d => d.monthly.map(m => m.count)), 1);

  const width = 900;
  const height = 320;
  const padL = 48, padR = 24, padT = 28, padB = 44;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const months = 12;
  const barW = 18;
  const barGap = 4;
  const groupW = filteredData.length * (barW + barGap);
  const yTicks = [0, Math.round(maxCount / 2), maxCount];

  return (
    <div className="mgr-card">
      <div className="mgr-card-header">
        <h3 className="mgr-card-title">Salesperson Efficiency — {year}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="mgr-filter-label">Year:</span>
          <select className="mgr-select" value={year} onChange={e => setYear(Number(e.target.value))}>
            {Array.from(new Set([year, ...allYears])).sort((a, b) => b - a).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mgr-card-body">
        {/* Salesperson checkboxes */}
        {!loading && !error && data.length > 0 && (
          <div className="mgr-checkboxes" style={{ marginBottom: 16 }}>
            {data.map((sp, i) => (
              <label key={sp.salesperson} className="mgr-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedSalespeople.includes(sp.salesperson)}
                  onChange={() => toggleSalesperson(sp.salesperson)}
                />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: BAR_COLORS[i % BAR_COLORS.length], display: 'inline-block' }} />
                {sp.salesperson}
              </label>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mgr-loading">
            <span className="pr-spinner" />
            <p style={{ marginTop: 12 }}>Loading efficiency data…</p>
          </div>
        ) : error ? (
          <div className="mgr-alert"><Icon.AlertCircle /><span>{error}</span></div>
        ) : (
          <div className="mgr-chart-wrap">
            <svg width={width} height={height} style={{ background: '#f8fafc', minWidth: 480 }}>
              {/* Y gridlines + labels */}
              {yTicks.map(val => {
                const y = padT + chartH - (val / maxCount) * chartH;
                return (
                  <g key={val}>
                    <line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="#e2e8f0" strokeDasharray="4 3" />
                    <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{val}</text>
                  </g>
                );
              })}

              {/* Bars */}
              {filteredData.map((sp, i) =>
                sp.monthly.map((d, j) => {
                  const slotW = chartW / months;
                  const groupStart = padL + j * slotW + slotW / 2 - groupW / 2;
                  const x = groupStart + i * (barW + barGap);
                  const barH = (d.count / maxCount) * chartH;
                  const y = padT + chartH - barH;
                  return (
                    <g key={`${sp.salesperson}-${d.month}`}>
                      <rect x={x} y={y} width={barW} height={barH || 0} rx={3} fill={BAR_COLORS[i % BAR_COLORS.length]} opacity="0.85" />
                      {barH > 16 && d.count > 0 && (
                        <text x={x + barW / 2} y={y + 12} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">{d.count}</text>
                      )}
                    </g>
                  );
                })
              )}

              {/* Month labels */}
              {monthNames.map((m, j) => (
                <text
                  key={m}
                  x={padL + (j + 0.5) * (chartW / months)}
                  y={padT + chartH + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                >{m}</text>
              ))}

              {/* Legend */}
              {filteredData.map((sp, i) => (
                <g key={`${sp.salesperson}-legend`}>
                  <rect x={padL + chartW - 160} y={padT + i * 22} width={12} height={12} rx={3} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  <text x={padL + chartW - 144} y={padT + i * 22 + 10} fontSize="12" fill="#334155">{sp.salesperson}</text>
                </g>
              ))}

              {/* Axes */}
              <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#e2e8f0" />
              <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="#e2e8f0" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalespersonEfficiencyChart;
