
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getCountries, Country } from '../../services/countryService';
import AddCountryModal from '../../dialogs/AddCountryModal';

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [success, setSuccess] = useState('');

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
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <AddCountryModal show={showAddModal} onHide={() => setShowAddModal(false)} onCountryAdded={fetchCountries} />
    </div>
  );
};

export default CountryList;
