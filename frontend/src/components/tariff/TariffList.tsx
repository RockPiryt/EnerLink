import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteTariffModal from '../../dialogs/DeleteTariffModal';
import AddTariffModal from '../../dialogs/AddTariffModal';
import EditTariffModal from '../../dialogs/EditTariffModal';
import { TariffService } from '../../services/tariff/tariffService';
import '../provider/Provider.css';

interface Tariff {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13 21a2 2 0 0 1-2.83 0L3 13.83V3h10.83L21 10.17a2 2 0 0 1-.41 3.24z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
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
  ToggleOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="3" fill="currentColor"/></svg>
  ),
  ToggleOn: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3" fill="currentColor"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
};

interface TariffListProps {
  hideHeader?: boolean;
}

const TariffList: React.FC<TariffListProps> = ({ hideHeader = false }) => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTariffs, setTotalTariffs] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tariffToEdit, setTariffToEdit] = useState<Tariff | null>(null);
  const [tariffToDelete, setTariffToDelete] = useState<Tariff | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const tariffService = new TariffService();

  const loadTariffs = async (page = 1, search = '', active?: boolean) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('per_page', '20');
      if (search.trim()) params.append('q', search.trim());
      if (active !== undefined) params.append('active', active.toString());

      const data = await tariffService.getTariffs(params);

      if (data && data.items) {
        setTariffs(data.items);
        setTotalPages(data.pages || 1);
        setTotalTariffs(data.total || data.items.length);
      } else if (Array.isArray(data)) {
        let filtered = data as Tariff[];
        if (search.trim()) filtered = filtered.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
        if (active !== undefined) filtered = filtered.filter(t => t.is_active === active);
        setTariffs(filtered);
        setTotalTariffs(filtered.length);
        setTotalPages(Math.max(1, Math.ceil(filtered.length / 20)));
      }
      setCurrentPage(page);
    } catch {
      setError('Error loading tariffs.');
      setTariffs([]);
      setTotalTariffs(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTariffs(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadTariffs(1, searchQuery, activeFilter);
  };

  const handleFilterChange = (active?: boolean) => {
    setActiveFilter(active);
    setCurrentPage(1);
    loadTariffs(1, searchQuery, active);
  };

  const handleToggleActive = async (tariffId: number, current: boolean) => {
    try {
      const response = await fetch(`http://localhost:8080/api/supplier/tariffs/${tariffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !current }),
      });
      if (!response.ok) throw new Error();
      setSuccess(`Tariff ${!current ? 'activated' : 'deactivated'} successfully!`);
      loadTariffs(currentPage, searchQuery, activeFilter);
    } catch {
      setError('Error updating tariff status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!tariffToDelete) return;
    setDeleteLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/supplier/tariffs/${tariffToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setSuccess('Tariff deleted successfully!');
      setShowDeleteModal(false);
      setTariffToDelete(null);
      loadTariffs(currentPage, searchQuery, activeFilter);
    } catch {
      setError('Error deleting tariff.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (ds: string) =>
    new Date(ds).toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="pr-page">
      {/* ---- HEADER ---- */}
      {!hideHeader && (
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
                <Icon.Plus /><span>Add Tariff</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ---- MAIN ---- */}
      <main className="pr-main">
        {/* Hero */}
        <div className="pr-hero">
          <div className="pr-hero-grid" aria-hidden="true" />
          <div className="pr-hero-left">
            <div className="pr-hero-icon" aria-hidden="true"><Icon.Tag /></div>
            <div>
              <h2 className="pr-hero-title">Energy Tariff Management</h2>
              <p className="pr-hero-subtitle">Manage tariffs and their active status</p>
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
              placeholder="Search tariffs by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="pr-filter-group">
            <button className={`pr-filter-btn ${activeFilter === undefined ? 'active-all' : ''}`} onClick={() => handleFilterChange(undefined)}>All</button>
            <button className={`pr-filter-btn ${activeFilter === true ? 'active-yes' : ''}`} onClick={() => handleFilterChange(true)}>Active</button>
            <button className={`pr-filter-btn ${activeFilter === false ? 'active-no' : ''}`} onClick={() => handleFilterChange(false)}>Inactive</button>
          </div>
        </div>

        {loading ? (
          <div className="pr-state-center">
            <span className="pr-spinner" />
            <p className="pr-state-label">Loading tariffs…</p>
          </div>
        ) : (
          <>
            <p className="pr-results-info">Showing {tariffs.length} of {totalTariffs} tariffs</p>

            <div className="pr-table-card">
              <div className="pr-table-wrap">
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffs.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="pr-table-empty">
                            <div className="pr-table-empty-icon"><Icon.Tag /></div>
                            No tariffs found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      tariffs.map((tariff) => (
                        <tr key={tariff.id}>
                          <td><span className="pr-table-id">{tariff.id}</span></td>
                          <td className="pr-table-name">{tariff.name}</td>
                          <td>
                            <span className={`pr-badge ${tariff.is_active ? 'pr-badge-active' : 'pr-badge-inactive'}`}>
                              {tariff.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{formatDate(tariff.created_at)}</td>
                          <td>
                            <div className="pr-row-actions">
                              <button
                                className="pr-action-btn"
                                onClick={() => { setTariffToEdit(tariff); setShowEditModal(true); }}
                              >
                                <Icon.Edit />Edit
                              </button>
                              <button
                                className={`pr-action-btn ${tariff.is_active ? 'pr-action-btn-warning' : 'pr-action-btn-success'}`}
                                onClick={() => handleToggleActive(tariff.id, tariff.is_active)}
                              >
                                {tariff.is_active
                                  ? <><Icon.ToggleOff />Deactivate</>
                                  : <><Icon.ToggleOn />Activate</>}
                              </button>
                              <button
                                className="pr-action-btn pr-action-btn-danger"
                                onClick={() => { setTariffToDelete(tariff); setShowDeleteModal(true); }}
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
                    onClick={() => loadTariffs(currentPage - 1, searchQuery, activeFilter)}>
                    <Icon.ChevronLeft />
                  </button>
                  <span className="pr-page-info">Page {currentPage} of {totalPages}</span>
                  <button className="pr-page-btn" disabled={currentPage >= totalPages}
                    onClick={() => loadTariffs(currentPage + 1, searchQuery, activeFilter)}>
                    <Icon.ChevronRight />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ---- MODALS ---- */}
      <AddTariffModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onTariffAdded={() => { setSuccess('Tariff added successfully!'); loadTariffs(currentPage, searchQuery, activeFilter); }}
      />
      {tariffToEdit && (
        <EditTariffModal
          show={showEditModal}
          onHide={() => { setShowEditModal(false); setTariffToEdit(null); }}
          tariff={tariffToEdit}
          onTariffEdited={() => { setSuccess('Tariff updated successfully!'); loadTariffs(currentPage, searchQuery, activeFilter); }}
        />
      )}
      {tariffToDelete && (
        <DeleteTariffModal
          show={showDeleteModal}
          onHide={() => { setShowDeleteModal(false); setTariffToDelete(null); }}
          tariffName={tariffToDelete.name}
          loading={deleteLoading}
          error={error}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default TariffList;
