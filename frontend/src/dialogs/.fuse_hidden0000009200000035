import React from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

interface DeleteDistrictModalProps {
    show: boolean;
    onHide: () => void;
    districtName: string;
    loading: boolean;
    error: string;
    onConfirm: () => void;
}

const DeleteDistrictModal: React.FC<DeleteDistrictModalProps> = ({ show, onHide, districtName, loading, error, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete District</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Are you sure you want to delete district <b>{districtName}</b>?</p>
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

export default DeleteDistrictModal;