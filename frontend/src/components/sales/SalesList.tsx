import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService, User } from '../../services/userService';
import '../provider/Provider.css';

const userService = new UserService();

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Headset: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3z"/><path d="M3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>
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
};

const SalesList: React.FC = () => {
  const [salesReps, setSalesReps] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const fetchSalesReps = async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers({
        per_page: 50,
        q: searchQuery.trim() || undefined,
      });
      const reps = (data.items || []).filter((u: User) =>
        u.role_name?.toLowerCase().includes('sales')
      );
      setSalesReps(reps);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSalesReps(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSalesReps(search);
  };

  const formatDate = (ds: string) =>
    new Date(ds).toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });

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
            <div className="pr-hero-icon" aria-hidden="true"><Icon.Headset /></div>
            <div>
              <h2 className="pr-hero-title">Sales Representatives</h2>
              <p className="pr-hero-subtitle">Sales team members</p>
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
              placeholder="Search by name, surname, username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {loading ? (
          <div className="pr-state-center">
            <span className="pr-spinner" />
            <p className="pr-state-label">Loading sales representatives…</p>
          </div>
        ) : (
          <>
            <p className="pr-results-info">{salesReps.length} sales representative{salesReps.length !== 1 ? 's' : ''} found</p>

            <div className="pr-table-card">
              <div className="pr-table-wrap">
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReps.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="pr-table-empty">
                            <div className="pr-table-empty-icon"><Icon.Headset /></div>
                            No sales representatives found.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      salesReps.map((rep) => (
                        <tr key={rep.id}>
                          <td><span className="pr-table-id">{rep.id}</span></td>
                          <td>{rep.username}</td>
                          <td className="pr-table-name">{rep.first_name} {rep.last_name}</td>
                          <td>{rep.email}</td>
                          <td>{rep.role_name}</td>
                          <td>
                            <span className={`pr-badge ${rep.active ? 'pr-badge-active' : 'pr-badge-inactive'}`}>
                              {rep.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{formatDate(rep.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SalesList;
