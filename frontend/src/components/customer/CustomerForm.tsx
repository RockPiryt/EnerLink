import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Customer.css';

interface AddressData {
    street_name?: string;
    building_number?: string;
    apartment_number?: string;
    postal_code?: string;
    city?: string;
    province?: string;
    country?: string;
}

interface CustomerFormData {
    company: string;
    email: string;
    nip?: string;
    phone?: string;
    description?: string;
    address?: AddressData;
}

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  UserPlus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
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

const CustomerForm: React.FC = () => {
    const [form, setForm] = useState<CustomerFormData>({ company: '', email: '', address: {} });
    const navigate = useNavigate();
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addrField = name.replace('address.', '');
            setForm({ ...form, address: { ...form.address, [addrField]: value } });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('http://localhost:8080/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, address: form.address }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add customer');
            }
            setSuccess('Customer added successfully!');
            setForm({ company: '', email: '', address: {} });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cm-page">
            {/* ---- HEADER ---- */}
            <header className="cm-header">
                <div className="cm-header-inner">
                    <div className="cm-brand">
                        <div className="cm-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
                        <h1 className="cm-brand-name">EnerLink</h1>
                        <span className="cm-brand-tag">CRM</span>
                    </div>
                    <div className="cm-header-actions">
                        <button className="cm-btn" onClick={() => navigate('/customers')}>
                            <Icon.Back />
                            <span>Customer List</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ---- MAIN ---- */}
            <main className="cm-main">
                {/* Hero */}
                <div className="cm-hero">
                    <div className="cm-hero-grid" aria-hidden="true" />
                    <div className="cm-hero-left">
                        <div className="cm-hero-icon" aria-hidden="true"><Icon.UserPlus /></div>
                        <div>
                            <h2 className="cm-hero-title">Add New Customer</h2>
                            <p className="cm-hero-subtitle">Fill in the details below to create a new customer record</p>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="cm-alert cm-alert-danger">
                        <Icon.AlertCircle /><span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="cm-alert cm-alert-success">
                        <Icon.CheckCircle /><span>{success}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="cm-form-card">

                        {/* Basic Information */}
                        <div className="cm-form-section">
                            <h3 className="cm-form-section-title"><Icon.User />Basic Information</h3>
                            <div className="cm-form-grid cm-form-grid-2">
                                <div className="cm-form-group">
                                    <label className="cm-form-label cm-form-label-required">Company Name</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="company"
                                        value={form.company}
                                        onChange={handleChange}
                                        placeholder="Enter company name"
                                        required
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label cm-form-label-required">Email Address</label>
                                    <input
                                        className="cm-form-input"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">NIP (Tax Number)</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="nip"
                                        value={form.nip || ''}
                                        onChange={handleChange}
                                        placeholder="Enter NIP"
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Phone Number</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="phone"
                                        value={form.phone || ''}
                                        onChange={handleChange}
                                        placeholder="Enter phone"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="cm-form-section">
                            <h3 className="cm-form-section-title"><Icon.MapPin />Address Information</h3>
                            <div className="cm-form-grid cm-form-grid-4" style={{ marginBottom: '16px' }}>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Street Name</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.street_name"
                                        value={form.address?.street_name || ''}
                                        onChange={handleChange}
                                        placeholder="Street name"
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Building No.</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.building_number"
                                        value={form.address?.building_number || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. 123"
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Apartment No.</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.apartment_number"
                                        value={form.address?.apartment_number || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. 4A"
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Postal Code</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.postal_code"
                                        value={form.address?.postal_code || ''}
                                        onChange={handleChange}
                                        placeholder="00-000"
                                    />
                                </div>
                            </div>
                            <div className="cm-form-grid cm-form-grid-3">
                                <div className="cm-form-group">
                                    <label className="cm-form-label">City</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.city"
                                        value={form.address?.city || ''}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Province</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.province"
                                        value={form.address?.province || ''}
                                        onChange={handleChange}
                                        placeholder="Enter province"
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Country</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.country"
                                        value={form.address?.country || ''}
                                        onChange={handleChange}
                                        placeholder="Enter country"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="cm-form-section">
                            <h3 className="cm-form-section-title"><Icon.FileText />Additional Information</h3>
                            <div className="cm-form-group">
                                <label className="cm-form-label">Description</label>
                                <textarea
                                    className="cm-form-textarea"
                                    name="description"
                                    value={form.description || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter additional notes about the customer…"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="cm-form-actions">
                            <button className="cm-btn cm-btn-primary" type="submit" disabled={loading}>
                                {loading ? (
                                    <><span className="cm-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Adding…</>
                                ) : (
                                    <><Icon.Plus />Add Customer</>
                                )}
                            </button>
                            <button className="cm-btn cm-btn-ghost" type="button" onClick={() => navigate('/customers')} disabled={loading}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CustomerForm;
