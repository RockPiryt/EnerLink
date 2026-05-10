import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import './Dashboard.css';

/* ----------------- Inline SVG icons ----------------- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ),
  Plug: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2v4"/><path d="M15 2v4"/><path d="M5 10h14v4a7 7 0 0 1-14 0z"/><path d="M12 21v-3"/></svg>
  ),
  Headset: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3z"/><path d="M3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13 21a2 2 0 0 1-2.83 0L3 13.83V3h10.83L21 10.17a2 2 0 0 1-.41 3.24z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  Trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 4h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4"/><path d="M7 4H4a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4"/></svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  ),
};

type Tile = {
  title: string;
  desc: string;
  path: string;
  color: string;
  icon: React.FC;
};

const TILES: Tile[] = [
  { title: 'Customers',           desc: 'Customer database and interaction history', path: '/customers',           color: 'tile-blue',    icon: Icon.Briefcase },
  { title: 'Contracts',           desc: 'Manage contracts and their statuses',       path: '/contracts',           color: 'tile-violet',  icon: Icon.FileText },
  { title: 'Energy Providers',    desc: 'Providers and available tariffs',           path: '/providers',           color: 'tile-amber',   icon: Icon.Plug },
  { title: 'Sales Representatives',desc: 'Sales team members',                       path: '/sales',               color: 'tile-emerald', icon: Icon.Headset },
  { title: 'Tags',                desc: 'Categorize customers and contracts',        path: '/tags',                color: 'tile-pink',    icon: Icon.Tag },
  { title: 'Analytics',           desc: 'Sales results and key metrics',             path: '/analytics',           color: 'tile-cyan',    icon: Icon.BarChart },
  { title: 'Manager Panel',       desc: 'Rankings and team management',              path: '/manager',             color: 'tile-indigo',  icon: Icon.Trophy },
  { title: 'Address Dictionaries',desc: 'Provinces, cities and postal codes',        path: '/address-dictionaries',color: 'tile-teal',    icon: Icon.MapPin },
  { title: 'Users',               desc: 'Accounts and system access',                path: '/users',               color: 'tile-slate',   icon: Icon.Users },
  { title: 'Roles',               desc: 'Role and permission definitions',           path: '/roles',               color: 'tile-rose',    icon: Icon.Shield },
];

const Dashboard: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase();
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Welcome back';
    return 'Good evening';
  })();

  return (
    <div className="dashboard-page">
      {/* ---------------- HEADER ---------------- */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-brand">
            <div className="dashboard-logo-mark" aria-hidden="true">
              <Icon.Bolt />
            </div>
            <h1 className="dashboard-brand-name">EnerLink</h1>
            <span className="dashboard-brand-tag">CRM</span>
          </div>

          <div className="dashboard-header-actions">
            <div className="dashboard-user-chip">
              <span className="dashboard-user-avatar" aria-hidden="true">{initials || 'U'}</span>
              <span className="dashboard-user-meta">
                <span className="dashboard-user-name">{fullName}</span>
                <span className="dashboard-user-role"> · {user.role_name}</span>
              </span>
            </div>

            {user.role_name === 'Administrator' && (
              <button className="dashboard-btn dashboard-btn-primary" onClick={() => navigate('/admin')}>
                <Icon.Settings />
                <span>Admin Panel</span>
              </button>
            )}

            <button className="dashboard-btn dashboard-btn-danger" onClick={logout}>
              <Icon.Logout />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- MAIN ---------------- */}
      <main className="dashboard-main">
        {/* Hero */}
        <section className="dashboard-hero">
          <div className="dashboard-hero-grid" aria-hidden="true" />
          <div className="dashboard-hero-eyebrow">
            <span className="dot" />
            EnerLink CRM Panel
          </div>
          <h2 className="dashboard-hero-title">
            {greeting}, <span className="accent">{user.first_name}</span>!
          </h2>
          <p className="dashboard-hero-subtitle">
            Manage customers, contracts and energy sales in one place.
            Pick a module to get started.
          </p>
        </section>

        {/* Profile */}
        <section className="dashboard-profile">
          <div className="dashboard-profile-avatar" aria-hidden="true">
            {initials || 'U'}
          </div>
          <div className="dashboard-profile-info">
            <div className="dashboard-profile-field">
              <span className="dashboard-profile-label">Full name</span>
              <span className="dashboard-profile-value">{fullName}</span>
            </div>
            <div className="dashboard-profile-field">
              <span className="dashboard-profile-label">Email</span>
              <span className="dashboard-profile-value">{user.email}</span>
            </div>
            <div className="dashboard-profile-field">
              <span className="dashboard-profile-label">Role</span>
              <span className="dashboard-profile-value">
                <span className="dashboard-badge dashboard-badge-role">{user.role_name || 'User'}</span>
              </span>
            </div>
            <div className="dashboard-profile-field">
              <span className="dashboard-profile-label">Status</span>
              <span className="dashboard-profile-value">
                <span className={`dashboard-badge ${user.active ? 'dashboard-badge-active' : 'dashboard-badge-inactive'}`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Navigation tiles */}
        <div className="dashboard-section-header">
          <div>
            <h3 className="dashboard-section-title">System modules</h3>
            <p className="dashboard-section-subtitle">Quick access to every part of the CRM</p>
          </div>
        </div>

        <div className="dashboard-tile-grid">
          {TILES.map((tile) => {
            const TileIcon = tile.icon;
            return (
              <button
                key={tile.path}
                className={`dashboard-tile ${tile.color}`}
                onClick={() => navigate(tile.path)}
                type="button"
              >
                <div className="dashboard-tile-icon" aria-hidden="true">
                  <TileIcon />
                </div>
                <div className="dashboard-tile-body">
                  <h4 className="dashboard-tile-title">{tile.title}</h4>
                  <p className="dashboard-tile-desc">{tile.desc}</p>
                </div>
                <span className="dashboard-tile-arrow" aria-hidden="true">
                  <Icon.Arrow />
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
