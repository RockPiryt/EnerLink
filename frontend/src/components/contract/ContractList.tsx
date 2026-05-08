import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contract, getContracts, deleteContract } from '../../services/contractService';
import './Contract.css';

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
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
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
};

const STATUS_OPTIONS = [
  { value: 'all',       label: 'All',       cls: 'active-all' },
  { value: 'active',    label: 'Active',    cls: 'active-active' },
  { value: 'pending',   label: 'Pending',   cls: 'active-pending' },
  { value: 'expired',   label: 'Expired',   cls: 'active-expired' },
  { value: 'cancelled', label: 'Cancelled', cls: 'active-cancelled' },
];

const getStatusClass = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case 'signed':    return 'co-badge-signed';
    case 'active':    return 'co-badge-active';
    case 'pending':   return 'co-badge-pending';
    case 'expired':   return 'co-badge-expired';
    case 'cancelled': return 'co-badge-cancelled';
    default:          return 'co-badge-unknown';
  }
};

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContracts, setTotalContracts] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const loadContracts = async (page = 1, search = '', status = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContracts({
        page,
        per_page: 20,
        q: search.trim() || undefined,
        status: status && status !== 'all' ? status : undefined,
      });
      console.log('API response:', data);
      const items = Array.isArray(data) ? data : (data.items ?? []);
      setContracts(items);
      setTotalPages(data.pages ?? 1);
      setTotalContracts(data.total ?? items.length);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContracts(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadContracts(1, searchQuery, statusFilter);
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadContracts(1, searchQuery, status);
  };

  const handleDeleteContract = async () => {
    if (!contractToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteContract(contractToDelete.id);
      loadContracts(currentPage, searchQuery, statusFilter);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
      setShowConfirm(false);
      setContractToDelete(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="co-page">
      {/* ---- HEADER ---- */}
      <header className="co-header">
        <div className="co-header-inner">
          <div className="co-brand">
            <div className="co-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
            <h1 className="co-brand-name">EnerLink</h1>
            <span className="co-brand-tag">CRM</span>
          </div>
          <div className="co-header-actions">
            <button className="co-btn" onClick={() => navigate('/dashboard')}>
              <Icon.Back /><span>Dashboard</span>
            </button>
            <button className="co-btn co-btn-primary" onClick={() => navigate('/contracts/new')}>
              <Icon.Plus /><span>Add Contract</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---- MAIN ---- */}
      <main className="co-main">
        {/* Hero */}
        <div className="co-hero">
          <div className="co-hero-grid" aria-hidden="true" />
          <div className="co-hero-left">
            <div className="co-hero-icon" aria-hidden="true"><Icon.FileText /></div>
            <div>
              <h2 className="co-hero-title">Contract Management</h2>
              <p className="co-hero-subtitle">Manage contracts and their statuses</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="co-alert co-alert-danger">
            <Icon.AlertCircle /><span>{error}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="co-toolbar">
          <form className="co-search-wrap" onSubmit={handleSearch}>
            <span className="co-search-icon" aria-hidden="true"><Icon.Search /></span>
            <input
              className="co-search-input"
              type="text"
              placeholder="Search by contract number or customer…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="co-filter-group">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`co-filter-btn ${statusFilter === opt.value ? opt.cls : ''}`}
                onClick={() => handleFilterChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="co-state-center">
            <span className="co-spinner" />
            <p className="co-state-label">Loading contracts…</p>
          </div>
        ) : (
          <>
            <p className="co-results-info">
              Showing {contracts.length} of {totalContracts} contracts
            </p>

            <div className="co-table-card">
              <div className="co-table-wrap">
                <table className="co-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Contract Number</th>
                      <th>Customer</th>
                      <th>Signed At</th>
                      <th>Valid From</th>
                      <th>Valid To</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.length === 0 ? (
                      <tr>
                        <td colSpan={8}>
                          <div className="co-table-empty">
                            <div className="co-table-empty-icon"><Icon.FileText /></div>
                            No contracts found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      contracts.map((contract) => (
                        <tr key={contract.id}>
                          <td><span className="co-table-id">{contract.id}</span></td>
                          <td className="co-table-number">{contract.contract_number}</td>
                          <td>{contract.customer?.company || contract.customer?.name || '—'}</td>
                          <td>{formatDate(contract.signed_at)}</td>
                          <td>{formatDate(contract.contract_from)}</td>
                          <td>{formatDate(contract.contract_to)}</td>
                          <td>
                            <span className={`co-badge ${getStatusClass(contract.status)}`}>
                              {contract.status || 'Unknown'}
                            </span>
                          </td>
                          <td>
                            <div className="co-row-actions">
                              <button
                                className="co-action-btn"
                                onClick={() => navigate(`/contracts/${contract.id}`)}
                              >
                                <Icon.Edit />Edit
                              </button>
                              <button
                                className="co-action-btn co-action-btn-danger"
                                onClick={() => { setContractToDelete(contract); setShowConfirm(true); }}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="co-pagination">
                  <button
                    className="co-page-btn"
                    disabled={currentPage <= 1}
                    onClick={() => loadContracts(currentPage - 1, searchQuery, statusFilter)}
                  >
                    <Icon.ChevronLeft />
                  </button>
                  <span className="co-page-info">Page {currentPage} of {totalPages}</span>
                  <button
                    className="co-page-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => loadContracts(currentPage + 1, searchQuery, statusFilter)}
                  >
                    <Icon.ChevronRight />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ---- DELETE MODAL ---- */}
      {showConfirm && (
        <div className="co-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="co-modal" onClick={(e) => e.stopPropagation()}>
            <div className="co-modal-header">
              <h3 className="co-modal-title">Delete Contract</h3>
              <button className="co-modal-close" onClick={() => setShowConfirm(false)}>
                <Icon.Close />
              </button>
            </div>
            <div className="co-modal-body">
              Are you sure you want to delete contract{' '}
              <strong>"{contractToDelete?.contract_number}"</strong>?
              This action cannot be undone.
            </div>
            <div className="co-modal-footer">
              <button className="co-btn co-btn-ghost" onClick={() => setShowConfirm(false)} disabled={deleteLoading}>
                Cancel
              </button>
              <button className="co-btn co-btn-danger" onClick={handleDeleteContract} disabled={deleteLoading}>
                {deleteLoading ? (
                  <><span className="co-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />Deleting…</>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractList;
