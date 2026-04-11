
import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { UserService, User } from '../../services/userService';

const userService = new UserService();

const SalesList: React.FC = () => {
  const [salesReps, setSalesReps] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchSalesReps = async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers({
        per_page: 50,
        q: searchQuery.trim() || undefined,
      });
      // Filter only sales representatives (role_name === 'Sales Representative')
      const reps = (data.items || []).filter((u: User) => u.role_name?.toLowerCase().includes('sales'));
      setSalesReps(reps);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReps();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSalesReps(search);
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h2>Sales Representatives</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by name, surname, username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button variant="primary" type="submit">Search</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Loading sales representatives...</div>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {salesReps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">No sales representatives found.</td>
                </tr>
              ) : (
                salesReps.map(rep => (
                  <tr key={rep.id}>
                    <td>{rep.id}</td>
                    <td>{rep.username}</td>
                    <td>{rep.first_name} {rep.last_name}</td>
                    <td>{rep.email}</td>
                    <td>{rep.role_name}</td>
                    <td>{rep.active ? 'Active' : 'Inactive'}</td>
                    <td>{new Date(rep.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default SalesList;
