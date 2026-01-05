import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const handleUsersList = () => {
    navigate('/users');
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-1">EnerLink Dashboard</h1>
                <p className="mb-0">Energy Management System</p>
              </div>
              <div className="d-flex gap-2">
                {user.role_name === 'Administrator' && (
                  <Button variant="outline-light" onClick={handleAdminPanel}>
                    Admin Panel
                  </Button>
                )}
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h3>Welcome back, {user.first_name}!</h3>
              <p className="text-muted mb-0">Here's your energy management overview.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Information */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Role:</strong> <Badge bg="secondary">{user.role_name || 'User'}</Badge></p>
                  <p><strong>Status:</strong> 
                    <Badge bg={user.active ? 'success' : 'danger'} className="ms-2">
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation to all subpages */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">System Navigation</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2 d-md-flex flex-wrap">
                <Button variant="outline-primary" size="lg" onClick={() => navigate('/users')}>Users</Button>
                <Button variant="outline-secondary" size="lg" onClick={() => navigate('/roles')}>Roles</Button>
                <Button variant="outline-success" size="lg" onClick={() => navigate('/customers')}>Customers</Button>
                <Button variant="outline-info" size="lg" onClick={() => navigate('/contracts')}>Contracts</Button>
                <Button variant="outline-warning" size="lg" onClick={() => navigate('/providers')}>Energy Providers</Button>
                <Button variant="outline-dark" size="lg" onClick={() => navigate('/sales')}>Sales Representatives</Button>
                <Button variant="outline-primary" size="lg" onClick={() => navigate('/tags')}>Tags</Button>
                <Button variant="outline-secondary" size="lg" onClick={() => navigate('/analytics')}>Analytics</Button>
                <Button variant="outline-success" size="lg" onClick={() => navigate('/manager')}>Manager Panel</Button>
                <Button variant="outline-info" size="lg" onClick={() => navigate('/dictionary/countries')}>Country Dictionary</Button>
                <Button variant="outline-info" size="lg" onClick={() => navigate('/dictionary/cities')}>City Dictionary</Button>
                <Button variant="outline-info" size="lg" onClick={() => navigate('/dictionary/provinces')}>Province Dictionary</Button>
                <Button variant="outline-info" size="lg" onClick={() => navigate('/dictionary/pkwiu')}>PKWiU Dictionary</Button>
                <Button variant="outline-info" size="lg" onClick={() => navigate('/dictionary/tariffs')}>Tariff Dictionary</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;