import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminService } from '../../services/admin/adminService';
import DeleteUserModal from '../../dialogs/DeleteModal';
import EditUserModal from '../../dialogs/EditUserModal';
import AddUserModal from '../../dialogs/AddUserModal';
import { User } from '../../models/user';
import RoleList from '../role/RoleList';
import SyncCountriesPanel from './SyncCountriesPanel';
import { SyncCitiesPanel, SyncProvincesPanel } from './SyncCitiesProvincesPanel';
import SyncPostcodesPanel from './SyncPostcodesPanel';
import './AdminPanel.css';

/* ----------------- Inline SVG icons ----------------- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  ),
  Report: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  ChartBar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
};

const AdminPanel: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'settings'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const adminService = new AdminService();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      const userData = response?.data;
      setUsers(userData);
      setError('');
    } catch (err) {
      setError('Error fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role_name !== 'Administrator') return <Navigate to="/dashboard" replace />;

  const handleDeleteClick = (userToDelete: User) => {
    setSelectedUser(userToDelete);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      await adminService.deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleEditClick = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    setShowEditModal(true);
  };

  const handleConfirmEdit = async (updatedUser: Partial<User>) => {
    if (!selectedUser) return;
    setEditLoading(true);
    try {
      await adminService.updateUser(selectedUser.id, updatedUser);
      setShowEditModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleConfirmAdd = async (userData: any) => {
    setAddLoading(true);
    try {
      await adminService.addUser(userData);
      setShowUserModal(false);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const initialsOf = (u: User) =>
    `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase() || 'U';

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const inactiveUsers = users.filter((u) => !u.active).length;
  const distinctRoles = new Set(users.map((u) => u.role_name)).size;

  return (
    <div className="admin-page">
      {/* ---------------- HEADER ---------------- */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <div className="admin-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
            <h1 className="admin-brand-name">EnerLink</h1>
            <span className="admin-brand-tag">Admin</span>
          </div>

          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => navigate('/dashboard')}>
              <Icon.Back />
              <span>Dashboard</span>
            </button>
            <button className="admin-btn admin-btn-danger" onClick={logout}>
              <Icon.Logout />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- MAIN ---------------- */}
      <main className="admin-main">
        {/* Hero */}
        <section className="admin-hero">
          <div className="admin-hero-grid" aria-hidden="true" />
          <div className="admin-hero-eyebrow">
            <span className="dot" />
            Administrator panel
          </div>
          <h2 className="admin-hero-title">
            Manage the <span className="accent">EnerLink system</span>
          </h2>
          <p className="admin-hero-subtitle">
            Create user accounts, define roles and manage system settings —
            all in one place.
          </p>
        </section>

        {/* Stat cards */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon stat-blue"><Icon.Users /></div>
            <div className="admin-stat-body">
              <p className="admin-stat-value">{totalUsers}</p>
              <p className="admin-stat-label">Total users</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon stat-green"><Icon.Check /></div>
            <div className="admin-stat-body">
              <p className="admin-stat-value">{activeUsers}</p>
              <p className="admin-stat-label">Active</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon stat-amber"><Icon.X /></div>
            <div className="admin-stat-body">
              <p className="admin-stat-value">{inactiveUsers}</p>
              <p className="admin-stat-label">Inactive</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon stat-cyan"><Icon.Shield /></div>
            <div className="admin-stat-body">
              <p className="admin-stat-value">{distinctRoles}</p>
              <p className="admin-stat-label">User roles</p>
            </div>
          </div>
        </section>

        {/* Tabs panel */}
        <section className="admin-panel">
          <div className="admin-panel-body">
            <div className="admin-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'users'}
                className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Icon.Users /> Users
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'roles'}
                className={`admin-tab ${activeTab === 'roles' ? 'active' : ''}`}
                onClick={() => setActiveTab('roles')}
              >
                <Icon.Shield /> Roles
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'settings'}
                className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Icon.Settings /> Settings
              </button>
            </div>

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <>
                <div className="admin-section-bar">
                  <div>
                    <h3>User management</h3>
                    <span className="subtitle">List of every account in the system</span>
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={() => setShowUserModal(true)}>
                    <Icon.Plus />
                    <span>Add user</span>
                  </button>
                </div>

                {error && (
                  <div className="admin-alert" role="alert">
                    <Icon.Alert />
                    <span>{error}</span>
                  </div>
                )}

                {loading ? (
                  <div className="admin-loading">
                    <div className="admin-spinner" />
                    <p>Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="admin-empty">
                    <p>No users to display.</p>
                  </div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td><span className="admin-table-id">{String(u.id).slice(0, 8)}</span></td>
                            <td>
                              <div className="admin-user-cell">
                                <span className="admin-user-cell-avatar" aria-hidden="true">{initialsOf(u)}</span>
                                <span className="admin-user-cell-name">{u.first_name} {u.last_name}</span>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td><span className="admin-badge admin-badge-role">{u.role_name}</span></td>
                            <td>
                              <span className={`admin-badge ${u.active ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                                {u.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="admin-row-actions">
                                <button className="admin-action-btn admin-action-btn-edit" onClick={() => handleEditClick(u)}>
                                  <Icon.Edit /> Edit
                                </button>
                                <button className="admin-action-btn admin-action-btn-delete" onClick={() => handleDeleteClick(u)}>
                                  <Icon.Trash /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* ROLES TAB */}
            {activeTab === 'roles' && <RoleList />}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <>
                <div className="admin-section-bar">
                  <div>
                    <h3>System settings</h3>
                    <span className="subtitle">Global preferences and notifications</span>
                  </div>
                </div>

                <div className="admin-settings-grid">
                  <div className="admin-settings-card">
                    <header>
                      <span className="icon"><Icon.Settings /></span>
                      <h6>General settings</h6>
                    </header>
                    <div className="body">
                      <div className="admin-field">
                        <label className="admin-label">System name</label>
                        <input className="admin-input" type="text" defaultValue="EnerLink System" />
                      </div>
                      <div className="admin-field">
                        <label className="admin-switch">
                          <input type="checkbox" />
                          <span className="track" />
                          Maintenance mode
                        </label>
                      </div>
                      <button className="admin-btn admin-btn-primary">
                        Save settings
                      </button>
                    </div>
                  </div>

                  <div className="admin-settings-card">
                    <header>
                      <span className="icon"><Icon.Bell /></span>
                      <h6>Notifications and alerts</h6>
                    </header>
                    <div className="body">
                      <div className="admin-field">
                        <label className="admin-label">Energy threshold (kW)</label>
                        <input className="admin-input" type="number" defaultValue={5} />
                      </div>
                      <div className="admin-field">
                        <label className="admin-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="track" />
                          Email notifications
                        </label>
                      </div>
                      <button className="admin-btn admin-btn-warning">
                        Update alerts
                      </button>
                    </div>
                  </div>
                </div>
                {/* Sync Countries, Provinces, Cities Panels */}
                <div className="admin-settings-grid">
                  <SyncCountriesPanel />
                  <SyncProvincesPanel />
                  <SyncCitiesPanel />
                   <SyncPostcodesPanel />
                </div>
              </>
            )}

          </div>
        </section>
      </main>

      {/* ---------------- MODALS ---------------- */}
      <AddUserModal
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        onConfirm={handleConfirmAdd}
        loading={addLoading}
      />

      <DeleteUserModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        userName={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ''}
        userEmail={selectedUser?.email || ''}
        loading={deleteLoading}
      />

      <EditUserModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onConfirm={handleConfirmEdit}
        user={selectedUser}
        loading={editLoading}
      />
    </div>
  );
};

export default AdminPanel;
