import React from 'react';

import ManagerRanking from './ManagerRanking';
import ContractsSVGChart from './ContractsSVGChart';
import SalespersonEfficiencyChart from './SalespersonEfficiencyChart';

const ManagerDashboard: React.FC = () => {
  return (
    <div style={{ padding: '32px' }}>
      <h2>Manager Dashboard</h2>
      <ManagerRanking />
      <ContractsSVGChart />
      <SalespersonEfficiencyChart />
    </div>
  );
};

export default ManagerDashboard;
