import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import AddRoleModal from '../../dialogs/AddRoleModal';
import EditRoleModal from '../../dialogs/EditRoleModal';
import DeleteRoleModal from '../../dialogs/DeleteRoleModal';
import { Role } from '../../models/role';
import { RoleService } from '../../services/roleService';

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const roleService = new RoleService();

  const fetchRoles = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (err: any) {
      setError('Error while fetching roles');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => setShowAddModal(true);
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };
  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setDeleteLoading(true);
    setError('');
    setSuccess('');
    try {
      await roleService.deleteRole(roleToDelete.id);
      setSuccess('Role has been deleted.');
      setShowDeleteModal(false);
      setRoleToDelete(null);
      fetchRoles();
    } catch (err: any) {
      setError('Error while deleting role.');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);



  return (
    <div>
      <h2>Role management</h2>
      <Button onClick={handleAddRole} className="mb-3">Add role</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Role name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td>{role.role_name}</td>
                <td>
                  <Button size="sm" onClick={() => handleEditRole(role)} className="me-2">Edytuj</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDeleteRole(role)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <AddRoleModal show={showAddModal} onHide={() => setShowAddModal(false)} onRoleAdded={fetchRoles} />
      {selectedRole && (
        <EditRoleModal show={showEditModal} onHide={() => setShowEditModal(false)} role={selectedRole} onRoleUpdated={fetchRoles} />
      )}
      {roleToDelete && (
        <DeleteRoleModal
          show={showDeleteModal}
          onHide={() => { setShowDeleteModal(false); setRoleToDelete(null); }}
          onConfirm={handleConfirmDelete}
          roleName={roleToDelete.role_name}
          loading={deleteLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default RoleList;
