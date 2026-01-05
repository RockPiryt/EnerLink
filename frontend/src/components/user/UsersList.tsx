import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { UserService, User } from '../../services/userService';

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const userService = new UserService();

    const loadUsers = async (page: number = 1, search: string = '', active?: boolean) => {
        setLoading(true);
        setError('');
        
        try {
            const params: any = { page, per_page: 20 };
            if (search.trim()) {
                params.q = search.trim();
            }
            if (active !== undefined) {
                params.active = active;
            }

            const response = await userService.getUsers(params);
            setUsers(response.items);
            setTotalPages(response.pages);
            setTotalUsers(response.total);
            setCurrentPage(page);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadUsers(1, searchQuery, activeFilter);
    };

    const handleFilterChange = (active?: boolean) => {
        setActiveFilter(active);
        setCurrentPage(1);
        loadUsers(1, searchQuery, active);
    };

    const getRoleBadgeVariant = (roleName: string) => {
        switch (roleName?.toLowerCase()) {
            case 'admin': return 'danger';
            case 'manager': return 'warning';
            case 'analyst': return 'info';
            case 'sales': return 'success';
            default: return 'secondary';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">Users Management</h4>
                        </Card.Header>
                        
                        <Card.Body>
                            {/* Search and Filter Controls */}
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search users by name, username, or email..."
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
                                    <div className="mt-2">Loading users...</div>
                                </div>
                            ) : (
                                <>
                                    {/* Results Summary */}
                                    <div className="mb-3 text-muted">
                                        Showing {users.length} of {totalUsers} users
                                    </div>

                                    {/* Users Table */}
                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Status</th>
                                                    <th>Created</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className="text-center py-4">
                                                            No users found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    users.map((user) => (
                                                        <tr key={user.id}>
                                                            <td>
                                                                <code>{user.id}</code>
                                                            </td>
                                                            <td>
                                                                <strong>{user.first_name} {user.last_name}</strong>
                                                            </td>
                                                            <td>{user.username}</td>
                                                            <td>{user.email}</td>
                                                            <td>
                                                                <Badge bg={getRoleBadgeVariant(user.role_name)}>
                                                                    {user.role_name}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <Badge bg={user.active ? 'success' : 'secondary'}>
                                                                    {user.active ? 'Active' : 'Inactive'}
                                                                </Badge>
                                                            </td>
                                                            <td>{formatDate(user.created_at)}</td>
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
                                                    onClick={() => loadUsers(currentPage - 1, searchQuery, activeFilter)}
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
                                                    onClick={() => loadUsers(currentPage + 1, searchQuery, activeFilter)}
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
        </Container>
    );
};

export default UsersList;