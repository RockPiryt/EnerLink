import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCountries, Country } from '../../services/countryService';
import AddCountryModal from '../../dialogs/AddCountryModal';
import EditCountryModal from '../../dialogs/EditCountryModal';
import DeleteCountryModal from '../../dialogs/DeleteCountryModal';

const CountryList: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCountries, setTotalCountries] = useState(0);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [countryToDelete, setCountryToDelete] = useState<Country | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const loadCountries = async (page: number = 1, search: string = '', active?: boolean) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = await getCountries();

            // Client-side filtering for now
            let filteredCountries = data;

            if (search.trim()) {
                filteredCountries = filteredCountries.filter(country =>
                    country.name.toLowerCase().includes(search.toLowerCase()) ||
                    country.shortcut.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (active !== undefined) {
                filteredCountries = filteredCountries.filter(country => country.is_active === active);
            }

            setCountries(filteredCountries);
            setTotalCountries(filteredCountries.length);
            setTotalPages(Math.ceil(filteredCountries.length / 20));
            setCurrentPage(page);
        } catch (err: any) {
            setError('Błąd podczas pobierania krajów.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadCountries(1, searchQuery, activeFilter);
    };

    const handleFilterChange = (active?: boolean) => {
        setActiveFilter(active);
        setCurrentPage(1);
        loadCountries(1, searchQuery, active);
    };

    const handleEditCountry = (country: Country) => {
        setSelectedCountry(country);
        setShowEditModal(true);
    };

    const handleDeleteCountry = (country: Country) => {
        setCountryToDelete(country);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteLoading(true);
        setTimeout(() => {
            setDeleteLoading(false);
            setShowDeleteModal(false);
            setCountryToDelete(null);
            setSuccess('Kraj został usunięty (symulacja).');
            loadCountries(currentPage, searchQuery, activeFilter);
        }, 1000);
    };

    const handleModalSuccess = () => {
        loadCountries(currentPage, searchQuery, activeFilter);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pl-PL', {
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
        loadCountries();
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
                                <h4 className="mb-0">Country Management</h4>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add Country
                            </Button>
                        </Card.Header>

                        <Card.Body>
                            {/* Search and Filter Controls */}
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search countries by name or shortcut..."
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
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant={activeFilter === undefined ? "primary" : "outline-primary"}
                                            size="sm"
                                            onClick={() => handleFilterChange(undefined)}
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={activeFilter === true ? "success" : "outline-success"}
                                            size="sm"
                                            onClick={() => handleFilterChange(true)}
                                        >
                                            Active
                                        </Button>
                                        <Button
                                            variant={activeFilter === false ? "danger" : "outline-danger"}
                                            size="sm"
                                            onClick={() => handleFilterChange(false)}
                                        >
                                            Inactive
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            {/* Error Alert */}
                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    {error}
                                </Alert>
                            )}

                            {/* Success Alert */}
                            {success && (
                                <Alert variant="success" className="mb-3">
                                    {success}
                                </Alert>
                            )}

                            {/* Loading Spinner */}
                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <div className="mt-2">Loading countries...</div>
                                </div>
                            ) : (
                                <>
                                    {/* Results Summary */}
                                    <div className="mb-3 text-muted">
                                        Showing {countries.length} of {totalCountries} countries
                                    </div>

                                    {/* Countries Table */}
                                    <div className="table-responsive">
                                        <Table striped hover>
                                            <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Shortcut</th>
                                                <th>Status</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {countries.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-4">
                                                        No countries found
                                                    </td>
                                                </tr>
                                            ) : (
                                                countries.map((country) => (
                                                    <tr key={country.id}>
                                                        <td>
                                                            <code>{country.id}</code>
                                                        </td>
                                                        <td>
                                                            <strong>{country.name}</strong>
                                                        </td>
                                                        <td>
                                                            <Badge bg="info">{country.shortcut}</Badge>
                                                        </td>
                                                        <td>
                                                            <Badge bg={country.is_active ? 'success' : 'secondary'}>
                                                                {country.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </td>
                                                        <td>{formatDate(country.created_at)}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditCountry(country)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteCountry(country)}
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

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center mt-3">
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    disabled={currentPage <= 1}
                                                    onClick={() => loadCountries(currentPage - 1, searchQuery, activeFilter)}
                                                >
                                                    Previous
                                                </Button>

                                                <span className="align-self-center px-3">
                          Page {currentPage} of {totalPages}
                        </span>

                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    disabled={currentPage >= totalPages}
                                                    onClick={() => loadCountries(currentPage + 1, searchQuery, activeFilter)}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modals */}
            <AddCountryModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onCountryAdded={handleModalSuccess}
            />

            {selectedCountry && (
                <EditCountryModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    country={selectedCountry}
                    onCountryEdited={handleModalSuccess}
                />
            )}

            {countryToDelete && (
                <DeleteCountryModal
                    show={showDeleteModal}
                    onHide={() => {
                        setShowDeleteModal(false);
                        setCountryToDelete(null);
                    }}
                    countryName={countryToDelete.name}
                    loading={deleteLoading}
                    error={error}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </Container>
    );
};

export default CountryList;