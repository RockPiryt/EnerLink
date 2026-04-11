import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import ContractHistoryModal from './ContractHistoryModal';
import { getContractById, updateContract } from '../../services/contractService';
import { getCustomers, Customer } from '../../services/customer/customerService';

const ContractDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [contract, setContract] = useState<any | null>(null);
    const [form, setForm] = useState<any | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // State for contract history modal
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch contract details
            setLoading(true);
            try {
                const data = await getContractById(id!);
                setContract(data);
                setForm(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }

            // Fetch customers for select
            setCustomersLoading(true);
            try {
                const response = await getCustomers();
                const items = Array.isArray(response.data)
                    ? response.data
                    : (response.data?.items ?? []);
                setCustomers(items);
            } catch {
                setCustomers([]);
            } finally {
                setCustomersLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!form) return;

        if (name === 'id_customer') {
            setForm({ ...form, [name]: parseInt(value, 10) });
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
            await updateContract(id!, form);
            setSuccess('Contract updated successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleBackToContracts = () => {
        navigate('/contracts');
    };

    if (loading) {
        return (
            <Container fluid className="py-4">
                <Row>
                    <Col>
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <div className="mt-2">Loading contract details...</div>
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
                                <Button variant="outline-secondary" onClick={handleBackToContracts}>
                                    Back to Contract List
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
                                    onClick={handleBackToContracts}
                                    className="me-3"
                                >
                                    &larr; Back to Contract List
                                </Button>
                                <h4 className="mb-0">Edit Contract</h4>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="ms-3"
                                    onClick={() => setShowHistory(true)}
                                >
                                    Show Change History
                                </Button>
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
                                {/* Contract Information Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">Contract Information</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="id_customer">
                                                <Form.Label>Customer *</Form.Label>
                                                <Form.Select
                                                    name="id_customer"
                                                    value={form.id_customer || ''}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={customersLoading}
                                                >
                                                    <option value="">
                                                        {customersLoading ? 'Loading customers...' : 'Select customer'}
                                                    </option>
                                                    {customers.map((c) => (
                                                        <option key={c.id} value={c.id}>
                                                            {c.company || c.name || `ID: ${c.id}`}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {customersLoading && (
                                                    <Form.Text className="text-muted">
                                                        <Spinner size="sm" className="me-1" />
                                                        Loading customers...
                                                    </Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="contract_number">
                                                <Form.Label>Contract Number *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="contract_number"
                                                    value={form.contract_number}
                                                    onChange={handleChange}
                                                    placeholder="Enter contract number (e.g., CNTR-2025-001)"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Contract Dates Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">Contract Dates</h5>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="signed_at">
                                                <Form.Label>Signed At</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="signed_at"
                                                    value={form.signed_at || ''}
                                                    onChange={handleChange}
                                                />
                                                <Form.Text className="text-muted">
                                                    Date when the contract was signed
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="contract_from">
                                                <Form.Label>Valid From</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="contract_from"
                                                    value={form.contract_from || ''}
                                                    onChange={handleChange}
                                                />
                                                <Form.Text className="text-muted">
                                                    Contract start date
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="contract_to">
                                                <Form.Label>Valid To</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="contract_to"
                                                    value={form.contract_to || ''}
                                                    onChange={handleChange}
                                                />
                                                <Form.Text className="text-muted">
                                                    Contract end date (optional)
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Status Section */}
                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">Contract Status</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="status">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select
                                                    name="status"
                                                    value={form.status || ''}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select status</option>
                                                    <option value="Signed">Signed</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </Form.Select>
                                                <Form.Text className="text-muted">
                                                    Current status of the contract
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
                                        disabled={saving}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        {saving && <Spinner as="span" animation="border" size="sm" />}
                                        {saving ? 'Saving Changes...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={handleBackToContracts}
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

            {/* Contract History Modal */}
            {form && form.id && (
                <ContractHistoryModal
                    contractId={form.id}
                    show={showHistory}
                    onHide={() => setShowHistory(false)}
                />
            )}
        </Container>
    );
};

export default ContractDetails;