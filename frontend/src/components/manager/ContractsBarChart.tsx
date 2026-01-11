import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonthlyData {
  month: number;
  count: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ContractsBarChart: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sales/analytics/contracts')
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
  }, []);

  const chartData = {
    labels: data.map(d => monthNames[d.month - 1]),
    datasets: [
      {
        label: 'Contracts per Month',
        data: data.map(d => d.count),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Contracts per Month' },
    },
    scales: {
      y: { beginAtZero: true, precision: 0 },
    },
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Contracts Analytics</h5>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading analytics...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </Card.Body>
    </Card>
  );
};

export default ContractsBarChart;
