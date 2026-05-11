import React, { useState } from 'react';
import { RoleService } from '../services/roleService';
import '../components/provider/Provider.css';

interface AddRoleModalProps {
  show: boolean;
  onHide: () => void;
  onRoleAdded: () => void;
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

const AddRoleModal: React.FC<AddRoleModalProps> = ({ show, onHide, onRoleAdded }) => {
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await new RoleService().addRole({ role_name: roleName });
      setRoleName('');
      onRoleAdded();
      onHide();
    } catch {
      setError('Error while adding role.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setRoleName(''); setError(''); onHide(); };

  if (!show) return null;

  return (
    <div className="pr-modal-overlay" onClick={handleClose}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">Add Role</h3>
          <button className="pr-modal-close" onClick={handleClose}><Icon.Close /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="pr-modal-body">
            {error && (
              <div className="pr-alert pr-alert-danger" style={{ marginBottom: 14 }}>
                <Icon.AlertCircle /><span>{error}</span>
              </div>
            )}
            <div className="pr-modal-form-group">
              <label className="pr-modal-form-label pr-modal-form-label-required">Role Name</label>
              <input
                className="pr-modal-form-input"
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="pr-modal-footer">
            <button type="button" className="pr-btn pr-btn-ghost" onClick={handleClose} disabled={loading}>Cancel</button>
            <button type="submit" className="pr-btn pr-btn-primary" disabled={loading || !roleName.trim()}>
              {loading
                ? <><span className="pr-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />Saving…</>
                : <><Icon.Save />Add Role</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;
