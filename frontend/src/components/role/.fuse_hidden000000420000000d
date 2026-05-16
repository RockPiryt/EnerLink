import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../models/role';
import { RoleService } from '../../services/roleService';
import '../provider/Provider.css';

const roleService = new RoleService();

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
};

/* ---- Add Role Modal ---- */
interface AddRoleModalProps {
  show: boolean;
  onHide: () => void;
  onRoleAdded: () => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ show, onHide, onRoleAdded }) => {
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await roleService.addRole({ role_name: roleName });
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

/* ---- Edit Role Modal ---- */
interface EditRoleModalProps {
  show: boolean;
  onHide: () => void;
  role: Role;
  onRoleUpdated: () => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ show, onHide, role, onRoleUpdated }) => {
  const [roleName, setRoleName] = useState(role.role_name);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setRoleName(role.role_name); setError(''); }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await roleService.editRole(role.id, { role_name: roleName });
      onRoleUpdated();
      onHide();
    } catch {
      setError('Error while editing role.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="pr-modal-overlay" onClick={onHide}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">Edit Role</h3>
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
            <button type="button" className="pr-btn pr-btn-ghost" onClick={onHide} disabled={loading}>Cancel</button>
            <button type="submit" className="pr-btn pr-btn-primary" disabled={loading || !roleName.trim()}>
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

/* ---- Delete Role Modal ---- */
interface DeleteRoleModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  roleName: string;
  loading: boolean;
  error: string;
}

const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({ show, onHide, onConfirm, roleName, loading, error }) => {
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

/* ---- Main Component ---- */
const PAGE_SIZE = 20;

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRoles, setTotalRoles] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const navigate = useNavigate();

  const loadRoles = async (page = 1, search = '', active?: boolean) => {
    setLoading(true);
    setError('');
    try {
      const data = await roleService.getRoles();
      let filtered = data;
      if (search.trim()) {
        filtered = filtered.filter((r) =>
          r.role_name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (active !== undefined) {
        filtered = filtered.filter((r) => r.active === active);
      }
      setTotalRoles(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
      setRoles(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
      setCurrentPage(page);
    } catch {
      setError('Error while fetching roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRoles(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRoles(1, searchQuery, activeFilter);
  };

  const handleFilterChange = (active?: boolean) => {
    setActiveFilter(active);
    loadRoles(1, searchQuery, active);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await roleService.deleteRole(roleToDelete.id);
      setShowDeleteModal(false);
      setRoleToDelete(null);
      setSuccess('Role deleted successfully.');
      loadRoles(currentPage, searchQuery, activeFilter);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setDeleteError('Error while deleting role.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleModalSuccess = () => {
    setSuccess('Operation completed successfully.');
    loadRoles(currentPage, searchQuery, activeFilter);
    setTimeout(() => setSuccess(''), 3000);
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
            <button className="pr-btn" onClick={() => navigate('/dashboard')}>
              <Icon.Back /><span>Dashboard</span>
            </button>
            <button className="pr-btn pr-btn-primary" onClick={() => setShowAddModal(true)}>
              <Icon.Plus /><span>Add Role</span>
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
            <div className="pr-hero-icon" aria-hidden="true"><Icon.Shield /></div>
            <div>
              <h2 className="pr-hero-title">Role Management</h2>
              <p className="pr-hero-subtitle">Role definitions and assigned permissions</p>
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

        {/* Toolbar */}
        <div className="pr-toolbar">
          <form className="pr-search-wrap" onSubmit={handleSearch}>
            <span className="pr-search-icon" aria-hidden="true"><Icon.Search /></span>
            <input
              className="pr-search-input"
              type="text"
              placeholder="Search roles by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="pr-filter-group">
            <button
              className={`pr-filter-btn${activeFilter === undefined ? ' active' : ''}`}
              onClick={() => handleFilterChange(undefined)}
            >All</button>
            <button
              className={`pr-filter-btn${activeFilter === true ? ' active' : ''}`}
              onClick={() => handleFilterChange(true)}
            >Active</button>
            <button
              className={`pr-filter-btn${activeFilter === false ? ' active' : ''}`}
              onClick={() => handleFilterChange(false)}
            >Inactive</button>
          </div>
        </div>

        {loading ? (
          <div className="pr-state-center">
            <span className="pr-spinner" />
            <p className="pr-state-label">Loading roles…</p>
          </div>
        ) : (
          <>
            <p className="pr-results-info">Showing {roles.length} of {totalRoles} role{totalRoles !== 1 ? 's' : ''}</p>

            <div className="pr-table-card">
              <div className="pr-table-wrap">
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Role Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          <div className="pr-table-empty">
                            <div className="pr-table-empty-icon"><Icon.Shield /></div>
                            No roles found.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      roles.map((role) => (
                        <tr key={role.id}>
                          <td><span className="pr-table-id">{role.id}</span></td>
                          <td className="pr-table-name">
                            <span className="pr-badge" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.2)' }}>
                              {role.role_name}
                            </span>
                          </td>
                          <td>
                            <span className={`pr-badge ${role.active ? 'pr-badge-active' : 'pr-badge-inactive'}`}>
                              {role.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="pr-row-actions">
                              <button
                                className="pr-action-btn"
                                onClick={() => handleEditRole(role)}
                              >
                                <Icon.Edit />Edit
                              </button>
                              <button
                                className="pr-action-btn pr-action-btn-danger"
                                onClick={() => handleDeleteRole(role)}
                              >
                                <Icon.Trash />Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pr-pagination">
                  <button className="pr-page-btn" disabled={currentPage <= 1}
                    onClick={() => loadRoles(currentPage - 1, searchQuery, activeFilter)}>
                    <Icon.ChevronLeft />
                  </button>
                  <span className="pr-page-info">Page {currentPage} of {totalPages}</span>
                  <button className="pr-page-btn" disabled={currentPage >= totalPages}
                    onClick={() => loadRoles(currentPage + 1, searchQuery, activeFilter)}>
                    <Icon.ChevronRight />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ---- MODALS ---- */}
      <AddRoleModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onRoleAdded={handleModalSuccess}
      />
      {selectedRole && (
        <EditRoleModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          role={selectedRole}
          onRoleUpdated={handleModalSuccess}
        />
      )}
      <DeleteRoleModal
        show={showDeleteModal}
        onHide={() => { setShowDeleteModal(false); setRoleToDelete(null); }}
        onConfirm={handleConfirmDelete}
        roleName={roleToDelete?.role_name || ''}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
};

export default RoleList;
