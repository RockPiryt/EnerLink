import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Tab, Tabs, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import {AdminService} from "../../services/admin/adminService";
import DeleteUserModal from "../../dialogs/DeleteModal";
import EditUserModal from "../../dialogs/EditUserModal";
import AddUserModal from "../../dialogs/AddUserModal";
import {User} from "../../models/user";
import RoleList from '../role/RoleList';

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // State for Add User modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const adminService = new AdminService();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getUsers();
            const userData = response?.data;
            setUsers(userData);
            setError('');
        } catch (err) {
            setError('Error fetching users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

  // If user is not logged in or not admin, redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role_name !== 'Administrator') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

    const handleDeleteClick = (userToDelete: User) => {
        setSelectedUser(userToDelete);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        setDeleteLoading(true);
        try {
            await adminService.deleteUser(selectedUser.id);

            setShowDeleteModal(false);
            setSelectedUser(null);

            await fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const handleEditClick = (userToEdit: User) => {
        setSelectedUser(userToEdit);
        setShowEditModal(true);
    };

    const handleConfirmEdit = async (updatedUser: Partial<User>) => {
        if (!selectedUser) return;

        setEditLoading(true);
        try {
            await adminService.updateUser(selectedUser.id, updatedUser);

            setShowEditModal(false);
            setSelectedUser(null);

            await fetchUsers();

            console.log('User updated successfully');
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user. Please try again.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
    };

    /**
     * Handle confirming the creation of a new user from the AddUserModal.
     * @param userData - Data for the new user
     */
    const handleConfirmAdd = async (userData: any) => {
      setAddLoading(true);
      try {
        await adminService.addUser(userData);
        setShowUserModal(false);
        await fetchUsers();
      } catch (err: any) {
        // Show error message if user creation fails
        setError(err.response?.data?.error || 'Failed to create user. Please try again.');
      } finally {
        setAddLoading(false);
      }
    };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-dark text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-1">Admin Panel</h1>
                <p className="mb-0">System Administration & Management</p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-light" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Statistics */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">System Statistics</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center p-3 bg-primary bg-opacity-10 rounded">
                    <h4 className="text-primary mb-1">{users.length}</h4>
                    <small className="text-muted">Total Users</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                    <h4 className="text-success mb-1">{users.filter(u => u.active).length}</h4>
                    <small className="text-muted">Active Users</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
                    <h4 className="text-warning mb-1">{users.filter(u => !u.active).length}</h4>
                    <small className="text-muted">Inactive Users</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 bg-info bg-opacity-10 rounded">
                    <h4 className="text-info mb-1">{new Set(users.map(u => u.role_name)).size}</h4>
                    <small className="text-muted">User Roles</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Tabs */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'users')}
                className="mb-3"
              >
                {/* Users Management */}
                <Tab eventKey="users" title="Users Management">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>User Management</h5>
                    {/* Button to open Add User modal */}
                    <Button 
                      variant="primary" 
                      onClick={() => setShowUserModal(true)}
                    >
                      Add New User
                    </Button>
                        {/* Add User Modal */}
                        <AddUserModal
                          show={showUserModal}
                          onHide={() => setShowUserModal(false)}
                          onConfirm={handleConfirmAdd}
                          loading={addLoading}
                        />
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2">Loading users...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>{user.email}</td>
                            <td><Badge bg="secondary">{user.role_name}</Badge></td>
                            <td>
                              <Badge bg={user.active ? 'success' : 'danger'}>
                                {user.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleEditClick(user)}
                              >
                                Edit
                              </Button>
                              <Button variant="outline-danger"
                                      size="sm"
                                      onClick={() => handleDeleteClick(user)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                {/* Roles Management */}
                <Tab eventKey="roles" title="Roles Management">
                  <RoleList />
                </Tab>

                {/* Device Management */}
                <Tab eventKey="devices" title="Device Management">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Device Management</h5>
                    <Button variant="success" disabled>
                      Add New Device
                    </Button>
                  </div>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Device management functionality will be available in a future version.
                  </div>
                </Tab>

                {/* System Settings */}
                <Tab eventKey="settings" title="System Settings">
                  <Row>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>
                          <h6 className="mb-0">General Settings</h6>
                        </Card.Header>
                        <Card.Body>
                          <Form>
                            <Form.Group className="mb-3">
                              <Form.Label>System Name</Form.Label>
                              <Form.Control type="text" defaultValue="EnerLink System" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Maintenance Mode</Form.Label>
                              <Form.Check type="switch" label="Enable maintenance mode" />
                            </Form.Group>
                            <Button variant="primary">Save Settings</Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>
                          <h6 className="mb-0">Alert Settings</h6>
                        </Card.Header>
                        <Card.Body>
                          <Form>
                            <Form.Group className="mb-3">
                              <Form.Label>Energy Threshold (kW)</Form.Label>
                              <Form.Control type="number" defaultValue="5" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Email Notifications</Form.Label>
                              <Form.Check type="switch" label="Enable email alerts" defaultChecked />
                            </Form.Group>
                            <Button variant="warning">Update Alerts</Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>

                {/* Reports */}
                <Tab eventKey="reports" title="Reports">
                  <Row>
                    <Col>
                      <h5 className="mb-3">System Reports</h5>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                        <Button variant="outline-primary" size="lg" disabled>
                          Generate User Report
                        </Button>
                        <Button variant="outline-success" size="lg" disabled>
                          Generate Energy Report
                        </Button>
                        <Button variant="outline-info" size="lg" disabled>
                          Generate System Status Report
                        </Button>
                        <Button variant="outline-warning" size="lg" disabled>
                          Generate Maintenance Report
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        <AddUserModal
            show={showUserModal}
            onHide={() => setShowUserModal(false)}
            onConfirm={handleConfirmAdd}
            loading={addLoading}
        />

        <DeleteUserModal
            show={showDeleteModal}
            onHide={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            userName={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ''}
            userEmail={selectedUser?.email || ''}
            loading={deleteLoading}
        />

        <EditUserModal
            show={showEditModal}
            onHide={handleCloseEditModal}
            onConfirm={handleConfirmEdit}
            user={selectedUser}
            loading={editLoading}
        />
    </Container>
  );
};

export default AdminPanel;