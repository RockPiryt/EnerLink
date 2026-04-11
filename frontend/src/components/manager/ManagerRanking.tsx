import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getRanking, RankingResponse } from '../../services/managerService';


const ManagerRanking: React.FC = () => {
  const [data, setData] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const navigate = useNavigate();

  const fetchRanking = async (monthParam?: number | '', yearParam?: number | '') => {
    setLoading(true);
    setError(null);
    try {
      const json = await getRanking({ month: monthParam, year: yearParam });
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking(month, year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const handleExportXLSX = () => {
    if (!data || !data.ranking) return;
    const ws = XLSX.utils.json_to_sheet(data.ranking.map(item => ({
      ID: item.id,
      Name: item.name,
      Score: item.value
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ranking');
    XLSX.writeFile(wb, 'sales_ranking.xlsx');
  };

  // Team summary calculations
  const totalSales = data?.ranking?.reduce((sum, item) => sum + item.value, 0) || 0;
  const avgSales = data?.ranking && data.ranking.length > 0 ? (totalSales / data.ranking.length).toFixed(2) : '0';
  const best = data?.ranking && data.ranking.length > 0 ? data.ranking[0] : null;
  const worst = data?.ranking && data.ranking.length > 0 ? data.ranking[data.ranking.length - 1] : null;

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Sales Ranking</h4>
              <div>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={handleExportXLSX}
                  disabled={loading || !data || !data.ranking?.length}
                >
                  Export to XLSX
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  &larr; Back to Dashboard
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Team summary section */}
              {!loading && !error && data?.ranking && data.ranking.length > 0 && (
                <div className="mb-4">
                  <h5>Team Summary</h5>
                  <div className="d-flex flex-wrap gap-4">
                    <div><strong>Total sales:</strong> {totalSales}</div>
                    <div><strong>Average per salesperson:</strong> {avgSales}</div>
                    <div><strong>Best performer:</strong> {best?.name} ({best?.value})</div>
                    <div><strong>Lowest performer:</strong> {worst?.name} ({worst?.value})</div>
                  </div>
                </div>
              )}
              <div className="mb-3 d-flex align-items-center gap-2">
                <label className="me-2 mb-0">Month:</label>
                <select value={month} onChange={e => setMonth(e.target.value ? Number(e.target.value) : '')} className="form-select w-auto">
                  <option value="">All</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
                <label className="ms-3 me-2 mb-0">Year:</label>
                <input
                  type="number"
                  className="form-control w-auto"
                  value={year}
                  min={2000}
                  max={2100}
                  placeholder="All"
                  onChange={e => setYear(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
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
