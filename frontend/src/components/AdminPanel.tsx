import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Tab, Tabs, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

interface BackendUser {
  id: string;
  first_name: string;
  last_name: string;
  e_mail: string;
  role_name: string;
  active: boolean;
}

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/users/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUsers(userData);
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

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
                    <Button 
                      variant="primary" 
                      onClick={() => setShowUserModal(true)}
                    >
                      Add New User
                    </Button>
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
                            <td>{user.e_mail}</td>
                            <td><Badge bg="secondary">{user.role_name}</Badge></td>
                            <td>
                              <Badge bg={user.active ? 'success' : 'danger'}>
                                {user.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2" disabled>
                                Edit
                              </Button>
                              <Button variant="outline-danger" size="sm" disabled>
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
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

      {/* Add User Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter first name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter last name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select>
                <option>Select role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanel;