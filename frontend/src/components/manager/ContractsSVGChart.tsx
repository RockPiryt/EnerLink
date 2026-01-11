import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';

interface MonthlyData {
  month: number;
  count: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ContractsSVGChart: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [allYears, setAllYears] = useState<number[]>([]);

  // Fetch available years for filtering
  useEffect(() => {
    fetch('/api/sales/analytics/contracts')
      .then(res => res.json())
      .then(json => {
        if (json.yearly) {
          setAllYears(json.yearly.map((y: { year: number }) => y.year));
        }
      });
  }, []);

  // Fetch monthly data for selected year
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/sales/analytics/contracts?year=${year}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching contracts analytics');
        return res.json();
      })
      .then((json) => {
        setData(json.monthly || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [year]);

  // SVG chart dimensions
  const width = 800;
  const height = 320;
  const padding = 60;
  const barWidth = 32;
  const months = 12;
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Prepare data for all months (fill missing months with 0)
  const monthlyData: MonthlyData[] = Array.from({ length: 12 }, (_, i) => {
    const found = data.find(d => d.month === i + 1);
    return { month: i + 1, count: found ? found.count : 0 };
  });

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Contracts Analytics (SVG) – {year}</h5>
      </Card.Header>
      <Card.Body>
        <Form as={Row} className="mb-3 align-items-end">
          <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} controlId="yearSelect">
            <Form.Label>Year</Form.Label>
            <Form.Select value={year} onChange={e => setYear(Number(e.target.value))}>
              {Array.from(new Set([year, ...allYears])).sort((a, b) => b - a).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading analytics...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <svg width={width} height={height} style={{ background: '#f8f9fa', borderRadius: 8 }}>
              {/* Y axis */}
              <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#888" />
              {/* X axis */}
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#888" />
              {/* Bars, months evenly spaced */}
              {monthlyData.map((d, i) => {
                const x = padding + (i + 0.5) * ((width - 2 * padding) / months) - barWidth / 2;
                const barHeight = ((d.count / maxCount) * (height - 2 * padding)) || 0;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={height - padding - barHeight}
                      width={barWidth}
                      height={barHeight}
                      fill="#007bff"
                    />
                    {/* Value label */}
                    {barHeight > 16 && d.count > 0 && (
                      <text
                        x={x + barWidth / 2}
                        y={height - padding - barHeight - 8}
                        textAnchor="middle"
                        fontSize="13"
                        fill="#333"
                      >
                        {d.count}
                      </text>
                    )}
                    {/* Month label */}
                    <text
                      x={x + barWidth / 2}
                      y={height - padding + 22}
                      textAnchor="middle"
                      fontSize="13"
                      fill="#333"
                    >
                      {monthNames[d.month - 1]}
                    </text>
                  </g>
                );
              })}
              {/* Y axis labels */}
              {[0, maxCount].map((val, idx) => (
                <text
                  key={idx}
                  x={padding - 16}
                  y={height - padding - ((val / maxCount) * (height - 2 * padding))}
                  textAnchor="end"
                  fontSize="13"
                  fill="#333"
                  alignmentBaseline="middle"
                >
                  {val}
                </text>
              ))}
            </svg>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ContractsSVGChart;
