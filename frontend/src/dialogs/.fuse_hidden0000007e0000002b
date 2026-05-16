import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { addCountry } from '../services/countryService';

interface AddCountryModalProps {
    show: boolean;
    onHide: () => void;
    onCountryAdded: () => void;
}

const AddCountryModal: React.FC<AddCountryModalProps> = ({ show, onHide, onCountryAdded }) => {
    const [name, setName] = useState('');
    const [shortcut, setShortcut] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await addCountry({ name, shortcut });
            setName('');
            setShortcut('');
            onCountryAdded();
            onHide();
        } catch (err: any) {
            setError('Error adding country.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Country</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Country Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter country name"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Shortcut</Form.Label>
                        <Form.Control
                            type="text"
                            value={shortcut}
                            onChange={e => setShortcut(e.target.value)}
                            placeholder="Enter country code"
                            required
                            maxLength={5}
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

export default AddCountryModal;