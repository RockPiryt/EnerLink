import React from 'react';
import { Modal } from 'react-bootstrap';
import './Modal.css';

interface DeleteUserModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    userName: string;
    userEmail: string;
    loading?: boolean;
}

/* ----- Inline SVG icons ----- */
const I = {
    Warning: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    ),
    Close: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    ),
    Trash: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
    ),
    User: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    Mail: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    ),
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    show,
    onHide,
    onConfirm,
    userName,
    userEmail,
    loading = false,
}) => {
    const initials = (() => {
        const parts = userName.trim().split(/\s+/);
        const a = parts[0]?.[0] ?? '';
        const b = parts[1]?.[0] ?? '';
        return (a + b).toUpperCase() || 'U';
    })();

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            dialogClassName="elm-modal"
            backdrop={loading ? 'static' : true}
        >
            {/* ---------- HEADER (red gradient) ---------- */}
            <div className="elm-modal-header danger">
                <span className="elm-modal-header-icon" aria-hidden="true">
                    <I.Warning />
                </span>
                <div className="elm-modal-header-text">
                    <h5 className="elm-modal-title">Delete user</h5>
                    <p className="elm-modal-subtitle">This action is permanent and cannot be undone</p>
                </div>
                <button
                    type="button"
                    className="elm-modal-close"
                    onClick={onHide}
                    disabled={loading}
                    aria-label="Close"
                >
                    <I.Close />
                </button>
            </div>

            {/* ---------- BODY ---------- */}
            <div className="elm-modal-body">
                {/* Warning banner */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '14px 16px',
                    marginBottom: 18,
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 12,
                    color: '#991b1b',
                }}>
                    <span style={{ flexShrink: 0, color: '#dc2626', marginTop: 1 }} aria-hidden="true">
                        <I.Warning />
                    </span>
                    <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                        <strong style={{ display: 'block', marginBottom: 2, fontSize: 14 }}>
                            Warning: this cannot be undone
                        </strong>
                        Deleting a user will permanently remove all of their data
                        from the system, including any accounts, history and assignments.
                    </div>
                </div>

                <p style={{
                    fontSize: 14,
                    color: '#475569',
                    margin: '0 0 12px 0',
                }}>
                    Are you sure you want to delete the following user?
                </p>

                {/* User card */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 14,
                }}>
                    <span style={{
                        flexShrink: 0,
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 16,
                        letterSpacing: '0.02em',
                        boxShadow: '0 6px 14px rgba(239, 68, 68, 0.3)',
                    }}>{initials}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 14.5,
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: 2,
                        }}>
                            <span style={{ color: '#94a3b8', display: 'inline-flex' }} aria-hidden="true">
                                <I.User />
                            </span>
                            {userName || '—'}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 13,
                            color: '#64748b',
                        }}>
                            <span style={{ color: '#94a3b8', display: 'inline-flex' }} aria-hidden="true">
                                <I.Mail />
                            </span>
                            {userEmail || '—'}
                        </div>
                    </div>
                </div>

                <p style={{
                    fontSize: 12.5,
                    color: '#94a3b8',
                    marginTop: 14,
                    marginBottom: 0,
                    textAlign: 'center',
                }}>
                    Please confirm that you want to proceed with this deletion.
                </p>
            </div>

            {/* ---------- FOOTER ---------- */}
            <div className="elm-modal-footer">
                <button type="button" className="elm-btn" onClick={onHide} disabled={loading}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="elm-btn elm-btn-danger"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="elm-btn-spinner" aria-hidden="true" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <I.Trash />
                            Delete user
                        </>
                    )}
                </button>
            </div>
        </Modal>
    );
};

export default DeleteUserModal;
