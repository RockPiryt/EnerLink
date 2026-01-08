import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner, Alert } from 'react-bootstrap';

interface ContractHistoryEntry {
  id: number;
  contract_id: number;
  changed_at: string;
  changed_by: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
}

interface ContractHistoryModalProps {
  contractId: number;
  show: boolean;
  onHide: () => void;
}

const ContractHistoryModal: React.FC<ContractHistoryModalProps> = ({ contractId, show, onHide }) => {
  const [history, setHistory] = useState<ContractHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/contracts/${contractId}/history`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch contract history');
        return res.json();
      })
      .then(data => setHistory(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [contractId, show]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Contract Change History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2">Loading history...</div>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : history.length === 0 ? (
          <div className="text-center text-muted">No history found for this contract.</div>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Field</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                {history.map(entry => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.changed_at).toLocaleString()}</td>
                    <td>{entry.changed_by}</td>
                    <td>{entry.field}</td>
                    <td>{entry.old_value ?? '-'}</td>
                    <td>{entry.new_value ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContractHistoryModal;
