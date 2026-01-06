import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ProviderFormData {
    name: string;
}

const ProviderForm: React.FC = () => {
    const [form, setForm] = useState<ProviderFormData>({
        name: ''
    });
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:8080/api/providers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add provider');
            }

            setSuccess('Provider added successfully!');
            setForm({ name: '' }); // Reset form
            setTimeout(() => {
                navigate('/providers');
            }, 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToProviders = () => {
        navigate('/providers');
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
                                    onClick={handleBackToProviders}
                                    className="me-3"
                                >
                                    &larr; Back to Energy Provider Management
                                </Button>
                                <h4 className="mb-0">Add New Energy Provider</h4>
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
                                {/* Provider Information Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">Provider Information</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Provider Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter provider name"
                                                    required
                                                />
                                                <Form.Text className="text-muted">
                                                    Enter the official name of the energy provider
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>
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
                                        {loading ? 'Adding Provider...' : 'Add Provider'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={handleBackToProviders}
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

export default ProviderForm;