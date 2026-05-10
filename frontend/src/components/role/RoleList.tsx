import React, { useEffect, useState } from 'react';
import AddRoleModal from '../../dialogs/AddRoleModal';
import EditRoleModal from '../../dialogs/EditRoleModal';
import DeleteRoleModal from '../../dialogs/DeleteRoleModal';
import { Role } from '../../models/role';
import { RoleService } from '../../services/roleService';
import './RoleList.css';

/* ----- Inline SVG icons ----- */
const I = {
    Search: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
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
    Check: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    ),
    ArrowLeft: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    ),
    ArrowRight: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    ),
};

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

    const roleService = new RoleService();

    const loadRoles = async (page: number = 1, search: string = '', active?: boolean) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const data = await roleService.getRoles();
            let filteredRoles = data;
            if (search.trim()) {
                filteredRoles = filteredRoles.filter((role) =>
                    role.role_name.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (active !== undefined) {
                filteredRoles = filteredRoles.filter((role) => role.active === active);
            }
            setRoles(filteredRoles);
            setTotalRoles(filteredRoles.length);
            setTotalPages(Math.ceil(filteredRoles.length / 20));
            setCurrentPage(page);
        } catch (err: any) {
            setError('Error while fetching roles');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadRoles(1, searchQuery, activeFilter);
    };

    const handleFilterChange = (active?: boolean) => {
        setActiveFilter(active);
        setCurrentPage(1);
        loadRoles(1, searchQuery, active);
    };

    const handleAddRole = () => setShowAddModal(true);

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setShowEditModal(true);
    };

    const handleDeleteRole = (role: Role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!roleToDelete) return;
        setDeleteLoading(true);
        setError('');
        setSuccess('');
        try {
            await roleService.deleteRole(roleToDelete.id);
            setSuccess('Role has been deleted.');
            setShowDeleteModal(false);
            setRoleToDelete(null);
            loadRoles(currentPage, searchQuery, activeFilter);
        } catch (err: any) {
            setError('Error while deleting role.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleModalSuccess = () => {
        loadRoles(currentPage, searchQuery, activeFilter);
    };

    useEffect(() => {
        loadRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* ---------- SECTION HEADER ---------- */}
            <div className="admin-section-bar">
                <div>
                    <h3>Role management</h3>
                    <span className="subtitle">Role definitions and assigned permissions</span>
                </div>
                <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    onClick={handleAddRole}
                >
                    <I.Plus />
                    <span>Add role</span>
                </button>
            </div>

            {/* ---------- SEARCH + FILTERS ---------- */}
            <div className="role-toolbar">
                <form className="role-search" onSubmit={handleSearch}>
                    <span className="role-search-icon" aria-hidden="true"><I.Search /></span>
                    <input
                        type="text"
                        className="role-search-input"
                        placeholder="Search roles by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <div className="role-filters" role="tablist">
                    <button
                        type="button"
                        className={`role-filter ${activeFilter === undefined ? 'active' : ''}`}
                        onClick={() => handleFilterChange(undefined)}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`role-filter ${activeFilter === true ? 'active active-success' : ''}`}
                        onClick={() => handleFilterChange(true)}
                    >
                        {activeFilter === true && <span className="dot" />} Active
                    </button>
                    <button
                        type="button"
                        className={`role-filter ${activeFilter === false ? 'active active-danger' : ''}`}
                        onClick={() => handleFilterChange(false)}
                    >
                        {activeFilter === false && <span className="dot" />} Inactive
                    </button>
                </div>
            </div>

            {/* ---------- ALERTS ---------- */}
            {error && (
                <div className="admin-alert" role="alert">
                    <I.Alert />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="role-success" role="status">
                    <I.Check />
                    <span>{success}</span>
                </div>
            )}

            {/* ---------- CONTENT ---------- */}
            {loading ? (
                <div className="admin-loading">
                    <div className="admin-spinner" />
                    <p>Loading roles...</p>
                </div>
            ) : (
                <>
                    <div className="role-summary">
                        Showing <strong>{roles.length}</strong> of <strong>{totalRoles}</strong> roles
                    </div>

                    {roles.length === 0 ? (
                        <div className="admin-empty">
                            <p>No roles found.</p>
                        </div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Role name</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map((role) => (
                                        <tr key={role.id}>
                                            <td><span className="role-id-code">{String(role.id).slice(0, 8)}</span></td>
                                            <td><span className="admin-badge admin-badge-role">{role.role_name}</span></td>
                                            <td>
                                                <span className={`admin-badge ${role.active ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                                                    {role.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button
                                                        className="admin-action-btn admin-action-btn-edit"
                                                        onClick={() => handleEditRole(role)}
                                                    >
                                                        <I.Edit /> Edit
                                                    </button>
                                                    <button
                                                        className="admin-action-btn admin-action-btn-delete"
                                                        onClick={() => handleDeleteRole(role)}
                                                    >
                                                        <I.Trash /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="role-pagination">
                            <button
                                type="button"
                                className="role-page-btn"
                                disabled={currentPage <= 1}
                                onClick={() => loadRoles(currentPage - 1, searchQuery, activeFilter)}
                            >
                                <I.ArrowLeft />
                                Previous
                            </button>
                            <span className="pager-info">
                                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                            </span>
                            <button
                                type="button"
                                className="role-page-btn"
                                disabled={currentPage >= totalPages}
                                onClick={() => loadRoles(currentPage + 1, searchQuery, activeFilter)}
                            >
                                Next
                                <I.ArrowRight />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* ---------- MODALS ---------- */}
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

            {roleToDelete && (
                <DeleteRoleModal
                    show={showDeleteModal}
                    onHide={() => {
                        setShowDeleteModal(false);
                        setRoleToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    roleName={roleToDelete.role_name}
                    loading={deleteLoading}
                    error={error}
                />
            )}
        </>
    );
};

export default RoleList;
