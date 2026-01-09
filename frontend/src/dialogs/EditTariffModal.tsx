import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface Tariff {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
}

interface EditTariffModalProps {
    show: boolean;
    onHide: () => void;
    tariff: Tariff | null;
    onTariffEdited: () => void;
}

const EditTariffModal: React.FC<EditTariffModalProps> = ({ show, onHide, tariff, onTariffEdited }) => {
    const [name, setName] = useState(tariff?.name || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        setName(tariff?.name || '');
    }, [tariff]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!tariff) return;

            const response = await fetch(`http://localhost:8080/api/supplier/tariffs/${tariff.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update tariff');
            }

            onTariffEdited();
            onHide();
        } catch (err: any) {
            setError('Error updating tariff.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Energy Tariff</Modal.Title>
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
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditTariffModal;