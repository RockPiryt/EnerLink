import React from 'react';
import ManagerRanking from './ManagerRanking';

const ManagerDashboard: React.FC = () => {
  return (
    <div style={{ padding: '32px' }}>
      <h2>Manager Dashboard</h2>
      <ManagerRanking />
      {/* Możesz dodać tu kolejne sekcje: statystyki, listy, wykresy */}
    </div>
  );
};

export default ManagerDashboard;
