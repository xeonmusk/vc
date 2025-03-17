import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; // Import Navbar
import Dashboard from './components/farm/Dashboard';
import Inventory from './components/farm/Inventory';
import EmployeeManagement from './components/farm/EmployeeManagement';
import TaskManager from './components/farm/TaskManager';
import OrderManagement from './components/store/OrderManagement';
import CustomerDashboard from './components/store/CustomerDashboard';

function App() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUserRole(role);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar userRole={userRole} isAuthenticated={isAuthenticated} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/store" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={
          <Login setUserRole={setUserRole} setIsAuthenticated={setIsAuthenticated} />
        } />
        
        {/* Store Routes */}
        <Route path="/store" element={<CustomerDashboard />} />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        } />

        {/* Farm Management Routes - Admin Only */}
        <Route path="/farm/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="tasks" element={<TaskManager />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Store Management Routes - Admin Only */}
        <Route path="/manage/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route path="orders" element={<OrderManagement />} />
              <Route path="inventory" element={<Inventory />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
