import React, { useEffect, useState } from 'react';
import { Modal, Container, Row, Col, Card, Table, Spinner, Alert, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Customer {
    id: number;
    company?: string;
    name?: string;
    last_name?: string;
    email: string;
    phone?: string;
    active?: boolean;
    created_at?: string;
}

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
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('per_page', '20');

            if (search.trim()) {
                params.append('q', search.trim());
            }
            if (active !== undefined) {
                params.append('active', active.toString());
            }

            const response = await fetch(`http://localhost:8080/api/customers?${params}`);
            if (!response.ok) throw new Error('Failed to fetch customers');

            const data = await response.json();

            // Assuming the API returns paginated data similar to users
            if (data.items) {
                setCustomers(data.items);
                setTotalPages(data.pages || 1);
                setTotalCustomers(data.total || data.items.length);
            } else {
                // Fallback for non-paginated response
                setCustomers(data);
                setTotalCustomers(data.length);
                setTotalPages(1);
            }
            setCurrentPage(page);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

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
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDeleteCustomer = async () => {
        if (customerToDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/customers/${customerToDelete.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Failed to delete customer');

                // Reload customers after deletion
                loadCustomers(currentPage, searchQuery, activeFilter);
            } catch (err: any) {
                setError(err.message);
            }
        }
        setShowConfirm(false);
        setCustomerToDelete(null);
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
                                    onClick={() => navigate('/dashboard')}
                                    className="me-3"
                                >
                                    &larr; Back to Dashboard
                                </Button>
                                <h4 className="mb-0">Customer Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => navigate('/customers/new')}
                            >
                                Add Customer
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
                                                placeholder="Search customers by name, company, or email..."
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
                                    <div className="mt-2">Loading customers...</div>
                                </div>
                            ) : (
                                <>
                                    {/* Results Summary */}
                                    <div className="mb-3 text-muted">
                                        Showing {customers.length} of {totalCustomers} customers
                                    </div>

                                    {/* Customers Table */}
                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
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
                                            {customers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-4">
                                                        No customers found
                                                    </td>
                                                </tr>
                                            ) : (
                                                customers.map((customer) => (
                                                    <tr key={customer.id}>
                                                        <td>
                                                            <code>{customer.id}</code>
                                                        </td>
                                                        <td>
                                                            <strong>
                                                                {customer.name} {customer.last_name}
                                                            </strong>
                                                        </td>
                                                        <td>{customer.company || '-'}</td>
                                                        <td>{customer.email}</td>
                                                        <td>{customer.phone || '-'}</td>
                                                        <td>
                                                            <Badge bg={customer.active ? 'success' : 'secondary'}>
                                                                {customer.active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </td>
                                                        <td>{formatDate(customer.created_at)}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => navigate(`/customers/${customer.id}`)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setCustomerToDelete(customer);
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
                                                    onClick={() => loadCustomers(currentPage - 1, searchQuery, activeFilter)}
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
                                                    onClick={() => loadCustomers(currentPage + 1, searchQuery, activeFilter)}
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
                    <Modal.Title>Delete Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete customer "{customerToDelete?.name} {customerToDelete?.last_name}"
                    {customerToDelete?.company && ` (${customerToDelete.company})`}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCustomer}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CustomerList;