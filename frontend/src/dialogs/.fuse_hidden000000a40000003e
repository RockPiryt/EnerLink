import React from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

interface DeleteCityModalProps {
    show: boolean;
    onHide: () => void;
    cityName: string;
    loading: boolean;
    error: string;
    onConfirm: () => void;
}

const DeleteCityModal: React.FC<DeleteCityModalProps> = ({ show, onHide, cityName, loading, error, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete City</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Are you sure you want to delete city <b>{cityName}</b>?</p>
                <p className="text-muted small">This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner size="sm" animation="border" className="me-1" />
                            Deleting...
                        </>
                    ) : (
                        'Delete'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteCityModal;