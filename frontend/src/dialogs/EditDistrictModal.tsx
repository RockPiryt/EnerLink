import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface District {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
}

interface EditDistrictModalProps {
    show: boolean;
    onHide: () => void;
    district: District | null;
    onDistrictEdited: () => void;
}

const EditDistrictModal: React.FC<EditDistrictModalProps> = ({ show, onHide, district, onDistrictEdited }) => {
    const [name, setName] = useState(district?.name || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        setName(district?.name || '');
    }, [district]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!district) return;

            const response = await fetch(`http://localhost:8080/api/address/districts/${district.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update district');
            }

            onDistrictEdited();
            onHide();
        } catch (err: any) {
            setError('Error updating district.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit District</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>District Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter district name"
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

export default EditDistrictModal;