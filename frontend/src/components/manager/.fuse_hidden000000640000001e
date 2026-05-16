import React, { useEffect, useState } from 'react';
import { getCustomerServiceReport, CustomerServiceReport as CustomerServiceReportData } from '../../services/managerService';
import './Manager.css';

const Icon = {
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  ),
};

const CustomerServiceReport: React.FC = () => {
  const [data, setData] = useState<CustomerServiceReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await getCustomerServiceReport({ month, year });
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [month, year]);

  return (
    <div className="mgr-card">
      <div className="mgr-card-header">
        <h3 className="mgr-card-title">Customer Service Report</h3>
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
          <button className="mgr-btn" onClick={fetchReport} disabled={loading}>
            <Icon.Refresh />Refresh
          </button>
        </div>
      </div>

      <div className="mgr-card-body">
        {loading ? (
          <div className="mgr-loading">
            <span className="pr-spinner" />
            <p style={{ marginTop: 12 }}>Loading report…</p>
          </div>
        ) : error ? (
          <div className="mgr-alert"><Icon.AlertCircle /><span>{error}</span></div>
        ) : data ? (
          <div className="mgr-report-grid">
            <div className="mgr-report-cell">
              <div className="mgr-report-cell-label">Serviced customers</div>
              <div className="mgr-report-cell-value">{data.num_customers}</div>
            </div>
            <div className="mgr-report-cell">
              <div className="mgr-report-cell-label">Avg. realization (days)</div>
              <div className="mgr-report-cell-value">{data.avg_realization_days ?? '—'}</div>
            </div>
            <div className="mgr-report-cell">
              <div className="mgr-report-cell-label">Signed contracts</div>
              <div className="mgr-report-cell-value">{data.signed_contracts}</div>
            </div>
            <div className="mgr-report-cell">
              <div className="mgr-report-cell-label">Cancelled contracts</div>
              <div className="mgr-report-cell-value">{data.cancelled_contracts}</div>
            </div>
            <div className="mgr-report-cell">
              <div className="mgr-report-cell-label">New contracts</div>
              <div className="mgr-report-cell-value">{data.new_contracts}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CustomerServiceReport;
