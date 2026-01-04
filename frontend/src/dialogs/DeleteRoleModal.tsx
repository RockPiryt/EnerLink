import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

interface DeleteRoleModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    roleName: string;
    loading?: boolean;
    error?: string;
}

const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
    show,
    onHide,
    onConfirm,
    roleName,
    loading = false,
    error = ''
}) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title>
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Confirm role deletion
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Alert variant="danger">
                    <Alert.Heading>Warning: This action cannot be undone!</Alert.Heading>
                    <p className="mb-0">
                        Deleting a role will permanently remove it from the system.
                    </p>
                </Alert>
                <div className="mt-3">
                    <p className="mb-2">Are you sure you want to delete this role?</p>
                    <div className="bg-light p-3 rounded">
                        <p className="mb-1">
                            <strong>Role name:</strong> {roleName}
                        </p>
                    </div>
                </div>
                <div className="mt-3">
                    <small className="text-muted">
                        Please confirm that you want to proceed with this deletion.
                    </small>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onHide}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Deleting...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-trash me-2"></i>
                            Delete role
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteRoleModal;
