import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getProviders, Provider } from '../../services/providerService';

const ProviderList: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (err: any) {
      setError('Błąd podczas pobierania dostawców.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Zarządzanie dostawcami energii</h2>
        </div>
        <div>
          {/* TODO: Add dashboard and add provider buttons */}
        </div>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Data utworzenia</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td>{provider.id}</td>
                <td>{provider.name}</td>
                <td>{new Date(provider.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProviderList;
