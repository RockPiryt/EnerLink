import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService, User } from '../../services/userService';
import '../provider/Provider.css';

const userService = new UserService();

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
};

/* ---- Role badge color helper ---- */
const getRoleBadgeStyle = (roleName: string): React.CSSProperties => {
  switch (roleName?.toLowerCase()) {
    case 'administrator': return { background: 'rgba(239,68,68,0.1)', color: '#b91c1c', border: '1px solid rgba(239,68,68,0.2)' };
    case 'manager':       return { background: 'rgba(245,158,11,0.1)', color: '#b45309', border: '1px solid rgba(245,158,11,0.2)' };
    case 'analyst':       return { background: 'rgba(6,182,212,0.1)', color: '#0e7490', border: '1px solid rgba(6,182,212,0.2)' };
    case 'sales representative': return { background: 'rgba(16,185,129,0.1)', color: '#047857', border: '1px solid rgba(16,185,129,0.2)' };
    default:              return { background: 'rgba(100,116,139,0.1)', color: '#475569', border: '1px solid rgba(100,116,139,0.2)' };
  }
};

const formatDate = (ds: string) =>
  new Date(ds).toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const navigate = useNavigate();

  const loadUsers = async (page = 1, search = '', active?: boolean) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, per_page: 20 };
      if (search.trim()) params.q = search.trim();
      if (active !== undefined) params.active = active;

      const response = await userService.getUsers(params);
      setUsers(response.items);
      setTotalPages(response.pages);
      setTotalUsers(response.total);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(1, searchQuery, activeFilter);
  };

  const handleFilterChange = (active?: boolean) => {
    setActiveFilter(active);
    loadUsers(1, searchQuery, active);
  };

  const initialsOf = (u: User) =>
    `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase() || 'U';

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
          </div>
        </div>
      </header>

      {/* ---- MAIN ---- */}
      <main className="pr-main">
        {/* Hero */}
        <div className="pr-hero">
          <div className="pr-hero-grid" aria-hidden="true" />
          <div className="pr-hero-left">
            <div className="pr-hero-icon" aria-hidden="true"><Icon.Users /></div>
            <div>
              <h2 className="pr-hero-title">Users Management</h2>
              <p className="pr-hero-subtitle">All system accounts in one place</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="pr-alert pr-alert-danger">
            <Icon.AlertCircle /><span>{error}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="pr-toolbar">
          <form className="pr-search-wrap" onSubmit={handleSearch}>
            <span className="pr-search-icon" aria-hidden="true"><Icon.Search /></span>
            <input
              className="pr-search-input"
              type="text"
              placeholder="Search by name, username or email…"
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
            <p className="pr-state-label">Loading users…</p>
          </div>
        ) : (
          <>
            <p className="pr-results-info">Showing {users.length} of {totalUsers} user{totalUsers !== 1 ? 's' : ''}</p>

            <div className="pr-table-card">
              <div className="pr-table-wrap">
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="pr-table-empty">
                            <div className="pr-table-empty-icon"><Icon.Users /></div>
                            No users found.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td><span className="pr-table-id">{user.id}</span></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0066ff, #7c3aed)',
                                color: '#fff', fontSize: 12, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                              }}>{initialsOf(user)}</span>
                              <span className="pr-table-name">{user.first_name} {user.last_name}</span>
                            </div>
                          </td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className="pr-badge" style={getRoleBadgeStyle(user.role_name)}>
                              {user.role_name}
                            </span>
                          </td>
                          <td>
                            <span className={`pr-badge ${user.active ? 'pr-badge-active' : 'pr-badge-inactive'}`}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{formatDate(user.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pr-pagination">
                  <button className="pr-page-btn" disabled={currentPage <= 1}
                    onClick={() => loadUsers(currentPage - 1, searchQuery, activeFilter)}>
                    <Icon.ChevronLeft />
                  </button>
                  <span className="pr-page-info">Page {currentPage} of {totalPages}</span>
                  <button className="pr-page-btn" disabled={currentPage >= totalPages}
                    onClick={() => loadUsers(currentPage + 1, searchQuery, activeFilter)}>
                    <Icon.ChevronRight />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UsersList;
