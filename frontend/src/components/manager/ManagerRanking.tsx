import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { getRanking, RankingResponse } from '../../services/managerService';
import './Manager.css';

const Icon = {
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
};

const MEDAL_COLORS = ['#f59e0b', '#94a3b8', '#b45309'];

const ManagerRanking: React.FC = () => {
  const [data, setData] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');

  const fetchRanking = async (m: number | '' = month, y: number | '' = year) => {
    setLoading(true);
    setError(null);
    try {
      const json = await getRanking({ month: m, year: y });
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRanking(month, year); }, [month, year]);

  const handleExportXLSX = () => {
    if (!data?.ranking) return;
    const ws = XLSX.utils.json_to_sheet(data.ranking.map(item => ({
      ID: item.id, Name: item.name, Score: item.value
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ranking');
    XLSX.writeFile(wb, 'sales_ranking.xlsx');
  };

  const ranking = data?.ranking || [];
  const totalSales = ranking.reduce((s, i) => s + i.value, 0);
  const avgSales = ranking.length > 0 ? (totalSales / ranking.length).toFixed(1) : '0';
  const best = ranking[0] ?? null;
  const worst = ranking.length > 0 ? ranking[ranking.length - 1] : null;

  return (
    <div className="mgr-card">
      <div className="mgr-card-header">
        <h3 className="mgr-card-title">Sales Ranking</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="mgr-filter-label">Month:</span>
          <select className="mgr-select" value={month} onChange={e => setMonth(e.target.value ? Number(e.target.value) : '')}>
            <option value="">All</option>
            {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
          <span className="mgr-filter-label">Year:</span>
          <input
            className="mgr-input"
            type="number"
            value={year}
            min={2000}
            max={2100}
            placeholder="All"
            onChange={e => setYear(e.target.value ? Number(e.target.value) : '')}
          />
          <button
            className="mgr-btn mgr-btn-success"
            onClick={handleExportXLSX}
            disabled={loading || !ranking.length}
          >
            <Icon.Download />Export XLSX
          </button>
        </div>
      </div>

      <div className="mgr-card-body">
        {/* Summary pills */}
        {!loading && !error && ranking.length > 0 && (
          <div className="mgr-stats-row">
            <div className="mgr-stat-pill"><strong>Total sales:</strong> {totalSales}</div>
            <div className="mgr-stat-pill"><strong>Avg / person:</strong> {avgSales}</div>
            {best && <div className="mgr-stat-pill"><strong>Best:</strong> {best.name} ({best.value})</div>}
            {worst && worst.id !== best?.id && <div className="mgr-stat-pill"><strong>Lowest:</strong> {worst.name} ({worst.value})</div>}
          </div>
        )}

        {loading ? (
          <div className="mgr-loading">
            <span className="pr-spinner" />
            <p style={{ marginTop: 12 }}>Loading ranking…</p>
          </div>
        ) : error ? (
          <div className="mgr-alert"><Icon.AlertCircle /><span>{error}</span></div>
        ) : (
          <>
            <div className="mgr-table-wrap">
              <table className="mgr-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No data available.</td></tr>
                  ) : ranking.map((item, idx) => (
                    <tr key={item.id}>
                      <td>
                        {idx < 3
                          ? <svg viewBox="0 0 24 24" fill="none" stroke={MEDAL_COLORS[idx]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
                          : <span className="mgr-table-id">{idx + 1}</span>}
                      </td>
                      <td><span className="mgr-table-id">{item.id}</span></td>
                      <td style={{ fontWeight: idx === 0 ? 700 : 400 }}>{item.name}</td>
                      <td>
                        <span className={idx < 3 ? `mgr-badge mgr-badge-rank${idx + 1}` : ''} style={idx >= 3 ? { fontWeight: 600 } : {}}>
                          {item.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data?.generated_at && (
              <p className="mgr-generated-note">Generated at: {data.generated_at}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerRanking;
