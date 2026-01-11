
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Form, Row, Col, Button } from 'react-bootstrap';

interface MonthlyData { month: number; count: number; }
interface SalespersonEfficiency {
  salesperson: string;
  monthly: MonthlyData[];
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SalespersonEfficiencyChart: React.FC = () => {
  const [data, setData] = useState<SalespersonEfficiency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [allYears, setAllYears] = useState<number[]>([]);
  const [selectedSalespeople, setSelectedSalespeople] = useState<string[]>([]);

  // Fetch available years for filtering (from backend contracts analytics)
  useEffect(() => {
    fetch('/api/sales/analytics/contracts')
      .then(res => res.json())
      .then(json => {
        if (json.yearly) {
          setAllYears(json.yearly.map((y: { year: number }) => y.year));
        }
      });
  }, []);

  // Fetch efficiency data for selected year
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/manager/efficiency?year=${year}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching efficiency data');
        return res.json();
      })
      .then((json) => {
        setData(json.efficiency || []);
        setLoading(false);
        // Set default selection to all salespeople if none selected
        if (selectedSalespeople.length === 0 && json.efficiency) {
          setSelectedSalespeople(json.efficiency.map((e: SalespersonEfficiency) => e.salesperson));
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  // SVG chart dimensions
  const width = 900;
  const height = 340;
  const padding = 60;
  const barWidth = 22;
  const barGap = 8;
  const months = 12;
  // Only show selected salespeople
  const filteredData = data.filter(d => selectedSalespeople.includes(d.salesperson));
  const maxCount = Math.max(...filteredData.flatMap(d => d.monthly.map(m => m.count)), 1);

  // Handlers
  const handleSalespersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSelectedSalespeople(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Salesperson Efficiency (Contracts per Month)</h5>
      </Card.Header>
      <Card.Body>
        <Form as={Row} className="mb-3 align-items-end">
          <Form.Group as={Col} xs={12} sm={4} md={3} lg={2} controlId="yearSelect">
            <Form.Label>Year</Form.Label>
            <Form.Select value={year} onChange={e => setYear(Number(e.target.value))}>
              {Array.from(new Set([year, ...allYears])).sort((a, b) => b - a).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} xs={12} sm={8} md={9} lg={10} controlId="salespersonSelect">
            <Form.Label>Salespeople</Form.Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {data.map(sp => (
                <Form.Check
                  key={sp.salesperson}
                  type="checkbox"
                  label={sp.salesperson}
                  value={sp.salesperson}
                  checked={selectedSalespeople.includes(sp.salesperson)}
                  onChange={handleSalespersonChange}
                />
              ))}
            </div>
          </Form.Group>
        </Form>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading efficiency data...</p>
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

              {/* Bars for each salesperson, months evenly spaced */}
              {filteredData.map((sp, i) => sp.monthly.map((d, j) => {
                const groupWidth = filteredData.length * (barWidth + barGap);
                const monthStart = padding + j * ((width - 2 * padding) / months);
                const x = monthStart + i * (barWidth + barGap) - (groupWidth / 2) + ((width - 2 * padding) / (2 * months));
                const barHeight = ((d.count / maxCount) * (height - 2 * padding)) || 0;
                return (
                  <g key={sp.salesperson + '-' + d.month}>
                    <rect
                      x={x}
                      y={height - padding - barHeight}
                      width={barWidth}
                      height={barHeight}
                      fill={['#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2'][i % 5]}
                    />
                    {/* Value label */}
                    {barHeight > 16 && d.count > 0 && (
                      <text
                        x={x + barWidth / 2}
                        y={height - padding - barHeight + 14}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#fff"
                      >
                        {d.count}
                      </text>
                    )}
                  </g>
                );
              }))}
              {/* Month labels, evenly spaced */}
              {monthNames.map((m, j) => (
                <text
                  key={m}
                  x={padding + (j + 0.5) * ((width - 2 * padding) / months)}
                  y={height - padding + 22}
                  textAnchor="middle"
                  fontSize="13"
                  fill="#333"
                >
                  {m}
                </text>
              ))}
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
              {/* Salesperson legend */}
              {filteredData.map((sp, i) => (
                <g key={sp.salesperson + '-legend'}>
                  <rect x={width - padding - 140} y={padding + i * 24} width={18} height={18} fill={['#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2'][i % 5]} />
                  <text x={width - padding - 116} y={padding + i * 24 + 14} fontSize="14" fill="#333">{sp.salesperson}</text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SalespersonEfficiencyChart;
