import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface RankingItem {
  id: string;
  name: string;
  value: number;
}

interface RankingResponse {
  ranking: RankingItem[];
  generated_at: string | null;
}

const ManagerRanking: React.FC = () => {
  const [data, setData] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/manager/ranking')
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching ranking');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Sales Ranking</h4>
              <Button
                variant="light"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                &larr; Back to Dashboard
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div style={{ textAlign: 'center' }}><Spinner animation="border" /></div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.ranking || []).map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div style={{ marginTop: 16, color: '#888' }}>
                    {data?.generated_at ? `Generated at: ${data.generated_at}` : 'No generation date'}
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

export default ManagerRanking;
