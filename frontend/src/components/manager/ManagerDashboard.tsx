import React from 'react';
import CustomerServiceReport from './CustomerServiceReport';
import ManagerRanking from './ManagerRanking';
import ContractsSVGChart from './ContractsSVGChart';
import SalespersonEfficiencyChart from './SalespersonEfficiencyChart';

const ManagerDashboard: React.FC = () => {
  return (
    <div style={{ padding: '32px' }}>
      <h2>Manager Dashboard</h2>
      <ManagerRanking />
      <CustomerServiceReport />
      <ContractsSVGChart />
      <SalespersonEfficiencyChart />
    </div>
  );
};

export default ManagerDashboard;
