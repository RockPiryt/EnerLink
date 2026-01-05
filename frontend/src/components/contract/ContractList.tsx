import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Button, Card, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Contract {
  id: number;
  contract_number: string;
  signed_at?: string;
  contract_from?: string;
  contract_to?: string;
  status?: string;
}

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch contracts from API when backend is ready
    setContracts([]);
    setLoading(false);
  }, []);

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Button variant="outline-secondary" className="me-3" onClick={() => navigate('/dashboard')}>
              &larr; Back to Dashboard
            </Button>
            <h2 className="mb-0">Contract List</h2>
          </div>
          <Button variant="primary">Add Contract</Button>
        </Card.Header>
        <Card.Body>
          {loading && <Spinner animation="border" variant="primary" />}
          {error && <Alert variant="danger">Error: {error}</Alert>}
          {!loading && !error && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Contract Number</th>
                  <th>Signed At</th>
                  <th>Valid From</th>
                  <th>Valid To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">No contracts available.</td>
                  </tr>
                ) : (
                  contracts.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.contract_number}</td>
                      <td>{c.signed_at || '-'}</td>
                      <td>{c.contract_from || '-'}</td>
                      <td>{c.contract_to || '-'}</td>
                      <td>{c.status || '-'}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => { setContractToDelete(c); setShowConfirm(true); }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
          <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Contract</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this contract?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (contractToDelete) {
                    setContracts(contracts.filter(c => c.id !== contractToDelete.id));
                  }
                  setShowConfirm(false);
                  setContractToDelete(null);
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ContractList;
