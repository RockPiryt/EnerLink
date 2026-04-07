import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Contract, getContracts, deleteContract } from '../../services/contractService';

const ContractList: React.FC = () => {
    const [contracts, setContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalContracts, setTotalContracts] = useState(0);

    const [showConfirm, setShowConfirm] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const loadContracts = async (page: number = 1, search: string = '', status?: string) => {
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

    useEffect(() => {
        loadContracts();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadContracts(1, searchQuery, statusFilter);
    };

    const handleFilterChange = (status?: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
        loadContracts(1, searchQuery, status);
    };

    const getStatusBadgeVariant = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'expired': return 'danger';
            case 'pending': return 'warning';
            case 'cancelled': return 'secondary';
            default: return 'info';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

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
                                <h4 className="mb-0">Contract Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => navigate('/contracts/new')}
                            >
                                Add Contract
                            </Button>
                        </Card.Header>

                        <Card.Body>
                            {/* Search and Filter Controls */}
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search contracts by number or customer..."
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
                                            variant={statusFilter === undefined || statusFilter === 'all' ? "primary" : "outline-primary"}
                                            size="sm"
                                            onClick={() => handleFilterChange('all')}
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'active' ? "success" : "outline-success"}
                                            size="sm"
                                            onClick={() => handleFilterChange('active')}
                                        >
                                            Active
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'pending' ? "warning" : "outline-warning"}
                                            size="sm"
                                            onClick={() => handleFilterChange('pending')}
                                        >
                                            Pending
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'expired' ? "danger" : "outline-danger"}
                                            size="sm"
                                            onClick={() => handleFilterChange('expired')}
                                        >
                                            Expired
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            {/* Error Alert */}
                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    {error}
                                </Alert>
                            )}

                            {/* Loading Spinner */}
                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <div className="mt-2">Loading contracts...</div>
                                </div>
                            ) : (
                                <>
                                    {/* Results Summary */}
                                    <div className="mb-3 text-muted">
                                        Showing {contracts.length} of {totalContracts} contracts
                                    </div>

                                    {/* Contracts Table */}
                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
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
                                                    <td colSpan={8} className="text-center py-4">
                                                        No contracts found
                                                    </td>
                                                </tr>
                                            ) : (
                                                contracts.map((contract) => (
                                                    <tr key={contract.id}>
                                                        <td>
                                                            <code>{contract.id}</code>
                                                        </td>
                                                        <td>
                                                            <strong>{contract.contract_number}</strong>
                                                        </td>
                                                        <td>{contract.customer?.company || contract.customer?.name || '-'}</td>
                                                        <td>{formatDate(contract.signed_at)}</td>
                                                        <td>{formatDate(contract.contract_from)}</td>
                                                        <td>{formatDate(contract.contract_to)}</td>
                                                        <td>
                                                            <Badge bg={getStatusBadgeVariant(contract.status)}>
                                                                {contract.status || 'Unknown'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => navigate(`/contracts/${contract.id}`)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setContractToDelete(contract);
                                                                        setShowConfirm(true);
                                                                    }}
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

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center mt-3">
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    disabled={currentPage <= 1}
                                                    onClick={() => loadContracts(currentPage - 1, searchQuery, statusFilter)}
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
                                                    onClick={() => loadContracts(currentPage + 1, searchQuery, statusFilter)}
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

            {/* Delete Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Contract</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete contract "{contractToDelete?.contract_number}"?
                    This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirm(false)}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteContract}
                        disabled={deleteLoading}
                        className="d-flex align-items-center gap-2"
                    >
                        {deleteLoading && <Spinner as="span" animation="border" size="sm" />}
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ContractList;