import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface PKWiU {
    id: number;
    pkwiu_nr: string;
    pkwiu_name: string;
}

interface EditPKWiUModalProps {
    show: boolean;
    onHide: () => void;
    pkwiu: PKWiU | null;
    onPkwiuEdited: () => void;
}

const EditPKWiUModal: React.FC<EditPKWiUModalProps> = ({ show, onHide, pkwiu, onPkwiuEdited }) => {
    const [pkwiuNr, setPkwiuNr] = useState(pkwiu?.pkwiu_nr || '');
    const [pkwiuName, setPkwiuName] = useState(pkwiu?.pkwiu_name || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        setPkwiuNr(pkwiu?.pkwiu_nr || '');
        setPkwiuName(pkwiu?.pkwiu_name || '');
    }, [pkwiu]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!pkwiu) return;

            const response = await fetch(`http://localhost:8080/api/pkwiu/${pkwiu.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pkwiu_nr: pkwiuNr,
                    pkwiu_name: pkwiuName
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update PKWiU code');
            }

            onPkwiuEdited();
            onHide();
        } catch (err: any) {
            setError('Error updating PKWiU code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit PKWiU Code</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>PKWiU Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={pkwiuNr}
                            onChange={e => setPkwiuNr(e.target.value)}
                            placeholder="Enter PKWiU number"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>PKWiU Name</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={pkwiuName}
                            onChange={e => setPkwiuName(e.target.value)}
                            placeholder="Enter PKWiU description"
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

export default EditPKWiUModal;