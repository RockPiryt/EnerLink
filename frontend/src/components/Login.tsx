import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setError('Invalid login credentials');
    }
    
    setIsLoading(false);
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h2 className="mb-2">EnerLink</h2>
              <p className="mb-0">Energy Management System</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                </Form.Group>
                
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                
                <Button 
                  variant="primary"
                  type="submit" 
                  className="w-100 mb-3"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
              
              <Card className="bg-light">
                <Card.Body className="p-3">
                  <h6 className="text-muted mb-2">Test Accounts:</h6>
                  <div className="small">
                    <p className="mb-1"><strong>Administrator:</strong></p>
                    <p className="mb-1">Email: <code>admin@enerlink.com</code></p>
                    <p className="mb-2">Password: <code>admin123</code></p>
                    
                    <p className="mb-1"><strong>Manager:</strong></p>
                    <p className="mb-1">Email: <code>sarah.johnson@enerlink.com</code></p>
                    <p className="mb-0">Password: <code>manager123</code></p>
                  </div>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;