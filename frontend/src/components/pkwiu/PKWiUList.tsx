import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DeletePKWiUModal from "../../dialogs/DeletePKWiuModal";
import EditPKWiUModal from "../../dialogs/EditPkwiuModal";
import AddPKWiUModal from "../../dialogs/AddPKWiuModal";

interface PKWiU {
    id: number;
    pkwiu_nr: string;
    pkwiu_name: string;
}

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

    const navigate = useNavigate();

    const loadPkwius = async (page: number = 1, search: string = '') => {
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

            const response = await fetch(`http://localhost:8080/api/pkwiu?${params}`);
            if (!response.ok) throw new Error('Failed to fetch PKWiU codes');

            const data = await response.json();

            if (data.items) {
                setPkwius(data.items);
                setTotalPages(data.pages || 1);
                setTotalPkwius(data.total || data.items.length);
            } else {
                let filteredPkwius = data;

                if (search.trim()) {
                    filteredPkwius = filteredPkwius.filter((pkwiu: PKWiU) =>
                        pkwiu.pkwiu_nr.toLowerCase().includes(search.toLowerCase()) ||
                        pkwiu.pkwiu_name.toLowerCase().includes(search.toLowerCase())
                    );
                }

                setPkwius(filteredPkwius);
                setTotalPkwius(filteredPkwius.length);
                setTotalPages(Math.ceil(filteredPkwius.length / 20));
            }
            setCurrentPage(page);
        } catch (err: any) {
            setError('Error loading PKWiU codes.');
            setPkwius([]);
            setTotalPkwius(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadPkwius(1, searchQuery);
    };

    const handleEditPkwiu = (pkwiu: PKWiU) => {
        setPkwiuToEdit(pkwiu);
        setShowEditModal(true);
    };

    const handleDeletePkwiu = (pkwiu: PKWiU) => {
        setPkwiuToDelete(pkwiu);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!pkwiuToDelete) return;

        setDeleteLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8080/api/pkwiu/${pkwiuToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete PKWiU code');

            setSuccess('PKWiU code deleted successfully!');
            setShowDeleteModal(false);
            setPkwiuToDelete(null);
            loadPkwius(currentPage, searchQuery);
        } catch (err: any) {
            setError('Error deleting PKWiU code.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handlePkwiuAdded = () => {
        setSuccess('PKWiU code added successfully!');
        loadPkwius(currentPage, searchQuery);
    };

    const handlePkwiuEdited = () => {
        setSuccess('PKWiU code updated successfully!');
        loadPkwius(currentPage, searchQuery);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        loadPkwius();
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
                                <h4 className="mb-0">PKWiU Code Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add PKWiU Code
                            </Button>
                        </Card.Header>

                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search by PKWiU number or name..."
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
                                    <div className="d-flex gap-2 justify-content-end">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery('');
                                                loadPkwius(1, '');
                                            }}
                                        >
                                            Clear Filter
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
                                    <div className="mt-2">Loading PKWiU codes...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 text-muted">
                                        Showing {pkwius.length} of {totalPkwius} PKWiU codes
                                    </div>

                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>PKWiU Number</th>
                                                <th>PKWiU Name</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {pkwius.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-4">
                                                        No PKWiU codes found
                                                    </td>
                                                </tr>
                                            ) : (
                                                pkwius.map((pkwiu) => (
                                                    <tr key={pkwiu.id}>
                                                        <td>
                                                            <code>{pkwiu.id}</code>
                                                        </td>
                                                        <td>
                                                            <Badge bg="primary">
                                                                {pkwiu.pkwiu_nr}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <strong>{pkwiu.pkwiu_name}</strong>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditPkwiu(pkwiu)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeletePkwiu(pkwiu)}
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
                                                    onClick={() => loadPkwius(currentPage - 1, searchQuery)}
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
                                                    onClick={() => loadPkwius(currentPage + 1, searchQuery)}
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

            <AddPKWiUModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onPkwiuAdded={handlePkwiuAdded}
            />

            {pkwiuToEdit && (
                <EditPKWiUModal
                    show={showEditModal}
                    onHide={() => {
                        setShowEditModal(false);
                        setPkwiuToEdit(null);
                    }}
                    pkwiu={pkwiuToEdit}
                    onPkwiuEdited={handlePkwiuEdited}
                />
            )}

            {pkwiuToDelete && (
                <DeletePKWiUModal
                    show={showDeleteModal}
                    onHide={() => {
                        setShowDeleteModal(false);
                        setPkwiuToDelete(null);
                    }}
                    pkwiuName={`${pkwiuToDelete.pkwiu_nr} - ${pkwiuToDelete.pkwiu_name}`}
                    loading={deleteLoading}
                    error={error}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </Container>
    );
};

export default PKWiUList;