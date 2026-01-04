import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import AddRoleModal from '../dialogs/AddRoleModal';
import EditRoleModal from '../dialogs/EditRoleModal';
import { Role } from '../models/role';
import { RoleService } from '../services/roleService';

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const roleService = new RoleService();

  const fetchRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (err: any) {
      setError('Błąd podczas pobierania ról');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = () => setShowAddModal(true);
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  return (
    <div>
      <h2>Zarządzanie rolami</h2>
      <Button onClick={handleAddRole} className="mb-3">Dodaj rolę</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nazwa roli</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>
                  <Button size="sm" onClick={() => handleEditRole(role)}>Edytuj</Button>
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
    </div>
  );
};

export default RoleList;
