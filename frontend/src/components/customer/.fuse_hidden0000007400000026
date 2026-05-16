import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer, getCustomers, deleteCustomer } from '../../services/customer/customerService';
import './Customer.css';

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
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
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
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

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCustomers, setTotalCustomers] = useState(0);

    const navigate = useNavigate();

    const loadCustomers = async (page: number = 1, search: string = '', active?: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCustomers({ page, per_page: 20, q: search.trim() || undefined, active });
            setCustomers(response.data);
            setTotalPages(response.data.pages || 1);
            setTotalCustomers(response.data.length);
            setCurrentPage(page);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadCustomers(); }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadCustomers(1, searchQuery, activeFilter);
    };

    const handleFilterChange = (active?: boolean) => {
        setActiveFilter(active);
        setCurrentPage(1);
        loadCustomers(1, searchQuery, active);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleDeleteCustomer = async () => {
        if (customerToDelete) {
            try {
                await deleteCustomer(customerToDelete.id);
                loadCustomers(currentPage, searchQuery, activeFilter);
            } catch (err: any) {
                setError(err.message);
            }
        }
        setShowConfirm(false);
        setCustomerToDelete(null);
    };

    return (
        <div className="cm-page">
            {/* ---- HEADER ---- */}
            <header className="cm-header">
                <div className="cm-header-inner">
                    <div className="cm-brand">
                        <div className="cm-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
                        <h1 className="cm-brand-name">EnerLink</h1>
                        <span className="cm-brand-tag">CRM</span>
                    </div>
                    <div className="cm-header-actions">
                        <button className="cm-btn" onClick={() => navigate('/dashboard')}>
                            <Icon.Back />
                            <span>Dashboard</span>
                        </button>
                        <button className="cm-btn cm-btn-primary" onClick={() => navigate('/customers/new')}>
                            <Icon.Plus />
                            <span>Add Customer</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ---- MAIN ---- */}
            <main className="cm-main">
                {/* Hero */}
                <div className="cm-hero">
                    <div className="cm-hero-grid" aria-hidden="true" />
                    <div className="cm-hero-left">
                        <div className="cm-hero-icon" aria-hidden="true"><Icon.Users /></div>
                        <div>
                            <h2 className="cm-hero-title">Customer Management</h2>
                            <p className="cm-hero-subtitle">Customer database and interaction history</p>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="cm-alert cm-alert-danger">
                        <Icon.AlertCircle />
                        <span>{error}</span>
                    </div>
                )}

                {/* Toolbar */}
                <div className="cm-toolbar">
                    <form className="cm-search-wrap" onSubmit={handleSearch}>
                        <span className="cm-search-icon" aria-hidden="true"><Icon.Search /></span>
                        <input
                            className="cm-search-input"
                            type="text"
                            placeholder="Search by name, company or email…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <div className="cm-filter-group">
                        <button
                            className={`cm-filter-btn ${activeFilter === undefined ? 'active-all' : ''}`}
                            onClick={() => handleFilterChange(undefined)}
                        >All</button>
                        <button
                            className={`cm-filter-btn ${activeFilter === true ? 'active-yes' : ''}`}
                            onClick={() => handleFilterChange(true)}
                        >Active</button>
                        <button
                            className={`cm-filter-btn ${activeFilter === false ? 'active-no' : ''}`}
                            onClick={() => handleFilterChange(false)}
                        >Inactive</button>
                    </div>
                </div>

                {loading ? (
                    <div className="cm-state-center">
                        <div className="cm-spinner" />
                        <p className="cm-state-label">Loading customers…</p>
                    </div>
                ) : (
                    <>
                        <p className="cm-results-info">
                            Showing {customers?.length ?? 0} of {totalCustomers} customers
                        </p>

                        <div className="cm-table-card">
                            <div className="cm-table-wrap">
                                <table className="cm-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Company</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers?.length === 0 ? (
                                            <tr>
                                                <td colSpan={8}>
                                                    <div className="cm-table-empty">
                                                        <div className="cm-table-empty-icon"><Icon.Users /></div>
                                                        No customers found
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            customers?.map((customer) => (
                                                <tr key={customer.id}>
                                                    <td><span className="cm-table-id">{customer.id}</span></td>
                                                    <td className="cm-table-name">{customer.name} {customer.last_name}</td>
                                                    <td>{customer.company || '—'}</td>
                                                    <td>{customer.email}</td>
                                                    <td>{customer.phone || '—'}</td>
                                                    <td>
                                                        <span className={`cm-badge ${customer.active ? 'cm-badge-active' : 'cm-badge-inactive'}`}>
                                                            {customer.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(customer.created_at)}</td>
                                                    <td>
                                                        <div className="cm-row-actions">
                                                            <button
                                                                className="cm-action-btn"
                                                                onClick={() => navigate(`/customers/${customer.id}`)}
                                                            >
                                                                <Icon.Edit />
                                                                Edit
                                                            </button>
                                                            {/*<button*/}
                                                            {/*    className="cm-action-btn cm-action-btn-danger"*/}
                                                            {/*    onClick={() => { setCustomerToDelete(customer); setShowConfirm(true); }}*/}
                                                            {/*>*/}
                                                            {/*    <Icon.Trash />*/}
                                                            {/*    Delete*/}
                                                            {/*</button>*/}
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
                                <div className="cm-pagination">
                                    <button
                                        className="cm-page-btn"
                                        disabled={currentPage <= 1}
                                        onClick={() => loadCustomers(currentPage - 1, searchQuery, activeFilter)}
                                    >
                                        <Icon.ChevronLeft />
                                    </button>
                                    <span className="cm-page-info">Page {currentPage} of {totalPages}</span>
                                    <button
                                        className="cm-page-btn"
                                        disabled={currentPage >= totalPages}
                                        onClick={() => loadCustomers(currentPage + 1, searchQuery, activeFilter)}
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
                <div className="cm-modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cm-modal-header">
                            <h3 className="cm-modal-title">Delete Customer</h3>
                            <button className="cm-modal-close" onClick={() => setShowConfirm(false)}>
                                <Icon.Close />
                            </button>
                        </div>
                        <div className="cm-modal-body">
                            Are you sure you want to delete{' '}
                            <strong>{customerToDelete?.name} {customerToDelete?.last_name}</strong>
                            {customerToDelete?.company && <> (<strong>{customerToDelete.company}</strong>)</>}?
                            This action cannot be undone.
                        </div>
                        <div className="cm-modal-footer">
                            <button className="cm-btn cm-btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="cm-btn cm-btn-danger" onClick={handleDeleteCustomer}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
