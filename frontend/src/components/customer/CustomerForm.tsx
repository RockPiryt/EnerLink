import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
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

    const handleBackToCustomers = () => {
        navigate('/customers');
    };

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
                                    onClick={handleBackToCustomers}
                                    className="me-3"
                                >
                                    &larr; Back to Customer Management
                                </Button>
                                <h4 className="mb-0">Add New Customer</h4>
                            </div>
                        </Card.Header>

                        <Card.Body>
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

                            <Form onSubmit={handleSubmit}>
                                {/* Basic Information Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">Basic Information</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="company">
                                                <Form.Label>Company Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="company"
                                                    value={form.company}
                                                    onChange={handleChange}
                                                    placeholder="Enter company name"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Label>Email Address *</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter email"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="nip">
                                                <Form.Label>NIP (Tax Number)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="nip"
                                                    value={form.nip || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter NIP"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="phone">
                                                <Form.Label>Phone Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="phone"
                                                    value={form.phone || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter phone"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Address Information Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">Address Information</h5>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="address.street_name">
                                                <Form.Label>Street Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="address.street_name"
                                                    value={form.address?.street_name || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter street name"
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
                                                    placeholder="Enter builing number"
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
                                                    placeholder="Enter apartment number"
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
                                                    placeholder="Enter postal code"
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
                                                    placeholder="Enter city"
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
                                                    placeholder="Enter province"
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
                                                    placeholder="Enter country"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Additional Information Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">Additional Information</h5>
                                    <Form.Group className="mb-3" controlId="description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            value={form.description || ''}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Enter additional notes about the customer..."
                                        />
                                    </Form.Group>
                                </div>

                                {/* Form Actions */}
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        {loading && <Spinner as="span" animation="border" size="sm" />}
                                        {loading ? 'Adding Customer...' : 'Add Customer'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={handleBackToCustomers}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomerForm;