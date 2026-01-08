import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddCityModal from "../../dialogs/AddCityModal";
import DeleteCityModal from "../../dialogs/DeleteCityModal";
import EditCityModal from "../../dialogs/EditCityModal";

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

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={handleBackToDashboard}
                                    className="me-3"
                                >
                                    &larr; Back to Dashboard
                                </Button>
                                <h4 className="mb-0">City Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add City
                            </Button>
                        </Card.Header>

                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search cities by name..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Button variant="outline-secondary" type="submit">
                                                Search
                                            </Button>
                                        </InputGroup>
                                    </Form>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant={activeFilter === undefined ? "primary" : "outline-primary"}
                                            size="sm"
                                            onClick={() => handleFilterChange(undefined)}
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={activeFilter === true ? "success" : "outline-success"}
                                            size="sm"
                                            onClick={() => handleFilterChange(true)}
                                        >
                                            Active
                                        </Button>
                                        <Button
                                            variant={activeFilter === false ? "danger" : "outline-danger"}
                                            size="sm"
                                            onClick={() => handleFilterChange(false)}
                                        >
                                            Inactive
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success" className="mb-3">
                                    {success}
                                </Alert>
                            )}

                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <div className="mt-2">Loading cities...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 text-muted">
                                        Showing {cities.length} of {totalCities} cities
                                    </div>

                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
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
                                                    <td colSpan={5} className="text-center py-4">
                                                        No cities found
                                                    </td>
                                                </tr>
                                            ) : (
                                                cities.map((city) => (
                                                    <tr key={city.id}>
                                                        <td>
                                                            <code>{city.id}</code>
                                                        </td>
                                                        <td>
                                                            <strong>{city.name}</strong>
                                                        </td>
                                                        <td>
                                                            <Badge bg={city.is_active ? 'success' : 'secondary'}>
                                                                {city.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </td>
                                                        <td>{formatDate(city.created_at)}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditCity(city)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant={city.is_active ? "outline-warning" : "outline-success"}
                                                                    size="sm"
                                                                    onClick={() => handleToggleActive(city.id, city.is_active)}
                                                                >
                                                                    {city.is_active ? 'Deactivate' : 'Activate'}
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteCity(city)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center mt-3">
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    disabled={currentPage <= 1}
                                                    onClick={() => loadCities(currentPage - 1, searchQuery, activeFilter)}
                                                >
                                                    Previous
                                                </Button>

                                                <span className="align-self-center px-3">
                          Page {currentPage} of {totalPages}
                        </span>

                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    disabled={currentPage >= totalPages}
                                                    onClick={() => loadCities(currentPage + 1, searchQuery, activeFilter)}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

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
        </Container>
    );
};

export default CityList;