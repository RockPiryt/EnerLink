import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { getCustomerById, updateCustomer } from '../../services/customer/customerService';

const CustomerDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<any | null>(null);
    const [form, setForm] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            setLoading(true);
            try {
                const data = await getCustomerById(id!);
                setCustomer(data);
                setForm(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
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
        setSaving(true);
        try {
            await updateCustomer(id!, form);
            setSuccess('Customer updated successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleBackToCustomers = () => {
        navigate('/customers');
    };

    if (loading) {
        return (
            <Container fluid className="py-4">
                <Row>
                    <Col>
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <div className="mt-2">Loading customer details...</div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (error && !form) {
        return (
            <Container fluid className="py-4">
                <Row>
                    <Col>
                        <Alert variant="danger">
                            Error: {error}
                            <div className="mt-2">
                                <Button variant="outline-secondary" onClick={handleBackToCustomers}>
                                    Back to Customer Management
                                </Button>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!form) return null;

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
                                    &larr; Back to Customer List
                                </Button>
                                <h4 className="mb-0">Edit Customer</h4>
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
                                        <Col md={6}>
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
                                        <Col md={6}>
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
                                        <Col md={6}>
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
                                        <Col md={3}>
                                            <Form.Group className="mb-3" controlId="address.building_nr">
                                                <Form.Label>Building No.</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="address.building_nr"
                                                    value={form.address?.building_nr || ''}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 123"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-3" controlId="address.apartment_nr">
                                                <Form.Label>Apartment No.</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="address.apartment_nr"
                                                    value={form.address?.apartment_nr || ''}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 4A"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="address.post_code">
                                                <Form.Label>Postal Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="address.post_code"
                                                    value={form.address?.post_code || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter postal code"
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
                                        disabled={saving}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        {saving && <Spinner as="span" animation="border" size="sm" />}
                                        {saving ? 'Saving Changes...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={handleBackToCustomers}
                                        disabled={saving}
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

export default CustomerDetails;