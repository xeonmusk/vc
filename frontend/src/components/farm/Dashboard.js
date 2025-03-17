import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bar, Line } from 'react-chartjs-2';
import { fetchFarmStats } from '../../store/slices/farmSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, inventory, orders, stats } = useSelector(state => state.farm);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Farm Analytics'
      }
    }
  };

  useEffect(() => {
    dispatch(fetchFarmStats());
    const interval = setInterval(() => {
      dispatch(fetchFarmStats());
    }, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="dashboard">
      <h2>Farm Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Tasks</h3>
          <p>{tasks?.filter(t => t.status === 'pending').length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Inventory Items</h3>
          <p>{inventory?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{orders?.filter(o => o.status === 'pending').length || 0}</p>
        </div>
      </div>
      
      <div className="analytics-section">
        <div className="chart-container">
          <h3>Monthly Production</h3>
          <Bar data={stats.productionData} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h3>Inventory Trends</h3>
          <Line data={stats.inventoryTrends} options={chartOptions} />
        </div>
      </div>
      
      <div className="alerts-section">
        {inventory
          .filter(item => item.quantity <= item.minimumThreshold)
          .map(item => (
            <div key={item._id} className="alert-card">
              <span className="alert-icon">⚠️</span>
              <p>Low inventory: {item.name}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Dashboard;
