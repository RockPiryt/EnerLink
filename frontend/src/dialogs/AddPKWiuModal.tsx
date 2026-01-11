import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface AddPKWiUModalProps {
    show: boolean;
    onHide: () => void;
    onPkwiuAdded: () => void;
}

const AddPKWiUModal: React.FC<AddPKWiUModalProps> = ({ show, onHide, onPkwiuAdded }) => {
    const [pkwiuNr, setPkwiuNr] = useState('');
    const [pkwiuName, setPkwiuName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/pkwiu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pkwiu_nr: pkwiuNr,
                    pkwiu_name: pkwiuName
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add PKWiU code');
            }

            setPkwiuNr('');
            setPkwiuName('');
            onPkwiuAdded();
            onHide();
        } catch (err: any) {
            setError('Error adding PKWiU code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add PKWiU Code</Modal.Title>
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
                        {loading ? 'Adding...' : 'Add'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddPKWiUModal;