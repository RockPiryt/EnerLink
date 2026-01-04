import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { RoleService } from '../services/roleService';
import { Role } from '../models/role';

interface AddUserData {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role_name: string;
    password: string;
    active: boolean;
}

interface AddUserModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (userData: AddUserData) => void;
    loading?: boolean;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
                                                       show,
                                                       onHide,
                                                       onConfirm,
                                                       loading = false
                                                   }) => {
    const [formData, setFormData] = useState<AddUserData>({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        role_name: '',
        password: '',
        active: true
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    useEffect(() => {
        const fetchRoles = async () => {
            setRolesLoading(true);
            try {
                const data = await new RoleService().getRoles();
                setRoles(data);
            } catch (e) {
                setRoles([]);
            } finally {
                setRolesLoading(false);
            }
        };
        fetchRoles();
    }, []);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};


        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.role_name) {
            newErrors.role_name = 'Role is required';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onConfirm(formData);
        }
    };

    const handleClose = () => {
        setFormData({
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            role_name: '',
            password: '',
            active: true
        });
        setErrors({});
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="bg-success text-white">
                <Modal.Title>
                    <i className="fas fa-user-plus me-2"></i>
                    Add New User
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Username <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            isInvalid={!!errors.username}
                            placeholder="Enter username"
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            name="active"
                            label="Active user"
                            checked={formData.active}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            First Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            isInvalid={!!errors.first_name}
                            placeholder="Enter first name"
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.first_name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Last Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            isInvalid={!!errors.last_name}
                            placeholder="Enter last name"
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.last_name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                            placeholder="Enter email"
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Role <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                            name="role_name"
                            value={formData.role_name}
                            onChange={handleChange}
                            isInvalid={!!errors.role_name}
                            disabled={loading || rolesLoading}
                        >
                            <option value="">{rolesLoading ? 'Loading roles...' : 'Select role'}</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.role_name}>
                                    {role.role_name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.role_name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Password <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                            placeholder="Enter password"
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Password must be at least 6 characters long
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Creating...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-user-plus me-2"></i>
                                Create User
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddUserModal;