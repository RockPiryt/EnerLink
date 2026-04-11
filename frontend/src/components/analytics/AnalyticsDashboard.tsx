import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getContractAnalytics, AnalyticsData } from '../../services/analyticsService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsDashboard: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    const navigate = useNavigate();

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const loadAnalytics = async (year?: number) => {
        setLoading(true);
        setError('');

        try {
            const analyticsData = await getContractAnalytics(year);

            // Add month names to monthly data and ensure all 12 months are present
            const monthlyMap = new Map(analyticsData.monthly.map(item => [item.month, item.count]));
            const monthlyWithNames = Array.from({ length: 12 }, (_, index) => ({
                month: index + 1,
                count: monthlyMap.get(index + 1) || 0,
                monthName: monthNames[index]
            }));

            setData({
                ...analyticsData,
                monthly: monthlyWithNames
            });

            // Extract available years from yearly data
            const years = analyticsData.yearly.map(item => item.year).sort((a, b) => b - a);
            setAvailableYears(years);

        } catch (err: any) {
            setError('Error loading analytics data.');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        loadAnalytics(year);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const monthlyChartData = {
        labels: data?.monthly.map(item => item.monthName) || [],
        datasets: [
            {
                label: 'Contracts Created',
                data: data?.monthly.map(item => item.count) || [],
                borderColor: 'rgb(13, 110, 253)',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgb(13, 110, 253)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 5,
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const yearlyChartData = {
        labels: data?.yearly.map(item => item.year.toString()) || [],
        datasets: [
            {
                label: 'Total Contracts',
                data: data?.yearly.map(item => item.count) || [],
                backgroundColor: 'rgba(25, 135, 84, 0.8)',
                borderColor: 'rgb(25, 135, 84)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                    callback: function(value: any) {
                        return Number.isInteger(value) ? value : '';
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
    };

    useEffect(() => {
        loadAnalytics(selectedYear);
    }, []);

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={handleBackToDashboard}
                                    className="me-3"
                                >
                                    &larr; Back to Dashboard
                                </Button>
                                <h4 className="mb-0">Contract Analytics Dashboard</h4>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-white">Year:</span>
                                <Form.Select
                                    size="sm"
                                    value={selectedYear}
                                    onChange={(e) => handleYearChange(parseInt(e.target.value))}
                                    style={{ width: '100px' }}
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </Card.Header>

                        <Card.Body>
                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    {error}
                                </Alert>
                            )}

                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <div className="mt-2">Loading analytics data...</div>
                                </div>
                            ) : data ? (
                                <>
                                    {/* Monthly Contracts Chart */}
                                    <Row className="mb-4">
                                        <Col>
                                            <Card>
                                                <Card.Header>
                                                    <h5 className="mb-0">Monthly Contracts - {selectedYear}</h5>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div style={{ height: '300px' }}>
                                                        <Line data={monthlyChartData} options={chartOptions} />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* Yearly Contracts Chart */}
                                    <Row className="mb-4">
                                        <Col>
                                            <Card>
                                                <Card.Header>
                                                    <h5 className="mb-0">Yearly Contract Trends</h5>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div style={{ height: '300px' }}>
                                                        <Bar data={yearlyChartData} options={chartOptions} />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* Summary Stats */}
                                    <Row>
                                        <Col md={6}>
                                            <Card className="bg-light">
                                                <Card.Body>
                                                    <h6 className="text-muted">Total Contracts in {selectedYear}</h6>
                                                    <h3 className="text-primary mb-0">
                                                        {data.monthly.reduce((sum, item) => sum + item.count, 0)}
                                                    </h3>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card className="bg-light">
                                                <Card.Body>
                                                    <h6 className="text-muted">Average per Month</h6>
                                                    <h3 className="text-success mb-0">
                                                        {data.monthly.length > 0
                                                            ? Math.round(data.monthly.reduce((sum, item) => sum + item.count, 0) / 12)
                                                            : 0
                                                        }
                                                    </h3>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <h5>No analytics data available</h5>
                                    <p className="text-muted">Please check if there are any contracts in the system.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AnalyticsDashboard;