import React, { useEffect, useState } from 'react';
import DeletePKWiUModal from "../../dialogs/DeletePKWiuModal";
import EditPKWiUModal from "../../dialogs/EditPkwiuModal";
import AddPKWiUModal from "../../dialogs/AddPKWiuModal";
import '../provider/Provider.css';

interface PKWiU {
    id: number;
    pkwiu_nr: string;
    pkwiu_name: string;
}

const Icon = {
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  AlertCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  CheckCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

const PKWiUList: React.FC = () => {
    const [pkwius, setPkwius] = useState<PKWiU[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPkwius, setTotalPkwius] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pkwiuToEdit, setPkwiuToEdit] = useState<PKWiU | null>(null);
    const [pkwiuToDelete, setPkwiuToDelete] = useState<PKWiU | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const loadPkwius = async (page: number = 1, search: string = '') => {
        setLoading(true); setError(''); setSuccess('');
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('per_page', '20');
            if (search.trim()) params.append('q', search.trim());
            const response = await fetch(`http://localhost:8080/api/pkwiu?${params}`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            if (data.items) {
                setPkwius(data.items); setTotalPages(data.pages || 1); setTotalPkwius(data.total || data.items.length);
            } else {
                let f = data;
                if (search.trim()) f = f.filter((p: PKWiU) => p.pkwiu_nr.toLowerCase().includes(search.toLowerCase()) || p.pkwiu_name.toLowerCase().includes(search.toLowerCase()));
                setPkwius(f); setTotalPkwius(f.length); setTotalPages(Math.max(1, Math.ceil(f.length / 20)));
            }
            setCurrentPage(page);
        } catch { setError('Error loading PKWiU codes.'); setPkwius([]); } finally { setLoading(false); }
    };

    useEffect(() => { loadPkwius(); }, []);

    const handleConfirmDelete = async () => {
        if (!pkwiuToDelete) return;
        setDeleteLoading(true); setError('');
        try {
            const r = await fetch(`http://localhost:8080/api/pkwiu/${pkwiuToDelete.id}`, { method: 'DELETE' });
            if (!r.ok) throw new Error();
            setSuccess('PKWiU code deleted.'); setShowDeleteModal(false); setPkwiuToDelete(null);
            loadPkwius(currentPage, searchQuery);
            setTimeout(() => setSuccess(''), 3000);
        } catch { setError('Error deleting PKWiU code.'); } finally { setDeleteLoading(false); }
    };

    return (
        <div>
            <div className="pr-toolbar" style={{ marginBottom: 16 }}>
                <form className="pr-search-wrap" onSubmit={e => { e.preventDefault(); loadPkwius(1, searchQuery); }}>
                    <span className="pr-search-icon"><Icon.Search /></span>
                    <input className="pr-search-input" type="text" placeholder="Search PKWiU codes…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </form>
                <button className="pr-btn pr-btn-primary" onClick={() => setShowAddModal(true)}><Icon.Plus /><span>Add PKWiU</span></button>
            </div>

            {error && <div className="pr-alert pr-alert-danger" style={{ marginBottom: 12 }}><Icon.AlertCircle /><span>{error}</span></div>}
            {success && <div className="pr-alert pr-alert-success" style={{ marginBottom: 12 }}><Icon.CheckCircle /><span>{success}</span></div>}

            {loading ? (
                <div className="pr-state-center"><span className="pr-spinner" /><p className="pr-state-label">Loading PKWiU codes…</p></div>
            ) : (
                <>
                    <p className="pr-results-info">Showing {pkwius.length} of {totalPkwius} PKWiU codes</p>
                    <div className="pr-table-card">
                        <div className="pr-table-wrap">
                            <table className="pr-table">
                                <thead><tr><th>ID</th><th>PKWiU Number</th><th>PKWiU Name</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {pkwius.length === 0 ? (
                                        <tr><td colSpan={4}><div className="pr-table-empty">No PKWiU codes found.</div></td></tr>
                                    ) : pkwius.map(p => (
                                        <tr key={p.id}>
                                            <td><span className="pr-table-id">{p.id}</span></td>
                                            <td><span className="pr-badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#4f46e5', border: '1px solid rgba(99,102,241,0.2)' }}>{p.pkwiu_nr}</span></td>
                                            <td className="pr-table-name">{p.pkwiu_name}</td>
                                            <td>
                                                <div className="pr-row-actions">
                                                    <button className="pr-action-btn" onClick={() => { setPkwiuToEdit(p); setShowEditModal(true); }}><Icon.Edit />Edit</button>
                                                    <button className="pr-action-btn pr-action-btn-danger" onClick={() => { setPkwiuToDelete(p); setShowDeleteModal(true); }}><Icon.Trash />Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="pr-pagination">
                                <button className="pr-page-btn" disabled={currentPage <= 1} onClick={() => loadPkwius(currentPage - 1, searchQuery)}><Icon.ChevronLeft /></button>
                                <span className="pr-page-info">Page {currentPage} of {totalPages}</span>
                                <button className="pr-page-btn" disabled={currentPage >= totalPages} onClick={() => loadPkwius(currentPage + 1, searchQuery)}><Icon.ChevronRight /></button>
                            </div>
                        )}
                    </div>
                </>
            )}

            <AddPKWiUModal show={showAddModal} onHide={() => setShowAddModal(false)} onPkwiuAdded={() => { setSuccess('PKWiU code added.'); loadPkwius(currentPage, searchQuery); setTimeout(() => setSuccess(''), 3000); }} />
            {pkwiuToEdit && <EditPKWiUModal show={showEditModal} onHide={() => { setShowEditModal(false); setPkwiuToEdit(null); }} pkwiu={pkwiuToEdit} onPkwiuEdited={() => { setSuccess('PKWiU code updated.'); loadPkwius(currentPage, searchQuery); setTimeout(() => setSuccess(''), 3000); }} />}
            {pkwiuToDelete && <DeletePKWiUModal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setPkwiuToDelete(null); }} pkwiuName={`${pkwiuToDelete.pkwiu_nr} - ${pkwiuToDelete.pkwiu_name}`} loading={deleteLoading} error={error} onConfirm={handleConfirmDelete} />}
        </div>
    );
};

export default PKWiUList;
