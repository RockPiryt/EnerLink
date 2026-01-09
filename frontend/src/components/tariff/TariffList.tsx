import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DeleteTariffModal from "../../dialogs/DeleteTariffModal";
import AddTariffModal from "../../dialogs/AddTariffModal";
import EditTariffModal from "../../dialogs/EditTariffModal";

interface Tariff {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
}

const TariffList: React.FC = () => {
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

    const loadTariffs = async (page: number = 1, search: string = '', active?: boolean) => {
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

            const response = await fetch(`http://localhost:8080/api/supplier/tariffs?${params}`);
            if (!response.ok) throw new Error('Failed to fetch tariffs');

            const data = await response.json();

            if (data.items) {
                setTariffs(data.items);
                setTotalPages(data.pages || 1);
                setTotalTariffs(data.total || data.items.length);
            } else {
                let filteredTariffs = data;

                if (search.trim()) {
                    filteredTariffs = filteredTariffs.filter((tariff: Tariff) =>
                        tariff.name.toLowerCase().includes(search.toLowerCase())
                    );
                }

                if (active !== undefined) {
                    filteredTariffs = filteredTariffs.filter((tariff: Tariff) => tariff.is_active === active);
                }

                setTariffs(filteredTariffs);
                setTotalTariffs(filteredTariffs.length);
                setTotalPages(Math.ceil(filteredTariffs.length / 20));
            }
            setCurrentPage(page);
        } catch (err: any) {
            setError('Error loading tariffs.');
            setTariffs([]);
            setTotalTariffs(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

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

    const handleToggleActive = async (tariffId: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/api/supplier/tariffs/${tariffId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus }),
            });

            if (!response.ok) throw new Error('Failed to update tariff status');

            setSuccess(`Tariff ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            loadTariffs(currentPage, searchQuery, activeFilter);
        } catch (err: any) {
            setError('Error updating tariff status.');
        }
    };

    const handleEditTariff = (tariff: Tariff) => {
        setTariffToEdit(tariff);
        setShowEditModal(true);
    };

    const handleDeleteTariff = (tariff: Tariff) => {
        setTariffToDelete(tariff);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!tariffToDelete) return;

        setDeleteLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8080/api/supplier/tariffs/${tariffToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete tariff');

            setSuccess('Tariff deleted successfully!');
            setShowDeleteModal(false);
            setTariffToDelete(null);
            loadTariffs(currentPage, searchQuery, activeFilter);
        } catch (err: any) {
            setError('Error deleting tariff.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleTariffAdded = () => {
        setSuccess('Tariff added successfully!');
        loadTariffs(currentPage, searchQuery, activeFilter);
    };

    const handleTariffEdited = () => {
        setSuccess('Tariff updated successfully!');
        loadTariffs(currentPage, searchQuery, activeFilter);
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
        loadTariffs();
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
                                <h4 className="mb-0">Energy Tariff Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add Tariff
                            </Button>
                        </Card.Header>

                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search tariffs by name..."
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
                                    <div className="mt-2">Loading tariffs...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 text-muted">
                                        Showing {tariffs.length} of {totalTariffs} tariffs
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
                                            {tariffs.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-4">
                                                        No tariffs found
                                                    </td>
                                                </tr>
                                            ) : (
                                                tariffs.map((tariff) => (
                                                    <tr key={tariff.id}>
                                                        <td>
                                                            <code>{tariff.id}</code>
                                                        </td>
                                                        <td>
                                                            <strong>{tariff.name}</strong>
                                                        </td>
                                                        <td>
                                                            <Badge bg={tariff.is_active ? 'success' : 'secondary'}>
                                                                {tariff.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </td>
                                                        <td>{formatDate(tariff.created_at)}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditTariff(tariff)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant={tariff.is_active ? "outline-warning" : "outline-success"}
                                                                    size="sm"
                                                                    onClick={() => handleToggleActive(tariff.id, tariff.is_active)}
                                                                >
                                                                    {tariff.is_active ? 'Deactivate' : 'Activate'}
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteTariff(tariff)}
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
                                                    onClick={() => loadTariffs(currentPage - 1, searchQuery, activeFilter)}
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
                                                    onClick={() => loadTariffs(currentPage + 1, searchQuery, activeFilter)}
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

            <AddTariffModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onTariffAdded={handleTariffAdded}
            />

            {tariffToEdit && (
                <EditTariffModal
                    show={showEditModal}
                    onHide={() => {
                        setShowEditModal(false);
                        setTariffToEdit(null);
                    }}
                    tariff={tariffToEdit}
                    onTariffEdited={handleTariffEdited}
                />
            )}

            {tariffToDelete && (
                <DeleteTariffModal
                    show={showDeleteModal}
                    onHide={() => {
                        setShowDeleteModal(false);
                        setTariffToDelete(null);
                    }}
                    tariffName={tariffToDelete.name}
                    loading={deleteLoading}
                    error={error}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </Container>
    );
};

export default TariffList;