import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface City {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
}

interface EditCityModalProps {
    show: boolean;
    onHide: () => void;
    city: City | null;
    onCityEdited: () => void;
}

const EditCityModal: React.FC<EditCityModalProps> = ({ show, onHide, city, onCityEdited }) => {
    const [name, setName] = useState(city?.name || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        setName(city?.name || '');
    }, [city]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!city) return;

            const response = await fetch(`http://localhost:8080/api/address/cities/${city.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update city');
            }

            onCityEdited();
            onHide();
        } catch (err: any) {
            setError('Error updating city.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit City</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>City Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter city name (e.g., New York)"
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

export default EditCityModal;