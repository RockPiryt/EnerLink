import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import CityList from '../dictionary/CityList';
import CountryList from '../dictionary/CountryList';
import DistrictList from '../dictionary/DistrictList';
import PKWiUList from '../pkwiu/PKWiUList';
import TariffList from '../tariff/TariffList';

// Inline SVG icon for Address Dictionaries
const Icon = {
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 22, height: 22, marginRight: 8}}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  )
};

const AddressDictionaries: React.FC = () => {
  return (
    <div className="dashboard-page">
      {/* Header section, consistent with Dashboard */}
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

      {/* Main content area */}
      <main className="dashboard-main">
        {/* Section header styled like Dashboard */}
        <div className="dashboard-section-header">
          <div>
            <h3 className="dashboard-section-title">Address Dictionaries</h3>
            <p className="dashboard-section-subtitle">Manage cities, provinces, countries, PKWiU, and energy tariffs</p>
          </div>
        </div>

        {/* Flat, borderless, modern tab/content area */}
        <section style={{
          background: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          padding: 0,
          border: 'none',
          margin: 0
        }}>
          <div style={{
            background: 'var(--el-surface)',
            borderRadius: 20,
            boxShadow: '0 6px 24px -8px rgba(15,23,42,0.08)',
            padding: 0,
            border: '1px solid var(--el-border)'
          }}>
            <Tabs
              defaultActiveKey="cities"
              id="address-dictionaries-tabs"
              className="mb-3 dashboard-tabs"
              style={{padding: '0 24px', marginTop: 0}}
            >
              <Tab eventKey="cities" title="Cities">
                <div style={{padding: 24}}><CityList /></div>
              </Tab>
              <Tab eventKey="countries" title="Countries">
                <div style={{padding: 24}}><CountryList /></div>
              </Tab>
              <Tab eventKey="districts" title="Provinces">
                <div style={{padding: 24}}><DistrictList /></div>
              </Tab>
              <Tab eventKey="pkwiu" title="PKWiU">
                <div style={{padding: 24}}><PKWiUList /></div>
              </Tab>
              <Tab eventKey="tariffs" title="Energy Tariffs">
                <div style={{padding: 24}}><TariffList hideHeader /></div>
              </Tab>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AddressDictionaries;
