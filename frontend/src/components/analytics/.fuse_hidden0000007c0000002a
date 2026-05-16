import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getContractAnalytics, AnalyticsData } from '../../services/analyticsService';
import './Analytics.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

/* ---- inline SVG icons ---- */
const Icon = {
    Bolt: () => (
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
    ),
    Back: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    ),
    BarChart: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    ),
    TrendingUp: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
    ),
    FileText: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    ),
    Calendar: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ),
    Activity: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    ),
    Award: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
    ),
    AlertCircle: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    ),
    Table: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
    ),
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AnalyticsDashboard: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    const navigate = useNavigate();

    const loadAnalytics = async (year?: number) => {
        setLoading(true);
        setError('');
        try {
            const analyticsData = await getContractAnalytics(year);

            const monthlyMap = new Map(analyticsData.monthly.map(item => [item.month, item.count]));
            const monthlyWithNames = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                count: monthlyMap.get(i + 1) || 0,
                monthName: MONTH_NAMES[i],
            }));

            setData({ ...analyticsData, monthly: monthlyWithNames });

            const years = analyticsData.yearly.map(item => item.year).sort((a, b) => b - a);
            setAvailableYears(years);
        } catch {
            setError('Error loading analytics data.');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAnalytics(selectedYear); }, []);

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        loadAnalytics(year);
    };

    /* ---- computed stats ---- */
    const totalYear   = data?.monthly.reduce((s, m) => s + m.count, 0) ?? 0;
    const avgMonth    = Math.round(totalYear / 12);
    const peakMonth   = data?.monthly.reduce((best, m) => m.count > best.count ? m : best, { count: 0, monthName: '—', month: 0, }) ?? { count: 0, monthName: '—' };
    const totalAll    = data?.yearly.reduce((s, y) => s + y.count, 0) ?? 0;

    /* ---- Chart.js data & options ---- */
    const monthlyChartData = {
        labels: data?.monthly.map(m => m.monthName) ?? [],
        datasets: [{
            label: 'Contracts Created',
            data: data?.monthly.map(m => m.count) ?? [],
            borderColor: '#0066ff',
            backgroundColor: 'rgba(0, 102, 255, 0.08)',
            borderWidth: 2.5,
            pointBackgroundColor: '#0066ff',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.35,
            fill: true,
        }],
    };

    const yearlyChartData = {
        labels: data?.yearly.map(y => y.year.toString()) ?? [],
        datasets: [{
            label: 'Total Contracts',
            data: data?.yearly.map(y => y.count) ?? [],
            backgroundColor: 'rgba(124, 58, 237, 0.75)',
            borderColor: '#7c3aed',
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    const baseChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.8)',
                padding: 12,
                cornerRadius: 8,
                borderColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    color: '#94a3b8',
                    font: { size: 12 },
                    callback: (v: any) => Number.isInteger(v) ? v : '',
                },
                grid: { color: 'rgba(15,23,42,0.06)' },
                border: { display: false },
            },
            x: {
                ticks: { color: '#94a3b8', font: { size: 12 } },
                grid: { display: false },
                border: { display: false },
            },
        },
    };

    /* ---- peak bar width helper ---- */
    const maxMonthCount = Math.max(...(data?.monthly.map(m => m.count) ?? [0]), 1);

    return (
        <div className="an-page">
            {/* ---- HEADER ---- */}
            <header className="an-header">
                <div className="an-header-inner">
                    <div className="an-brand">
                        <div className="an-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
                        <h1 className="an-brand-name">EnerLink</h1>
                        <span className="an-brand-tag">CRM</span>
                    </div>
                    <div className="an-header-actions">
                        <div className="an-year-selector">
                            <span className="an-year-label">Year:</span>
                            <select
                                className="an-year-select"
                                value={selectedYear}
                                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                            >
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <button className="an-btn" onClick={() => navigate('/dashboard')}>
                            <Icon.Back /><span>Dashboard</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ---- MAIN ---- */}
            <main className="an-main">
                {/* Hero */}
                <div className="an-hero">
                    <div className="an-hero-grid" aria-hidden="true" />
                    <div className="an-hero-left">
                        <div className="an-hero-icon" aria-hidden="true"><Icon.BarChart /></div>
                        <div>
                            <h2 className="an-hero-title">Contract Analytics</h2>
                            <p className="an-hero-subtitle">Sales results and key metrics for {selectedYear}</p>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="an-alert an-alert-danger">
                        <Icon.AlertCircle /><span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="an-state-center">
                        <span className="an-spinner" />
                        <p className="an-state-label">Loading analytics data…</p>
                    </div>
                ) : data ? (
                    <>
                        {/* ---- STAT CARDS ---- */}
                        <div className="an-stat-grid">
                            <div className="an-stat-card an-stat-blue">
                                <div className="an-stat-icon"><Icon.FileText /></div>
                                <div className="an-stat-label">Total in {selectedYear}</div>
                                <div className="an-stat-value">{totalYear}</div>
                                <div className="an-stat-sub">contracts created</div>
                            </div>
                            <div className="an-stat-card an-stat-emerald">
                                <div className="an-stat-icon"><Icon.Activity /></div>
                                <div className="an-stat-label">Monthly Average</div>
                                <div className="an-stat-value">{avgMonth}</div>
                                <div className="an-stat-sub">contracts / month</div>
                            </div>
                            <div className="an-stat-card an-stat-violet">
                                <div className="an-stat-icon"><Icon.Award /></div>
                                <div className="an-stat-label">Peak Month</div>
                                <div className="an-stat-value">{peakMonth.count}</div>
                                <div className="an-stat-sub">{peakMonth.monthName} {selectedYear}</div>
                            </div>
                            <div className="an-stat-card an-stat-amber">
                                <div className="an-stat-icon"><Icon.TrendingUp /></div>
                                <div className="an-stat-label">All-time Total</div>
                                <div className="an-stat-value">{totalAll}</div>
                                <div className="an-stat-sub">across all years</div>
                            </div>
                        </div>

                        {/* ---- CHARTS ---- */}
                        <div className="an-charts-grid">
                            {/* Line — monthly */}
                            <div className="an-chart-card">
                                <div className="an-chart-header">
                                    <h3 className="an-chart-title">
                                        <Icon.TrendingUp />
                                        Monthly Contracts
                                    </h3>
                                    <span className="an-chart-subtitle">{selectedYear} · month by month</span>
                                </div>
                                <div className="an-chart-body">
                                    <div className="an-chart-wrap">
                                        <Line data={monthlyChartData} options={baseChartOptions as any} />
                                    </div>
                                </div>
                            </div>

                            {/* Bar — yearly */}
                            <div className="an-chart-card">
                                <div className="an-chart-header">
                                    <h3 className="an-chart-title">
                                        <Icon.BarChart />
                                        Yearly Contract Trends
                                    </h3>
                                    <span className="an-chart-subtitle">All years comparison</span>
                                </div>
                                <div className="an-chart-body">
                                    <div className="an-chart-wrap">
                                        <Bar data={yearlyChartData} options={baseChartOptions as any} />
                                    </div>
                                </div>
                            </div>

                            {/* Monthly breakdown table */}
                            <div className="an-chart-card">
                                <div className="an-chart-header">
                                    <h3 className="an-chart-title">
                                        <Icon.Table />
                                        Monthly Breakdown
                                    </h3>
                                    <span className="an-chart-subtitle">{selectedYear} · detailed view</span>
                                </div>
                                <div className="an-chart-body" style={{ padding: 0 }}>
                                    <table className="an-monthly-table">
                                        <thead>
                                            <tr>
                                                <th>Month</th>
                                                <th className="an-bar-cell">Distribution</th>
                                                <th style={{ textAlign: 'right' }}>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.monthly.map((m) => (
                                                <tr key={m.month}>
                                                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{m.monthName}</td>
                                                    <td className="an-bar-cell">
                                                        <div className="an-inline-bar-wrap">
                                                            <div className="an-inline-bar-bg">
                                                                <div
                                                                    className="an-inline-bar-fill"
                                                                    style={{ width: `${(m.count / maxMonthCount) * 100}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="an-inline-bar-wrap" style={{ justifyContent: 'flex-end' }}>
                                                            <span className="an-inline-bar-count">{m.count}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="an-state-center">
                        <div className="an-state-title">No analytics data available</div>
                        <p className="an-state-label">Please check if there are any contracts in the system.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AnalyticsDashboard;
