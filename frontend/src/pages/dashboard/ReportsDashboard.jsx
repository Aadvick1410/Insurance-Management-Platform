import React, { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../../services/reportService';
import toast from 'react-hot-toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ReportsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;
  if (!metrics) return <div className="p-6 text-center text-red-500">Could not load dashboard data</div>;

  // Prepare data for Pie Chart (Policies by Type)
  const policyTypes = Object.keys(metrics.policiesByType || {});
  const policyCounts = Object.values(metrics.policiesByType || {});
  
  const pieData = {
    labels: policyTypes,
    datasets: [
      {
        data: policyCounts,
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Bar Chart (Claims by Status)
  const claimStatuses = Object.keys(metrics.claimsByStatus || {});
  const claimCounts = Object.values(metrics.claimsByStatus || {});

  const barData = {
    labels: claimStatuses,
    datasets: [
      {
        label: 'Number of Claims',
        data: claimCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Claims Breakdown by Status' },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard & Reports</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Active Policies</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalActivePolicies}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium">Pending Claims</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.totalPendingClaims}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-indigo-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">${metrics.totalRevenue?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </div>
      </div>

      {/* Additional Metrics */}
      {metrics.totalOverduePayments > 0 && (
         <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8 flex items-center">
             <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
             <span>Attention: There are <strong>{metrics.totalOverduePayments}</strong> overdue premium payments requiring follow-up.</span>
         </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Policies by Type</h3>
          <div className="h-64 flex justify-center">
            {policyTypes.length > 0 ? (
               <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
               <p className="text-gray-500 self-center">No policy data available.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Claims Status Overview</h3>
          <div className="h-64 flex justify-center">
            {claimStatuses.length > 0 ? (
               <Bar data={barData} options={barOptions} />
            ) : (
               <p className="text-gray-500 self-center">No claim data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
