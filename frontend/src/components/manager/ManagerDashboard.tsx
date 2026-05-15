
import React, { useState } from 'react';
import CustomerServiceReport from './CustomerServiceReport';
import ManagerRanking from './ManagerRanking';
import ContractsSVGChart from './ContractsSVGChart';
import SalespersonEfficiencyChart from './SalespersonEfficiencyChart';
import './ManagerDashboard.css'; // Will be replaced by admin styles

// ----------------- Inline SVG icons for manager dashboard -----------------
const Icon = {
  ChartBar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  Trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2M21 5h-4v2a5 5 0 0 1-10 0V5H3a2 2 0 0 0 2 2h1a7 7 0 0 0 12 0h1a2 2 0 0 0 2-2z"/></svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Report: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  ),
};

/**
 * ManagerDashboard - modern dashboard for managers, styled like AdminPanel.
 * All UI and comments in English. Uses stat cards, SVG icons, and modern layout.
 */
const ManagerDashboard: React.FC = () => {
  // Example stats (replace with real data as needed)
  const stats = [
    {
      icon: <Icon.Users />,
      value: '12',
      label: 'Team members',
      color: 'stat-blue',
    },
    {
      icon: <Icon.Trophy />,
      value: '1st',
      label: 'Current team rank',
      color: 'stat-green',
    },
    {
      icon: <Icon.ChartBar />,
      value: '98',
      label: 'Contracts this year',
      color: 'stat-amber',
    },
    {
      icon: <Icon.Report />,
      value: '4.7/5',
      label: 'Customer rating',
      color: 'stat-cyan',
    },
  ];

  // Tab state for dashboard sections
  const [activeTab, setActiveTab] = useState<'ranking' | 'service' | 'contracts' | 'efficiency'>('ranking');

  return (
    <div className="admin-page">
      {/* ---------------- HEADER ---------------- */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <div className="admin-logo-mark" aria-hidden="true">EL</div>
            <h1 className="admin-brand-name">EnerLink</h1>
            <span className="admin-brand-tag">Manager</span>
          </div>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </button>
            <button className="admin-btn admin-btn-danger" onClick={() => window.location.href = '/logout'}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- MAIN ---------------- */}
      <main className="admin-main">
        {/* Hero section */}
        <section className="admin-hero">
          <div className="admin-hero-grid" aria-hidden="true" />
          <div className="admin-hero-eyebrow">
            <span className="dot" /> Manager dashboard
          </div>
          <h2 className="admin-hero-title">
            Welcome, <span className="accent">EnerLink manager</span>
          </h2>
          <p className="admin-hero-subtitle">
            Track your team’s performance, contracts, and customer satisfaction — all in one place.
          </p>
        </section>

        {/* Stat cards */}
        <section className="admin-stats">
          {stats.map((stat, i) => (
            <div className={`admin-stat-card`} key={i}>
              <div className={`admin-stat-icon ${stat.color}`}>{stat.icon}</div>
              <div className="admin-stat-body">
                <p className="admin-stat-value">{stat.value}</p>
                <p className="admin-stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Tabs for dashboard sections */}
        <section className="admin-panel">
          <div className="admin-panel-body">
            <div className="admin-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'ranking'}
                className={`admin-tab ${activeTab === 'ranking' ? 'active' : ''}`}
                onClick={() => setActiveTab('ranking')}
              >
                <Icon.Trophy /> Ranking
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'service'}
                className={`admin-tab ${activeTab === 'service' ? 'active' : ''}`}
                onClick={() => setActiveTab('service')}
              >
                <Icon.Report /> Customer Service
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'contracts'}
                className={`admin-tab ${activeTab === 'contracts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contracts')}
              >
                <Icon.ChartBar /> Contracts
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'efficiency'}
                className={`admin-tab ${activeTab === 'efficiency' ? 'active' : ''}`}
                onClick={() => setActiveTab('efficiency')}
              >
                <Icon.Users /> Efficiency
              </button>
            </div>

            {/* RANKING TAB */}
            {activeTab === 'ranking' && (
              <div className="admin-section">
                <div className="admin-section-title">Sales Ranking</div>
                <div className="admin-section-subtitle">See your team’s sales leaderboard</div>
                <ManagerRanking />
              </div>
            )}

            {/* CUSTOMER SERVICE TAB */}
            {activeTab === 'service' && (
              <div className="admin-section">
                <div className="admin-section-title">Customer Service Report</div>
                <div className="admin-section-subtitle">Customer satisfaction and support metrics</div>
                <CustomerServiceReport />
              </div>
            )}

            {/* CONTRACTS TAB */}
            {activeTab === 'contracts' && (
              <div className="admin-section">
                <div className="admin-section-title">Contracts Analytics</div>
                <div className="admin-section-subtitle">Monthly contracts summary (SVG chart)</div>
                <ContractsSVGChart />
              </div>
            )}

            {/* EFFICIENCY TAB */}
            {activeTab === 'efficiency' && (
              <div className="admin-section">
                <div className="admin-section-title">Salesperson Efficiency</div>
                <div className="admin-section-subtitle">Compare team members’ efficiency</div>
                <SalespersonEfficiencyChart />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManagerDashboard;
