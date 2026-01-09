import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface AddTariffModalProps {
    show: boolean;
    onHide: () => void;
    onTariffAdded: () => void;
}

const AddTariffModal: React.FC<AddTariffModalProps> = ({ show, onHide, onTariffAdded }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/supplier/tariffs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add tariff');
            }

            setName('');
            onTariffAdded();
            onHide();
        } catch (err: any) {
            setError('Error adding tariff.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Energy Tariff</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Tariff Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter tariff name"
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddTariffModal;