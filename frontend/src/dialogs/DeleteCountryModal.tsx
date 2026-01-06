import React from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

interface DeleteCountryModalProps {
  show: boolean;
  onHide: () => void;
  countryName: string;
  loading: boolean;
  error: string;
  onConfirm: () => void;
}

const DeleteCountryModal: React.FC<DeleteCountryModalProps> = ({ show, onHide, countryName, loading, error, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Usuń kraj</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Czy na pewno chcesz usunąć kraj <b>{countryName}</b>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Anuluj
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Usuń'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCountryModal;
