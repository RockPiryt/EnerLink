import React, { useEffect, useState } from 'react';
// No Bootstrap imports; use custom classes and native elements
import AddCityModal from "../../dialogs/AddCityModal";
import { useNavigate } from 'react-router-dom';
import DeleteCityModal from "../../dialogs/DeleteCityModal";
import EditCityModal from "../../dialogs/EditCityModal";



// Inline SVG icons for hero and actions
const Icon = {
    Map: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 26, height: 26}}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
    ),
    Plus: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: 18, height: 18}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    ),
    Back: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: 18, height: 18}}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    ),
};


interface City {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
}

const CityList: React.FC = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCities, setTotalCities] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cityToEdit, setCityToEdit] = useState<City | null>(null);
    const [cityToDelete, setCityToDelete] = useState<City | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const loadCities = async (page: number = 1, search: string = '', active?: boolean) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('per_page', '20');

            if (search.trim()) {
                params.append('q', search.trim());
            }
            if (active !== undefined) {
                params.append('active', active.toString());
            }

            const response = await fetch(`http://localhost:8080/api/address/cities?${params}`);
            if (!response.ok) throw new Error('Failed to fetch cities');

            const data = await response.json();

            if (data.items) {
                setCities(data.items);
                setTotalPages(data.pages || 1);
                setTotalCities(data.total || data.items.length);
            } else {
                let filteredCities = data;

                if (search.trim()) {
                    filteredCities = filteredCities.filter((city: City) =>
                        city.name.toLowerCase().includes(search.toLowerCase())
                    );
                }

                if (active !== undefined) {
                    filteredCities = filteredCities.filter((city: City) => city.is_active === active);
                }

                setCities(filteredCities);
                setTotalCities(filteredCities.length);
                setTotalPages(Math.ceil(filteredCities.length / 20));
            }
            setCurrentPage(page);
        } catch (err: any) {
            setError('Error loading cities.');
            setCities([]);
            setTotalCities(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadCities(1, searchQuery, activeFilter);
    };

    const handleFilterChange = (active?: boolean) => {
        setActiveFilter(active);
        setCurrentPage(1);
        loadCities(1, searchQuery, active);
    };

    const handleToggleActive = async (cityId: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/api/address/cities/${cityId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus }),
            });

            if (!response.ok) throw new Error('Failed to update city status');

            setSuccess(`City ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            loadCities(currentPage, searchQuery, activeFilter);
        } catch (err: any) {
            setError('Error updating city status.');
        }
    };

    const handleEditCity = (city: City) => {
        setCityToEdit(city);
        setShowEditModal(true);
    };

    const handleDeleteCity = (city: City) => {
        setCityToDelete(city);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!cityToDelete) return;

        setDeleteLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8080/api/address/cities/${cityToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete city');

            setSuccess('City deleted successfully!');
            setShowDeleteModal(false);
            setCityToDelete(null);
            loadCities(currentPage, searchQuery, activeFilter);
        } catch (err: any) {
            setError('Error deleting city.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCityAdded = () => {
        setSuccess('City added successfully!');
        loadCities(currentPage, searchQuery, activeFilter);
    };

    const handleCityEdited = () => {
        setSuccess('City updated successfully!');
        loadCities(currentPage, searchQuery, activeFilter);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        loadCities();
    }, []);

    // --- MODERN HERO LAYOUT (MATCH TARIFF) ---
    return (
        <div className="dashboard-main" style={{paddingTop: 0}}>
            {/* HEADER BUTTONS */}
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 8}}>
                <button className="dashboard-btn" onClick={handleBackToDashboard}>
                    <Icon.Back /> <span>Dashboard</span>
                </button>
                <button className="dashboard-btn dashboard-btn-primary" onClick={() => setShowAddModal(true)}>
                    <Icon.Plus /> <span>Add City</span>
                </button>
            </div>

            {/* HERO SECTION */}
            <div className="pr-hero" style={{marginBottom: 28}}>
                <div className="pr-hero-grid" aria-hidden="true" />
                <div className="pr-hero-left">
                    <div className="pr-hero-icon" aria-hidden="true"><Icon.Map /></div>
                    <div>
                        <h2 className="pr-hero-title">City Management</h2>
                        <p className="pr-hero-subtitle">Manage cities and their active status</p>
                    </div>
                </div>
            </div>

            {/* ALERTS */}
            {error && (
                <div className="cm-alert cm-alert-danger" style={{marginBottom: 12}}>{error}</div>
            )}
            {success && (
                <div className="cm-alert cm-alert-success" style={{marginBottom: 12}}>{success}</div>
            )}

            {/* TOOLBAR */}
            <div className="cm-toolbar" style={{marginBottom: 18}}>
                <form onSubmit={handleSearch} style={{display: 'flex', gap: 12, flex: 1}}>
                    <div className="cm-search-wrap">
                        <input
                            className="cm-search-input"
                            type="text"
                            placeholder="Search cities by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="cm-btn" type="submit">Search</button>
                </form>
                <div className="cm-filter-group">
                    <button
                        className={`cm-filter-btn${activeFilter === undefined ? ' active-all' : ''}`}
                        type="button"
                        onClick={() => handleFilterChange(undefined)}
                    >
                        All
                    </button>
                    <button
                        className={`cm-filter-btn${activeFilter === true ? ' active-yes' : ''}`}
                        type="button"
                        onClick={() => handleFilterChange(true)}
                    >
                        Active
                    </button>
                    <button
                        className={`cm-filter-btn${activeFilter === false ? ' active-no' : ''}`}
                        type="button"
                        onClick={() => handleFilterChange(false)}
                    >
                        Inactive
                    </button>
                </div>
            </div>

            {/* TABLE CARD */}
            <div className="cm-table-card">
                {loading ? (
                    <div className="cm-state-center">
                        <div className="cm-spinner" />
                        <div className="cm-state-label">Loading cities...</div>
                    </div>
                ) : (
                    <>
                        <div className="cm-results-info">
                            Showing {cities.length} of {totalCities} cities
                        </div>
                        <div className="cm-table-wrap">
                            <table className="cm-table">
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
                                    {cities.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="cm-table-empty">
                                                <div className="cm-table-empty-icon">🏙️</div>
                                                No cities found
                                            </td>
                                        </tr>
                                    ) : (
                                        cities.map((city) => (
                                            <tr key={city.id}>
                                                <td className="cm-table-id">{city.id}</td>
                                                <td className="cm-table-name">{city.name}</td>
                                                <td>
                                                    <span className={`cm-badge ${city.is_active ? 'cm-badge-active' : 'cm-badge-inactive'}`}>
                                                        {city.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>{formatDate(city.created_at)}</td>
                                                <td>
                                                    <div className="cm-row-actions">
                                                        <button className="cm-action-btn" onClick={() => handleEditCity(city)}>Edit</button>
                                                        <button className="cm-action-btn" style={{color: city.is_active ? '#f59e0b' : '#10b981'}} onClick={() => handleToggleActive(city.id, city.is_active)}>
                                                            {city.is_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button className="cm-action-btn cm-action-btn-danger" onClick={() => handleDeleteCity(city)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="cm-pagination">
                                <button
                                    className="cm-page-btn"
                                    disabled={currentPage <= 1}
                                    onClick={() => loadCities(currentPage - 1, searchQuery, activeFilter)}
                                >
                                    Previous
                                </button>
                                <span className="cm-page-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="cm-page-btn"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => loadCities(currentPage + 1, searchQuery, activeFilter)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <AddCityModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onCityAdded={handleCityAdded}
            />
            {cityToEdit && (
                <EditCityModal
                    show={showEditModal}
                    onHide={() => {
                        setShowEditModal(false);
                        setCityToEdit(null);
                    }}
                    city={cityToEdit}
                    onCityEdited={handleCityEdited}
                />
            )}
            {cityToDelete && (
                <DeleteCityModal
                    show={showDeleteModal}
                    onHide={() => {
                        setShowDeleteModal(false);
                        setCityToDelete(null);
                    }}
                    cityName={cityToDelete.name}
                    loading={deleteLoading}
                    error={error}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default CityList;