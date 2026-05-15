import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CityList from '../dictionary/CityList';
import CountryList from '../dictionary/CountryList';
import DistrictList from '../dictionary/DistrictList';
import PKWiUList from '../pkwiu/PKWiUList';
import TariffList from '../tariff/TariffList';
import '../provider/Provider.css';

const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
};

type TabKey = 'cities' | 'countries' | 'districts' | 'pkwiu' | 'tariffs';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'cities', label: 'Cities' },
  { key: 'countries', label: 'Countries' },
  { key: 'districts', label: 'Provinces' },
  { key: 'pkwiu', label: 'PKWiU' },
  { key: 'tariffs', label: 'Energy Tariffs' },
];

const AddressDictionaries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('cities');
  const navigate = useNavigate();

  return (
    <div className="pr-page">
      {/* ---- HEADER ---- */}
      <header className="pr-header">
        <div className="pr-header-inner">
          <div className="pr-brand">
            <div className="pr-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
            <h1 className="pr-brand-name">EnerLink</h1>
            <span className="pr-brand-tag">CRM</span>
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
            <div className="pr-hero-icon" aria-hidden="true"><Icon.MapPin /></div>
            <div>
              <h2 className="pr-hero-title">Address Dictionaries</h2>
              <p className="pr-hero-subtitle">Manage cities, provinces, countries, PKWiU, and energy tariffs</p>
            </div>
          </div>
        </div>

        {/* Tab panel */}
        <div style={{
          background: 'var(--el-surface)',
          borderRadius: 20,
          boxShadow: '0 6px 24px -8px rgba(15,23,42,0.08)',
          border: '1px solid var(--el-border)',
          overflow: 'hidden'
        }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--el-border)',
            padding: '0 24px',
            background: 'var(--el-surface)'
          }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #0066ff' : '2px solid transparent',
                  color: activeTab === tab.key ? '#0066ff' : 'var(--el-text-secondary, #64748b)',
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  fontSize: 14,
                  padding: '14px 18px',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  outline: 'none',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: 24 }}>
            {activeTab === 'cities' && <CityList />}
            {activeTab === 'countries' && <CountryList />}
            {activeTab === 'districts' && <DistrictList />}
            {activeTab === 'pkwiu' && <PKWiUList />}
            {activeTab === 'tariffs' && <TariffList hideHeader />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddressDictionaries;
