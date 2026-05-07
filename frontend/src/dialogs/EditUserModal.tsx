import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { RoleService } from '../services/roleService';
import { Role } from '../models/role';
import './Modal.css';

interface BackendUser {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role_name: string;
    active: boolean;
}

interface EditUserModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (updatedUser: Partial<BackendUser>) => void;
    user: BackendUser | null;
    loading?: boolean;
}

/* ----- Inline SVG icons ----- */
const I = {
    UserEdit: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M4 21v-2a4 4 0 0 1 4-4h4"/>
            <circle cx="10" cy="7" r="4"/>
            <path d="M18.5 12.5a2.121 2.121 0 0 1 3 3L17 20l-4 1 1-4 4.5-4.5z"/>
        </svg>
    ),
    Close: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    ),
    Save: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
    ),
    Alert: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    ),
    Info: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    ),
};

const EditUserModal: React.FC<EditUserModalProps> = ({
    show,
    onHide,
    onConfirm,
    user,
    loading = false,
}) => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        role_name: '',
        active: true,
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchRoles = async () => {
            setRolesLoading(true);
            try {
                const data = await new RoleService().getRoles();
                setRoles(data);
            } catch (e) {
                setRoles([]);
            } finally {
                setRolesLoading(false);
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role_name: user.role_name,
                active: user.active,
            });
            setErrors({});
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.role_name) newErrors.role_name = 'Role is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) onConfirm(formData);
    };

    const handleClose = () => {
        setFormData({
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            role_name: '',
            active: true,
        });
        setErrors({});
        onHide();
    };

    if (!user) return null;

    const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || 'U';

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            dialogClassName="elm-modal"
            backdrop={loading ? 'static' : true}
        >
            {/* ---------- HEADER ---------- */}
            <div className="elm-modal-header">
                <span className="elm-modal-header-icon" aria-hidden="true">
                    <I.UserEdit />
                </span>
                <div className="elm-modal-header-text">
                    <h5 className="elm-modal-title">Edit user</h5>
                    <p className="elm-modal-subtitle">Update account details and permissions</p>
                </div>
                <button
                    type="button"
                    className="elm-modal-close"
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Close"
                >
                    <I.Close />
                </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                {/* ---------- BODY ---------- */}
                <div className="elm-modal-body">
                    {/* Editing-info banner */}
                    <div className="elm-info-banner" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        marginBottom: 18,
                        background: 'linear-gradient(135deg, #eff6ff 0%, #ede9fe 100%)',
                        border: '1px solid #ddd6fe',
                        borderRadius: 12,
                        color: '#0047b3',
                    }}>
                        <span style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0066ff 0%, #7c3aed 100%)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 13,
                            flexShrink: 0,
                        }}>{initials}</span>
                        <div style={{ flex: 1, fontSize: 13.5, color: '#0f172a' }}>
                            You are editing&nbsp;
                            <strong>{user.first_name} {user.last_name}</strong>
                            <span style={{ color: '#64748b' }}> · {user.email}</span>
                        </div>
                    </div>

                    {/* First name + Last name */}
                    <div className="elm-form-row">
                        <div className="elm-field">
                            <label htmlFor="edit_first_name" className="elm-label">
                                First name <span className="required">*</span>
                            </label>
                            <input
                                id="edit_first_name"
                                name="first_name"
                                type="text"
                                className={`elm-input ${errors.first_name ? 'is-invalid' : ''}`}
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="First name"
                                disabled={loading}
                                autoComplete="given-name"
                            />
                            {errors.first_name && (
                                <div className="elm-feedback"><I.Alert />{errors.first_name}</div>
                            )}
                        </div>

                        <div className="elm-field">
                            <label htmlFor="edit_last_name" className="elm-label">
                                Last name <span className="required">*</span>
                            </label>
                            <input
                                id="edit_last_name"
                                name="last_name"
                                type="text"
                                className={`elm-input ${errors.last_name ? 'is-invalid' : ''}`}
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Last name"
                                disabled={loading}
                                autoComplete="family-name"
                            />
                            {errors.last_name && (
                                <div className="elm-feedback"><I.Alert />{errors.last_name}</div>
                            )}
                        </div>
                    </div>

                    {/* Username */}
                    <div className="elm-field">
                        <label htmlFor="edit_username" className="elm-label">
                            Username <span className="required">*</span>
                        </label>
                        <input
                            id="edit_username"
                            name="username"
                            type="text"
                            className={`elm-input ${errors.username ? 'is-invalid' : ''}`}
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            disabled={loading}
                            autoComplete="username"
                        />
                        {errors.username && (
                            <div className="elm-feedback"><I.Alert />{errors.username}</div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="elm-field">
                        <label htmlFor="edit_email" className="elm-label">
                            Email <span className="required">*</span>
                        </label>
                        <input
                            id="edit_email"
                            name="email"
                            type="email"
                            className={`elm-input ${errors.email ? 'is-invalid' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            disabled={loading}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <div className="elm-feedback"><I.Alert />{errors.email}</div>
                        )}
                    </div>

                    {/* Role */}
                    <div className="elm-field">
                        <label htmlFor="edit_role_name" className="elm-label">
                            Role <span className="required">*</span>
                        </label>
                        <select
                            id="edit_role_name"
                            name="role_name"
                            className={`elm-select ${errors.role_name ? 'is-invalid' : ''}`}
                            value={formData.role_name}
                            onChange={handleChange}
                            disabled={loading || rolesLoading}
                        >
                            <option value="">{rolesLoading ? 'Loading roles...' : 'Select role'}</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.role_name}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                        {errors.role_name && (
                            <div className="elm-feedback"><I.Alert />{errors.role_name}</div>
                        )}
                    </div>

                    {/* Active toggle */}
                    <div className="elm-field">
                        <label className="elm-switch-row">
                            <div className="info">
                                <div className="t">Active account</div>
                                <div className="d">When disabled, the user will not be able to sign in.</div>
                            </div>
                            <span className="elm-switch" aria-hidden="true">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <span className="track" />
                            </span>
                        </label>
                    </div>
                </div>

                {/* ---------- FOOTER ---------- */}
                <div className="elm-modal-footer">
                    <button type="button" className="elm-btn" onClick={handleClose} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="elm-btn elm-btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="elm-btn-spinner" aria-hidden="true" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <I.Save />
                                Save changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditUserModal;
