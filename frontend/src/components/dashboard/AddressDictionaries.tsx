import React, { useState } from 'react';
import CityList from '../dictionary/CityList';
import CountryList from '../dictionary/CountryList';
import DistrictList from '../dictionary/DistrictList';
import PKWiUList from '../pkwiu/PKWiUList';
import TariffList from '../tariff/TariffList';
import '../provider/Provider.css';

const Icon = {
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 22, height: 22, marginRight: 8}}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  )
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

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-brand">
            <div className="dashboard-logo-mark" aria-hidden="true">
              <Icon.MapPin />
            </div>
            <h1 className="dashboard-brand-name">EnerLink</h1>
            <span className="dashboard-brand-tag">CRM</span>
          </div>
          <div className="dashboard-header-actions">
            <span className="dashboard-user-meta">Address Dictionaries</span>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-section-header">
          <div>
            <h3 className="dashboard-section-title">Address Dictionaries</h3>
            <p className="dashboard-section-subtitle">Manage cities, provinces, countries, PKWiU, and energy tariffs</p>
          </div>
        </div>

        <section>
          <div style={{
            background: 'var(--el-surface)',
            borderRadius: 20,
            boxShadow: '0 6px 24px -8px rgba(15,23,42,0.08)',
            border: '1px solid var(--el-border)',
            overflow: 'hidden'
          }}>
            {/* Custom tab bar */}
            <div style={{
              display: 'flex',
              gap: 0,
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
        </section>
      </main>
    </div>
  );
};

export default AddressDictionaries;
