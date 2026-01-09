import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Tag {
    id: number;
    name: string;
    created_at?: string;
}

const TagList: React.FC = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const loadTags = async (search: string = '') => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`http://localhost:8080/api/tags`);
            if (!response.ok) throw new Error('Failed to fetch tags');

            const data = await response.json();

            // Client-side search filtering
            let filteredTags = data;
            if (search.trim()) {
                filteredTags = filteredTags.filter((tag: Tag) =>
                    tag.name.toLowerCase().includes(search.toLowerCase())
                );
            }

            setTags(filteredTags);
        } catch (err: any) {
            setError('Error loading tags.');
            setTags([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadTags(searchQuery);
    };

    const handleEditTag = (tag: Tag) => {
        setTagToEdit(tag);
        setShowEditModal(true);
    };

    const handleDeleteTag = (tag: Tag) => {
        setTagToDelete(tag);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!tagToDelete) return;

        setDeleteLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8080/api/tags/${tagToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete tag');

            setSuccess('Tag deleted successfully!');
            setShowDeleteModal(false);
            setTagToDelete(null);
            loadTags(searchQuery);
        } catch (err: any) {
            setError('Error deleting tag.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleTagAdded = () => {
        setSuccess('Tag added successfully!');
        loadTags(searchQuery);
    };

    const handleTagEdited = () => {
        setSuccess('Tag updated successfully!');
        loadTags(searchQuery);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        loadTags();
    }, []);

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={handleBackToDashboard}
                                    className="me-3"
                                >
                                    &larr; Back to Dashboard
                                </Button>
                                <h4 className="mb-0">Tag Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add Tag
                            </Button>
                        </Card.Header>

                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search tags by name..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Button variant="outline-secondary" type="submit">
                                                Search
                                            </Button>
                                        </InputGroup>
                                    </Form>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex gap-2 justify-content-end">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery('');
                                                loadTags('');
                                            }}
                                        >
                                            Clear Filter
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success" className="mb-3">
                                    {success}
                                </Alert>
                            )}

                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <div className="mt-2">Loading tags...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 text-muted">
                                        Showing {tags.length} tags
                                    </div>

                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {tags.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-4">
                                                        No tags found
                                                    </td>
                                                </tr>
                                            ) : (
                                                tags.map((tag) => (
                                                    <tr key={tag.id}>
                                                        <td>
                                                            <code>{tag.id}</code>
                                                        </td>
                                                        <td>
                                                            <Badge bg="info" className="me-2">
                                                                {tag.name}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                {/*TODO: add these actions */}
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditTag(tag)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteTag(tag)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TagList;