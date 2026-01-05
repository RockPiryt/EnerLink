import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


interface AddressData {
  street_name?: string;
  building_number?: string;
  apartment_number?: string;
  postal_code?: string;
  city?: string;
  province?: string;
  country?: string;
}

interface CustomerFormData {
  company: string;
  email: string;
  nip?: string;
  phone?: string;
  description?: string;
  address?: AddressData;
}

const CustomerForm: React.FC = () => {
  const [form, setForm] = useState<CustomerFormData>({ company: '', email: '', address: {} });
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addrField = name.replace('address.', '');
      setForm({
        ...form,
        address: {
          ...form.address,
          [addrField]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('http://localhost:8080/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          address: form.address,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add customer');
      }
      setSuccess('Customer added successfully!');
      setForm({ company: '', email: '', address: {} });
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
          <h2 className="mb-0">Add New Customer</h2>
          <Button variant="secondary" onClick={() => navigate('/customers')}>
            Back to Customer List
          </Button>
        </Card.Header>
        <Card.Body>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="company">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="nip">
                  <Form.Label>NIP</Form.Label>
                  <Form.Control
                    type="text"
                    name="nip"
                    value={form.nip || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Address fields */}
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="address.street_name">
                  <Form.Label>Street Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street_name"
                    value={form.address?.street_name || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3" controlId="address.building_number">
                  <Form.Label>Building No.</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.building_number"
                    value={form.address?.building_number || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3" controlId="address.apartment_number">
                  <Form.Label>Apartment No.</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.apartment_number"
                    value={form.address?.apartment_number || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="address.postal_code">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.postal_code"
                    value={form.address?.postal_code || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="address.city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={form.address?.city || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="address.province">
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.province"
                    value={form.address?.province || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="address.country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.country"
                    value={form.address?.country || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                rows={2}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Customer'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerForm;
