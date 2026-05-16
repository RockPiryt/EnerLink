import React, { useState } from 'react';
import '../components/provider/Provider.css';

interface AddTariffModalProps {
  show: boolean;
  onHide: () => void;
  onTariffAdded: () => void;
}

const Icon = {
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
};

const AddTariffModal: React.FC<AddTariffModalProps> = ({ show, onHide, onTariffAdded }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/tariffs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add tariff');
      }
      setName('');
      onTariffAdded();
      onHide();
    } catch {
      setError('Error adding tariff.');
    } finally {
      setLoading(false);
    }
  };

  const handleHide = () => { setName(''); setError(''); onHide(); };

  if (!show) return null;

  return (
    <div className="pr-modal-overlay" onClick={handleHide}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">Add Energy Tariff</h3>
          <button className="pr-modal-close" onClick={handleHide}><Icon.Close /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="pr-modal-body">
            {error && (
              <div className="pr-alert pr-alert-danger" style={{ marginBottom: 14 }}>
                <Icon.AlertCircle /><span>{error}</span>
              </div>
            )}
            <div className="pr-modal-form-group">
              <label className="pr-modal-form-label pr-modal-form-label-required">Tariff Name</label>
              <input
                className="pr-modal-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tariff name"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="pr-modal-footer">
            <button type="button" className="pr-btn pr-btn-ghost" onClick={handleHide} disabled={loading}>Cancel</button>
            <button type="submit" className="pr-btn pr-btn-primary" disabled={loading}>
              {loading
                ? <><span className="pr-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />Adding…</>
                : <><Icon.Plus />Add</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTariffModal;
