
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getCountries, Country } from '../../services/countryService';
import AddCountryModal from '../../dialogs/AddCountryModal';
import EditCountryModal from '../../dialogs/EditCountryModal';
import DeleteCountryModal from '../../dialogs/DeleteCountryModal';

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<Country | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Placeholder for future backend integration
  const handleEditCountry = (country: Country) => {
    setSelectedCountry(country);
    setShowEditModal(true);
  };

  // Placeholder for future backend integration
  const handleDeleteCountry = (country: Country) => {
    setCountryToDelete(country);
    setShowDeleteModal(true);
  };

  // Placeholder for future backend integration
  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setTimeout(() => {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setCountryToDelete(null);
      setSuccess('Kraj został usunięty (symulacja).');
      fetchCountries();
    }, 1000);
  };

  const fetchCountries = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (err: any) {
      setError('Błąd podczas pobierania krajów.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div>
      <h2>Zarządzanie krajami</h2>
      <Button onClick={() => setShowAddModal(true)} className="mb-3">Dodaj kraj</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Skrót</th>
              <th>Status</th>
              <th>Data utworzenia</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.id}>
                <td>{country.id}</td>
                <td>{country.name}</td>
                <td>{country.shortcut}</td>
                <td>{country.is_active ? 'Aktywny' : 'Nieaktywny'}</td>
                <td>{new Date(country.created_at).toLocaleString()}</td>
                <td>
                  <Button size="sm" className="me-2" onClick={() => handleEditCountry(country)}>Edytuj</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDeleteCountry(country)}>Usuń</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <AddCountryModal show={showAddModal} onHide={() => setShowAddModal(false)} onCountryAdded={fetchCountries} />
      {selectedCountry && (
        <EditCountryModal show={showEditModal} onHide={() => setShowEditModal(false)} country={selectedCountry} onCountryEdited={fetchCountries} />
      )}
      {countryToDelete && (
        <DeleteCountryModal
          show={showDeleteModal}
          onHide={() => { setShowDeleteModal(false); setCountryToDelete(null); }}
          countryName={countryToDelete.name}
          loading={deleteLoading}
          error={error}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default CountryList;
