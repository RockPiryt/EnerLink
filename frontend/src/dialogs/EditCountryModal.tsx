import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Country } from '../services/countryService';

interface EditCountryModalProps {
  show: boolean;
  onHide: () => void;
  country: Country | null;
  onCountryEdited: () => void;
}

const EditCountryModal: React.FC<EditCountryModalProps> = ({ show, onHide, country, onCountryEdited }) => {
  const [name, setName] = useState(country?.name || '');
  const [shortcut, setShortcut] = useState(country?.shortcut || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setName(country?.name || '');
    setShortcut(country?.shortcut || '');
  }, [country]);

  // Placeholder for future backend integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // TODO: Call updateCountry when backend is ready
    setTimeout(() => {
      setLoading(false);
      onCountryEdited();
      onHide();
    }, 1000);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edytuj kraj</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Nazwa kraju</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skrót</Form.Label>
            <Form.Control
              type="text"
              value={shortcut}
              onChange={e => setShortcut(e.target.value)}
              required
              maxLength={5}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Anuluj
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditCountryModal;
