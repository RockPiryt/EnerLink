import React, { useEffect, useState } from 'react';
import { getContractAnalytics } from '../../services/analyticsService';
import './Manager.css';

interface MonthlyData { month: number; count: number; }

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Icon = {
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
};

const ContractsSVGChart: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [allYears, setAllYears] = useState<number[]>([]);

  useEffect(() => {
    getContractAnalytics().then(json => {
      if (json.yearly) setAllYears(json.yearly.map((y: any) => y.year));
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getContractAnalytics(year)
      .then(json => setData(json.monthly || []))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [year]);

  const width = 820;
  const height = 300;
  const padL = 48, padR = 24, padT = 28, padB = 44;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const barWidth = 36;
  const months = 12;

  const monthlyData: MonthlyData[] = Array.from({ length: 12 }, (_, i) => {
    const found = data.find(d => d.month === i + 1);
    return { month: i + 1, count: found ? found.count : 0 };
  });

  const maxCount = Math.max(...monthlyData.map(d => d.count), 1);
  const yTicks = [0, Math.round(maxCount / 2), maxCount];

  return (
    <div className="mgr-card">
      <div className="mgr-card-header">
        <h3 className="mgr-card-title">Contracts per Month — {year}</h3>
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
        {loading ? (
          <div className="mgr-loading">
            <span className="pr-spinner" />
            <p style={{ marginTop: 12 }}>Loading analytics…</p>
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
              {monthlyData.map((d, i) => {
                const slotW = chartW / months;
                const x = padL + i * slotW + slotW / 2 - barWidth / 2;
                const barH = (d.count / maxCount) * chartH;
                const y = padT + chartH - barH;
                return (
                  <g key={i}>
                    <rect x={x} y={y} width={barWidth} height={barH || 0} rx={5} fill="#0066ff" opacity="0.85" />
                    {barH > 18 && d.count > 0 && (
                      <text x={x + barWidth / 2} y={y + 14} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">{d.count}</text>
                    )}
                    <text x={x + barWidth / 2} y={padT + chartH + 18} textAnchor="middle" fontSize="11" fill="#64748b">{monthNames[i]}</text>
                  </g>
                );
              })}

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

export default ContractsSVGChart;
