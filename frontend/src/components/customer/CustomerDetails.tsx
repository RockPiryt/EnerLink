
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

interface AddressData {
  street_name?: string;
  building_nr?: string;
  apartment_nr?: string;
  post_code?: string;
  city?: string;
  province?: string;
  country?: string;
}

interface CustomerData {
  id: number;
  company: string;
  email: string;
  nip?: string;
  phone?: string;
  description?: string;
  address?: AddressData;
}

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [form, setForm] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/customers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch customer');
        return res.json();
      })
      .then((data) => {
        setCustomer(data);
        setForm(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!form) return;
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
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update customer');
      }
      setSuccess('Customer updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!form) return null;

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Edit Customer</h2>
          <Button variant="secondary" onClick={() => navigate('/customers')}>
            Back to Customer List
          </Button>
        </Card.Header>
        <Card.Body>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
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
            <Form.Group className="mb-3" controlId="nip">
              <Form.Label>NIP</Form.Label>
              <Form.Control
                type="text"
                name="nip"
                value={form.nip || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={form.phone || ''}
                onChange={handleChange}
              />
            </Form.Group>
            {/* Address fields */}
            <Form.Group className="mb-3" controlId="address.street_name">
              <Form.Label>Street Name</Form.Label>
              <Form.Control
                type="text"
                name="address.street_name"
                value={form.address?.street_name || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address.building_nr">
              <Form.Label>Building No.</Form.Label>
              <Form.Control
                type="text"
                name="address.building_nr"
                value={form.address?.building_nr || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address.apartment_nr">
              <Form.Label>Apartment No.</Form.Label>
              <Form.Control
                type="text"
                name="address.apartment_nr"
                value={form.address?.apartment_nr || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address.post_code">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                name="address.post_code"
                value={form.address?.post_code || ''}
                onChange={handleChange}
              />
            </Form.Group>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerDetails;
