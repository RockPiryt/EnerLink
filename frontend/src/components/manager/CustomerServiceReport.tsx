import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';

interface CustomerServiceReport {
  num_customers: number;
  avg_realization_days: number | null;
  signed_contracts: number;
  cancelled_contracts: number;
  new_contracts: number;
}

const CustomerServiceReport: React.FC = () => {
  const [data, setData] = useState<CustomerServiceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');

  const fetchReport = () => {
    setLoading(true);
    setError(null);
    let url = '/api/manager/customer_service_report';
    const params = [];
    if (month) params.push(`month=${month}`);
    if (year) params.push(`year=${year}`);
    if (params.length) url += '?' + params.join('&');
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error fetching report');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  return (
    <Card className="mb-4">
      <Card.Header className="bg-info text-white d-flex align-items-center justify-content-between">
        <span>Customer Service Report</span>
        <div className="d-flex align-items-center gap-2">
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
          <Button variant="outline-light" size="sm" onClick={fetchReport} disabled={loading}>
            Refresh
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div style={{ textAlign: 'center' }}><Spinner animation="border" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : data ? (
          <Row className="gy-3">
            <Col md={4}><strong>Serviced customers:</strong> {data.num_customers}</Col>
            <Col md={4}><strong>Avg. realization time (days):</strong> {data.avg_realization_days ?? 'N/A'}</Col>
            <Col md={4}><strong>Signed contracts:</strong> {data.signed_contracts}</Col>
            <Col md={4}><strong>Cancelled contracts:</strong> {data.cancelled_contracts}</Col>
            <Col md={4}><strong>New contracts:</strong> {data.new_contracts}</Col>
          </Row>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default CustomerServiceReport;
