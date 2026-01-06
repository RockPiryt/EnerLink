import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddRoleModal from '../../dialogs/AddRoleModal';
import EditRoleModal from '../../dialogs/EditRoleModal';
import DeleteRoleModal from '../../dialogs/DeleteRoleModal';
import { Role } from '../../models/role';
import { RoleService } from '../../services/roleService';

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
    const navigate = useNavigate();

    const loadRoles = async (page: number = 1, search: string = '', active?: boolean) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Assuming roleService can be enhanced to support pagination and filtering
            const data = await roleService.getRoles();

            // Client-side filtering for now (you can enhance the API later)
            let filteredRoles = data;

            if (search.trim()) {
                filteredRoles = filteredRoles.filter(role =>
                    role.role_name.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (active !== undefined) {
                filteredRoles = filteredRoles.filter(role => role.active === active);
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        loadRoles();
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
                                    onClick={() => navigate('/dashboard')}
                                    className="me-3"
                                >
                                    &larr; Back to Dashboard
                                </Button>
                                <h4 className="mb-0">Role Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={handleAddRole}
                            >
                                Add Role
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
                                                placeholder="Search roles by name..."
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

                            {/* Success Alert */}
                            {success && (
                                <Alert variant="success" className="mb-3">
                                    {success}
                                </Alert>
                            )}

                            {/* Loading Spinner */}
                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <div className="mt-2">Loading roles...</div>
                                </div>
                            ) : (
                                <>
                                    {/* Results Summary */}
                                    <div className="mb-3 text-muted">
                                        Showing {roles.length} of {totalRoles} roles
                                    </div>

                                    {/* Roles Table */}
                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Role Name</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {roles.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-4">
                                                        No roles found
                                                    </td>
                                                </tr>
                                            ) : (
                                                roles.map((role) => (
                                                    <tr key={role.id}>
                                                        <td>
                                                            <code>{role.id}</code>
                                                        </td>
                                                        <td>
                                                            <strong>{role.role_name}</strong>
                                                        </td>
                                                        <td>
                                                            <Badge bg={role.active ? 'success' : 'secondary'}>
                                                                {role.active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditRole(role)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteRole(role)}
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
                                                    onClick={() => loadRoles(currentPage - 1, searchQuery, activeFilter)}
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
                                                    onClick={() => loadRoles(currentPage + 1, searchQuery, activeFilter)}
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

            {/* Modals */}
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
        </Container>
    );
};

export default RoleList;