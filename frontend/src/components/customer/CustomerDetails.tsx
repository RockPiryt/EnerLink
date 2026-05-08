import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, updateCustomer } from '../../services/customer/customerService';
import './Customer.css';

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
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
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
};

const CustomerDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<any | null>(null);
    const [form, setForm] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            setLoading(true);
            try {
                const data = await getCustomerById(id!);
                setCustomer(data);
                setForm(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!form) return;
        if (name.startsWith('address.')) {
            const addrField = name.replace('address.', '');
            setForm({ ...form, address: { ...form.address, [addrField]: value } });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSaving(true);
        try {
            await updateCustomer(id!, form);
            setSuccess('Customer updated successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="cm-page">
                <div className="cm-state-center" style={{ paddingTop: '120px' }}>
                    <div className="cm-spinner" />
                    <p className="cm-state-label">Loading customer details…</p>
                </div>
            </div>
        );
    }

    if (error && !form) {
        return (
            <div className="cm-page">
                <main className="cm-main">
                    <div className="cm-alert cm-alert-danger">
                        <Icon.AlertCircle />
                        <span>
                            {error}
                            <br />
                            <button className="cm-btn cm-btn-ghost" style={{ marginTop: '10px' }} onClick={() => navigate('/customers')}>
                                <Icon.Back /> Back to Customer Management
                            </button>
                        </span>
                    </div>
                </main>
            </div>
        );
    }

    if (!form) return null;

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
                        <div className="cm-hero-icon" aria-hidden="true"><Icon.Edit /></div>
                        <div>
                            <h2 className="cm-hero-title">Edit Customer</h2>
                            <p className="cm-hero-subtitle">{customer?.company || `${customer?.name} ${customer?.last_name}`}</p>
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
                                        value={form.company || ''}
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
                                        value={form.email || ''}
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
                                        name="address.building_nr"
                                        value={form.address?.building_nr || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. 123"
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Apartment No.</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.apartment_nr"
                                        value={form.address?.apartment_nr || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. 4A"
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label className="cm-form-label">Postal Code</label>
                                    <input
                                        className="cm-form-input"
                                        type="text"
                                        name="address.post_code"
                                        value={form.address?.post_code || ''}
                                        onChange={handleChange}
                                        placeholder="00-000"
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
                            <button className="cm-btn cm-btn-primary" type="submit" disabled={saving}>
                                {saving ? (
                                    <><span className="cm-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Saving…</>
                                ) : (
                                    <><Icon.Save />Save Changes</>
                                )}
                            </button>
                            <button className="cm-btn cm-btn-ghost" type="button" onClick={() => navigate('/customers')} disabled={saving}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CustomerDetails;
