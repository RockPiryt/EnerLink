import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { RoleService } from '../services/roleService';

interface AddRoleModalProps {
  show: boolean;
  onHide: () => void;
  onRoleAdded: () => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ show, onHide, onRoleAdded }) => {
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      await new RoleService().addRole({ name: roleName });
      setRoleName('');
      onRoleAdded();
      onHide();
    } catch (err: any) {
      setError('Error while adding role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add role</Modal.Title>
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
        <Button variant="primary" onClick={handleAdd} disabled={loading || !roleName}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRoleModal;
