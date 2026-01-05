
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ContractFormData {
  id_customer: string;
  contract_number: string;
  signed_at?: string;
  contract_from?: string;
  contract_to?: string;
  status?: string;
}

interface CustomerOption {
  id: number;
  company?: string;
  name?: string;
}

const ContractForm: React.FC = () => {
  const [form, setForm] = useState<ContractFormData>({ id_customer: '', contract_number: '' });
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
    useEffect(() => {
      // Fetch customers for select
      fetch('http://localhost:8080/api/customers')
        .then(res => res.json())
        .then(data => setCustomers(data))
        .catch(() => setCustomers([]));
    }, []);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Convert id_customer to number before sending, always send status (default 'Signed')
      const payload = {
        ...form,
        id_customer: form.id_customer ? parseInt(form.id_customer, 10) : undefined,
        status: form.status || 'Signed',
      };
      const res = await fetch('http://localhost:8080/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { error: await res.text() };
      }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add contract');
      }
      setSuccess('Contract added successfully!');
      setTimeout(() => {
        navigate('/contracts');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Add New Contract</h2>
          <Button variant="secondary" onClick={() => navigate('/contracts')}>
            Back to Contract List
          </Button>
        </Card.Header>
        <Card.Body>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="id_customer">
                  <Form.Label>Customer</Form.Label>
                  <Form.Select
                    name="id_customer"
                    value={form.id_customer}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company || c.name || `ID: ${c.id}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="contract_number">
                  <Form.Label>Contract Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="contract_number"
                    value={form.contract_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="signed_at">
                  <Form.Label>Signed At</Form.Label>
                  <Form.Control
                    type="date"
                    name="signed_at"
                    value={form.signed_at || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="contract_from">
                  <Form.Label>Valid From</Form.Label>
                  <Form.Control
                    type="date"
                    name="contract_from"
                    value={form.contract_from || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="contract_to">
                  <Form.Label>Valid To</Form.Label>
                  <Form.Control
                    type="date"
                    name="contract_to"
                    value={form.contract_to || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={form.status || ''} onChange={handleChange}>
                <option value="">Select status</option>
                <option value="Signed">Signed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Contract'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ContractForm;
