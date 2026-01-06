import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Login from './components/authorisation/Login';
import Dashboard from './components/dashboard/Dashboard';
import AdminPanel from './components/admin/AdminPanel';
import UsersList from './components/user/UsersList';
import RoleList from './components/role/RoleList';
import CountryList from './components/dictionary/CountryList';
import CityList from './components/dictionary/CityList';
import ProvinceList from './components/dictionary/ProvinceList';
import CustomerList from './components/customer/CustomerList';
import CustomerForm from './components/customer/CustomerForm';
import CustomerDetails from './components/customer/CustomerDetails';
import ContractList from './components/contract/ContractList';
import ContractForm from './components/contract/ContractForm';
import ProviderList from './components/provider/ProviderList';
import SalesList from './components/sales/SalesList';
import TagList from './components/tag/TagList';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import PKWiUList from './components/pkwiu/PKWiUList';
import TariffList from './components/tariff/TariffList';
import './App.css';
import ContractDetails from "./components/contract/ContractDetails";
import ProviderForm from "./components/provider/ProviderForm";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/roles" element={<RoleList />} />
            {/* Dictionary */}
            <Route path="/dictionary/countries" element={<CountryList />} />
            <Route path="/dictionary/cities" element={<CityList />} />
            <Route path="/dictionary/provinces" element={<ProvinceList />} />
            <Route path="/dictionary/pkwiu" element={<PKWiUList />} />
            <Route path="/dictionary/tariffs" element={<TariffList />} />
            {/* Customers */}
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            {/* Contracts */}
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/contracts/new" element={<ContractForm />} />
              <Route path="/contracts/:id" element={<ContractDetails />} />
            {/* Providers */}
            <Route path="/providers" element={<ProviderList />} />
              <Route path="/providers/new" element={<ProviderForm />} />
            {/* Sales */}
            <Route path="/sales" element={<SalesList />} />
            {/* Tags */}
            <Route path="/tags" element={<TagList />} />
            {/* Analytics */}
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            {/* Manager */}
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
