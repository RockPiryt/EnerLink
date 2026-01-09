import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DeleteDistrictModal from "../../dialogs/DeleteDistrictModal";
import AddDistrictModal from "../../dialogs/AddDistrictModal";
import EditDistrictModal from "../../dialogs/EditDistrictModal";

interface District {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
}

const DistrictList: React.FC = () => {
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDistricts, setTotalDistricts] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [districtToEdit, setDistrictToEdit] = useState<District | null>(null);
    const [districtToDelete, setDistrictToDelete] = useState<District | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const loadDistricts = async (page: number = 1, search: string = '', active?: boolean) => {
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

            const response = await fetch(`http://localhost:8080/api/address/districts?${params}`);
            if (!response.ok) throw new Error('Failed to fetch districts');

            const data = await response.json();

            if (data.items) {
                setDistricts(data.items);
                setTotalPages(data.pages || 1);
                setTotalDistricts(data.total || data.items.length);
            } else {
                let filteredDistricts = data;

                if (search.trim()) {
                    filteredDistricts = filteredDistricts.filter((district: District) =>
                        district.name.toLowerCase().includes(search.toLowerCase())
                    );
                }

                if (active !== undefined) {
                    filteredDistricts = filteredDistricts.filter((district: District) => district.is_active === active);
                }

                setDistricts(filteredDistricts);
                setTotalDistricts(filteredDistricts.length);
                setTotalPages(Math.ceil(filteredDistricts.length / 20));
            }
            setCurrentPage(page);
        } catch (err: any) {
            setError('Error loading districts.');
            setDistricts([]);
            setTotalDistricts(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadDistricts(1, searchQuery, activeFilter);
    };

    const handleFilterChange = (active?: boolean) => {
        setActiveFilter(active);
        setCurrentPage(1);
        loadDistricts(1, searchQuery, active);
    };

    const handleToggleActive = async (districtId: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/api/address/districts/${districtId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus }),
            });

            if (!response.ok) throw new Error('Failed to update district status');

            setSuccess(`District ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            loadDistricts(currentPage, searchQuery, activeFilter);
        } catch (err: any) {
            setError('Error updating district status.');
        }
    };

    const handleEditDistrict = (district: District) => {
        setDistrictToEdit(district);
        setShowEditModal(true);
    };

    const handleDeleteDistrict = (district: District) => {
        setDistrictToDelete(district);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!districtToDelete) return;

        setDeleteLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8080/api/address/districts/${districtToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete district');

            setSuccess('District deleted successfully!');
            setShowDeleteModal(false);
            setDistrictToDelete(null);
            loadDistricts(currentPage, searchQuery, activeFilter);
        } catch (err: any) {
            setError('Error deleting district.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDistrictAdded = () => {
        setSuccess('District added successfully!');
        loadDistricts(currentPage, searchQuery, activeFilter);
    };

    const handleDistrictEdited = () => {
        setSuccess('District updated successfully!');
        loadDistricts(currentPage, searchQuery, activeFilter);
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
        loadDistricts();
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
                                <h4 className="mb-0">District Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add District
                            </Button>
                        </Card.Header>

                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search districts by name..."
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
                                    <div className="mt-2">Loading districts...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 text-muted">
                                        Showing {districts.length} of {totalDistricts} districts
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
                                            {districts.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-4">
                                                        No districts found
                                                    </td>
                                                </tr>
                                            ) : (
                                                districts.map((district) => (
                                                    <tr key={district.id}>
                                                        <td>
                                                            <code>{district.id}</code>
                                                        </td>
                                                        <td>
                                                            <strong>{district.name}</strong>
                                                        </td>
                                                        <td>
                                                            <Badge bg={district.is_active ? 'success' : 'secondary'}>
                                                                {district.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </td>
                                                        <td>{formatDate(district.created_at)}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditDistrict(district)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant={district.is_active ? "outline-warning" : "outline-success"}
                                                                    size="sm"
                                                                    onClick={() => handleToggleActive(district.id, district.is_active)}
                                                                >
                                                                    {district.is_active ? 'Deactivate' : 'Activate'}
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteDistrict(district)}
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
                                                    onClick={() => loadDistricts(currentPage - 1, searchQuery, activeFilter)}
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
                                                    onClick={() => loadDistricts(currentPage + 1, searchQuery, activeFilter)}
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

            <AddDistrictModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onDistrictAdded={handleDistrictAdded}
            />

            {districtToEdit && (
                <EditDistrictModal
                    show={showEditModal}
                    onHide={() => {
                        setShowEditModal(false);
                        setDistrictToEdit(null);
                    }}
                    district={districtToEdit}
                    onDistrictEdited={handleDistrictEdited}
                />
            )}

            {districtToDelete && (
                <DeleteDistrictModal
                    show={showDeleteModal}
                    onHide={() => {
                        setShowDeleteModal(false);
                        setDistrictToDelete(null);
                    }}
                    districtName={districtToDelete.name}
                    loading={deleteLoading}
                    error={error}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </Container>
    );
};

export default DistrictList;