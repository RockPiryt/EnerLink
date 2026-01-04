import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import Role from "../enums/role";

interface BackendUser {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role_name: string;
    active: boolean;
}

interface EditUserModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (updatedUser: Partial<BackendUser>) => void;
    user: BackendUser | null;
    loading?: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
                                                         show,
                                                         onHide,
                                                         onConfirm,
                                                         user,
                                                         loading = false
                                                     }) => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        role_name: '',
        active: true
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role_name: user.role_name,
                active: user.active
            });
            setErrors({});
        }
    }, [user]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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
            active: true
        });
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
        setErrors({});
        onHide();
    };

    if (!user) return null;

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <i className="fas fa-user-edit me-2"></i>
                    Edit User
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Alert variant="info">
                        <i className="fas fa-info-circle me-2"></i>
                        You are editing user: <strong>{user.first_name} {user.last_name}</strong>
                    </Alert>

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
                            disabled={loading}
                        >
                            <option value="">Select role</option>
                            {Object.values(Role).map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.role_name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            name="active"
                            label="Active User"
                            checked={formData.active}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <Form.Text className="text-muted">
                            Inactive users cannot log in to the system
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
                        variant="primary"
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
                                Updating...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Save Changes
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditUserModal;