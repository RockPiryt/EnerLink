import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Container, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Customer {
  id: number;
  company?: string;
  name?: string;
  email: string;
  phone?: string;
  active?: boolean;
}


const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/customers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch customers');
        return res.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Button variant="outline-secondary" className="me-3" onClick={() => navigate('/dashboard')}>
              &larr; Back to Dashboard
            </Button>
            <h2 className="mb-0">Customer List</h2>
          </div>
          <Button variant="primary" onClick={() => navigate('/customers/new')}>
            Add Customer
          </Button>
        </Card.Header>
        <Card.Body>
          {loading && <Spinner animation="border" variant="primary" />}
          {error && <Alert variant="danger">Error: {error}</Alert>}
          {!loading && !error && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company/Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.company || c.name || '-'}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || '-'}</td>
                    <td>{c.active ? 'Active' : 'Inactive'}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/customers/${c.id}`)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => { setCustomerToDelete(c); setShowConfirm(true); }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this customer?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (customerToDelete) {
                    setCustomers(customers.filter(c => c.id !== customerToDelete.id));
                  }
                  setShowConfirm(false);
                  setCustomerToDelete(null);
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerList;
