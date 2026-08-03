import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPolicies, cancelPolicy } from '../../services/policyService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const PolicyListPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { user } = useAuth();
  
  const isAgentOrAdmin = user?.role?.includes('ROLE_ADMIN') || user?.role?.includes('ROLE_AGENT') || user?.role === 'admin';
  const isAdmin = user?.role?.includes('ROLE_ADMIN') || user?.role === 'admin';

  useEffect(() => {
    fetchPolicies(page, search, status);
  }, [page]);

  const fetchPolicies = async (pageNumber, searchQuery = search, statusQuery = status) => {
    try {
      setLoading(true);
      const data = await getPolicies(pageNumber, 10, searchQuery, statusQuery);
      setPolicies(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPolicies(0, search, status);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this policy?')) {
      try {
        await cancelPolicy(id);
        toast.success('Policy cancelled successfully');
        fetchPolicies(page, search, status);
      } catch (error) {
        toast.error('Failed to cancel policy');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Policies</h1>
        {isAgentOrAdmin && (
          <Link to="/policies/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Create Policy
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
            <input
              type="text"
              placeholder="Search Policy No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_RENEWAL">Pending Renewal</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 h-[42px]">
            Filter
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.policyNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.policyType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      policy.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      policy.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/policies/${policy.id}`} className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                    {isAgentOrAdmin && (
                       <Link to={`/policies/${policy.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    )}
                    {isAdmin && policy.status !== 'CANCELLED' && (
                      <button onClick={() => handleCancel(policy.id)} className="text-red-600 hover:text-red-900">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))} 
          disabled={page === 0}
          className="px-4 py-2 border rounded text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page + 1} of {totalPages || 1}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={page >= totalPages - 1}
          className="px-4 py-2 border rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PolicyListPage;
