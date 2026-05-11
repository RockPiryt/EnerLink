import React, { useState, useEffect } from 'react';
import '../components/provider/Provider.css';

interface Tariff {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface EditTariffModalProps {
  show: boolean;
  onHide: () => void;
  tariff: Tariff | null;
  onTariffEdited: () => void;
}

const Icon = {
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
};

const EditTariffModal: React.FC<EditTariffModalProps> = ({ show, onHide, tariff, onTariffEdited }) => {
  const [name, setName] = useState(tariff?.name || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setName(tariff?.name || ''); }, [tariff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!tariff) return;
      const response = await fetch(`http://localhost:8080/api/supplier/tariffs/${tariff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update tariff');
      }
      onTariffEdited();
      onHide();
    } catch {
      setError('Error updating tariff.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="pr-modal-overlay" onClick={onHide}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">Edit Energy Tariff</h3>
          <button className="pr-modal-close" onClick={onHide}><Icon.Close /></button>
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
            <button type="button" className="pr-btn pr-btn-ghost" onClick={onHide} disabled={loading}>Cancel</button>
            <button type="submit" className="pr-btn pr-btn-primary" disabled={loading}>
              {loading
                ? <><span className="pr-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />Saving…</>
                : <><Icon.Save />Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTariffModal;
