
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
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
    sales_rep_id?: number;
    sales_rep_name?: string;
}

const MyCustomers: React.FC = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                // Assuming the backend supports filtering by sales_rep_id
                const response = await fetch(`http://localhost:8080/api/customers?sales_rep_id=${user.id}`);
                if (!response.ok) throw new Error('Failed to fetch customers');
                const data = await response.json();
                setCustomers(data.items || data); // handle paginated or plain list
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [user]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                                <h4 className="mb-0">My Customers</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    {error}
                                </Alert>
                            )}
                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <div className="mt-2">Loading customers...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 text-muted">
                                        Showing {customers.length} customers assigned to you
                                    </div>
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
                                                        No customers assigned to you
                                                    </td>
                                                </tr>
                                            ) : (
                                                customers.map((customer) => (
                                                    <tr key={customer.id}>
                                                        <td><code>{customer.id}</code></td>
                                                        <td><strong>{customer.name} {customer.last_name}</strong></td>
                                                        <td>{customer.company || '-'}</td>
                                                        <td>{customer.email}</td>
                                                        <td>{customer.phone || '-'}</td>
                                                        <td>{customer.active ? 'Active' : 'Inactive'}</td>
                                                        <td>{formatDate(customer.created_at)}</td>
                                                        <td>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => navigate(`/customers/${customer.id}`)}
                                                            >
                                                                Details
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MyCustomers;
