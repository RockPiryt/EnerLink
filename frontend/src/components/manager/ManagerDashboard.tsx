import React from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerRanking from './ManagerRanking';
import CustomerServiceReport from './CustomerServiceReport';
import ContractsSVGChart from './ContractsSVGChart';
import SalespersonEfficiencyChart from './SalespersonEfficiencyChart';
import '../provider/Provider.css';
import './Manager.css';

const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
  ),
};

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pr-page">
      {/* ---- HEADER ---- */}
      <header className="pr-header">
        <div className="pr-header-inner">
          <div className="pr-brand">
            <div className="pr-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
            <h1 className="pr-brand-name">EnerLink</h1>
            <span className="pr-brand-tag">Manager</span>
          </div>
          <div className="pr-header-actions">
            <button className="pr-btn" onClick={() => navigate('/dashboard')}>
              <Icon.Back /><span>Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---- MAIN ---- */}
      <main className="pr-main">
        {/* Hero */}
        <div className="pr-hero">
          <div className="pr-hero-grid" aria-hidden="true" />
          <div className="pr-hero-left">
            <div className="pr-hero-icon" aria-hidden="true"><Icon.BarChart /></div>
            <div>
              <h2 className="pr-hero-title">Manager Dashboard</h2>
              <p className="pr-hero-subtitle">Sales rankings, reports and team efficiency overview</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mgr-sections">
          <ManagerRanking />
          <CustomerServiceReport />
          <ContractsSVGChart />
          <SalespersonEfficiencyChart />
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
