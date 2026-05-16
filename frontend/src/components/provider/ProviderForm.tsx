import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Provider.css';

interface ProviderFormData { name: string; }

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  PlugPlus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2v4"/><path d="M15 2v4"/><path d="M5 10h14v4a7 7 0 0 1-14 0z"/><path d="M12 21v-3"/><line x1="19" y1="6" x2="19" y2="12"/><line x1="22" y1="9" x2="16" y2="9"/></svg>
  ),
  Building: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
};

const ProviderForm: React.FC = () => {
  const [form, setForm] = useState<ProviderFormData>({ name: '' });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add provider');
      }
      setSuccess('Provider added successfully!');
      setForm({ name: '' });
      setTimeout(() => navigate('/providers'), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <button className="pr-btn" onClick={() => navigate('/providers')}>
              <Icon.Back /><span>Provider List</span>
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
            <div className="pr-hero-icon" aria-hidden="true"><Icon.PlugPlus /></div>
            <div>
              <h2 className="pr-hero-title">Add New Energy Provider</h2>
              <p className="pr-hero-subtitle">Register a new provider in the system</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="pr-alert pr-alert-danger">
            <Icon.AlertCircle /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="pr-alert pr-alert-success">
            <Icon.CheckCircle /><span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="pr-form-card">
            <div className="pr-form-section">
              <h3 className="pr-form-section-title"><Icon.Building />Provider Information</h3>
              <div className="pr-form-grid pr-form-grid-2">
                <div className="pr-form-group">
                  <label className="pr-form-label pr-form-label-required">Provider Name</label>
                  <input
                    className="pr-form-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter provider name"
                    required
                  />
                  <span className="pr-form-hint">Enter the official name of the energy provider</span>
                </div>
              </div>
            </div>

            <div className="pr-form-actions">
              <button className="pr-btn pr-btn-primary" type="submit" disabled={loading}>
                {loading ? (
                  <><span className="pr-spinner" style={{ width: 16, height: 16, borderWidth: 2, margin: 0, display: 'inline-block' }} />Adding…</>
                ) : (
                  <><Icon.Plus />Add Provider</>
                )}
              </button>
              <button className="pr-btn pr-btn-ghost" type="button" onClick={() => navigate('/providers')} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProviderForm;
