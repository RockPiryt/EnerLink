import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContractHistoryModal from './ContractHistoryModal';
import { getContractById, updateContract } from '../../services/contractService';
import { getCustomers, Customer } from '../../services/customer/customerService';
import './Contract.css';

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  History: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13 21a2 2 0 0 1-2.83 0L3 13.83V3h10.83L21 10.17a2 2 0 0 1-.41 3.24z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
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
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
};

const ContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<any | null>(null);
  const [form, setForm] = useState<any | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getContractById(id!);
        setContract(data);
        setForm(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

      setCustomersLoading(true);
      try {
        const response = await getCustomers();
        const items = Array.isArray(response.data) ? response.data : (response.data?.items ?? []);
        setCustomers(items);
      } catch {
        setCustomers([]);
      } finally {
        setCustomersLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!form) return;
    setForm({ ...form, [name]: name === 'id_customer' ? parseInt(value, 10) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await updateContract(id!, form);
      setSuccess('Contract updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="co-page">
        <div className="co-state-center" style={{ paddingTop: '120px' }}>
          <span className="co-spinner" />
          <p className="co-state-label">Loading contract details…</p>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="co-page">
        <main className="co-main">
          <div className="co-alert co-alert-danger">
            <Icon.AlertCircle />
            <span>
              {error}
              <br />
              <button className="co-btn co-btn-ghost" style={{ marginTop: '10px' }} onClick={() => navigate('/contracts')}>
                <Icon.Back /> Back to Contract List
              </button>
            </span>
          </div>
        </main>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="co-page">
      {/* ---- HEADER ---- */}
      <header className="co-header">
        <div className="co-header-inner">
          <div className="co-brand">
            <div className="co-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
            <h1 className="co-brand-name">EnerLink</h1>
            <span className="co-brand-tag">CRM</span>
          </div>
          <div className="co-header-actions">
            <button className="co-btn" onClick={() => navigate('/contracts')}>
              <Icon.Back /><span>Contract List</span>
            </button>
            <button className="co-btn co-btn-secondary" onClick={() => setShowHistory(true)}>
              <Icon.History /><span>Change History</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---- MAIN ---- */}
      <main className="co-main">
        {/* Hero */}
        <div className="co-hero">
          <div className="co-hero-grid" aria-hidden="true" />
          <div className="co-hero-left">
            <div className="co-hero-icon" aria-hidden="true"><Icon.Edit /></div>
            <div>
              <h2 className="co-hero-title">Edit Contract</h2>
              <p className="co-hero-subtitle">{contract?.contract_number}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="co-alert co-alert-danger">
            <Icon.AlertCircle /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="co-alert co-alert-success">
            <Icon.CheckCircle /><span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="co-form-card">

            {/* Contract Information */}
            <div className="co-form-section">
              <h3 className="co-form-section-title"><Icon.FileText />Contract Information</h3>
              <div className="co-form-grid co-form-grid-2">
                <div className="co-form-group">
                  <label className="co-form-label co-form-label-required">Customer</label>
                  <select
                    className="co-form-select"
                    name="id_customer"
                    value={form.id_customer || ''}
                    onChange={handleChange}
                    required
                    disabled={customersLoading}
                  >
                    <option value="">
                      {customersLoading ? 'Loading customers…' : 'Select customer'}
                    </option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company || c.name || `ID: ${c.id}`}
                      </option>
                    ))}
                  </select>
                  {customersLoading && (
                    <span className="co-form-hint" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="co-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />
                      Loading customers…
                    </span>
                  )}
                </div>
                <div className="co-form-group">
                  <label className="co-form-label co-form-label-required">Contract Number</label>
                  <input
                    className="co-form-input"
                    type="text"
                    name="contract_number"
                    value={form.contract_number || ''}
                    onChange={handleChange}
                    placeholder="e.g. CNTR-2025-001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contract Dates */}
            <div className="co-form-section">
              <h3 className="co-form-section-title"><Icon.Calendar />Contract Dates</h3>
              <div className="co-form-grid co-form-grid-3">
                <div className="co-form-group">
                  <label className="co-form-label">Signed At</label>
                  <input
                    className="co-form-input"
                    type="date"
                    name="signed_at"
                    value={form.signed_at || ''}
                    onChange={handleChange}
                  />
                  <span className="co-form-hint">Date when the contract was signed</span>
                </div>
                <div className="co-form-group">
                  <label className="co-form-label">Valid From</label>
                  <input
                    className="co-form-input"
                    type="date"
                    name="contract_from"
                    value={form.contract_from || ''}
                    onChange={handleChange}
                  />
                  <span className="co-form-hint">Contract start date</span>
                </div>
                <div className="co-form-group">
                  <label className="co-form-label">Valid To</label>
                  <input
                    className="co-form-input"
                    type="date"
                    name="contract_to"
                    value={form.contract_to || ''}
                    onChange={handleChange}
                  />
                  <span className="co-form-hint">Contract end date (optional)</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="co-form-section">
              <h3 className="co-form-section-title"><Icon.Tag />Contract Status</h3>
              <div className="co-form-grid co-form-grid-2">
                <div className="co-form-group">
                  <label className="co-form-label">Status</label>
                  <select
                    className="co-form-select"
                    name="status"
                    value={form.status || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select status</option>
                    <option value="Signed">Signed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <span className="co-form-hint">Current status of the contract</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="co-form-actions">
              <button className="co-btn co-btn-primary" type="submit" disabled={saving}>
                {saving ? (
                  <><span className="co-spinner" style={{ width: 16, height: 16, borderWidth: 2, margin: 0, display: 'inline-block' }} />Saving…</>
                ) : (
                  <><Icon.Save />Save Changes</>
                )}
              </button>
              <button className="co-btn co-btn-ghost" type="button" onClick={() => navigate('/contracts')} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* History modal */}
      {form && form.id && (
        <ContractHistoryModal
          contractId={form.id}
          show={showHistory}
          onHide={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default ContractDetails;
