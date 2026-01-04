import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Role } from '../models/role';
import { RoleService } from '../services/roleService';

interface EditRoleModalProps {
  show: boolean;
  onHide: () => void;
  role: Role;
  onRoleUpdated: () => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ show, onHide, role, onRoleUpdated }) => {
  const [roleName, setRoleName] = useState(role.role_name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = async () => {
    setLoading(true);
    setError('');
    try {
      await new RoleService().editRole(role.id, { role_name: roleName });
      onRoleUpdated();
      onHide();
    } catch (err: any) {
      setError('Error while editing role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Role name</Form.Label>
            <Form.Control
              type="text"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>Cancel</Button>
        <Button variant="primary" onClick={handleEdit} disabled={loading || !roleName}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditRoleModal;
