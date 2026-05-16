import React from 'react';
import '../components/provider/Provider.css';

interface DeleteRoleModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  roleName: string;
  loading?: boolean;
  error?: string;
}

const Icon = {
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
  ),
};

const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  show, onHide, onConfirm, roleName, loading = false, error = ''
}) => {
  if (!show) return null;

  return (
    <div className="pr-modal-overlay" onClick={onHide}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">Delete Role</h3>
          <button className="pr-modal-close" onClick={onHide}><Icon.Close /></button>
        </div>
        <div className="pr-modal-body">
          {error && (
            <div className="pr-alert pr-alert-danger" style={{ marginBottom: 14 }}>
              <Icon.AlertCircle /><span>{error}</span>
            </div>
          )}
          <p>Are you sure you want to delete role <strong>"{roleName}"</strong>?</p>
          <p><small>This action cannot be undone.</small></p>
        </div>
        <div className="pr-modal-footer">
          <button className="pr-btn pr-btn-ghost" onClick={onHide} disabled={loading}>Cancel</button>
          <button className="pr-btn pr-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading
              ? <><span className="pr-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />Deleting…</>
              : <><Icon.Trash />Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
