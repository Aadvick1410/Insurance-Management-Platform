import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../../services/customerService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  
  // Check roles (JWT roles might be an array or string depending on backend, let's check string inclusion for safety)
  const isAgentOrAdmin = user?.role?.includes('ROLE_ADMIN') || user?.role?.includes('ROLE_AGENT') || user?.role === 'admin';
  const isAdmin = user?.role?.includes('ROLE_ADMIN') || user?.role === 'admin';

  useEffect(() => {
    fetchCustomers(page, search);
  }, [page]);

  const fetchCustomers = async (pageNumber, searchQuery = search) => {
    try {
      setLoading(true);
      const data = await getCustomers(pageNumber, 10, searchQuery);
      setCustomers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page on new search
    fetchCustomers(0, search);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        toast.success('Customer deleted successfully');
        fetchCustomers(page, search);
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        {isAgentOrAdmin && (
          <Link to="/customers/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Add Customer
          </Link>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900">
            Search
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/customers/${customer.id}`} className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                    {isAgentOrAdmin && (
                      <Link to={`/customers/${customer.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    )}
                    {isAdmin && (
                      <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
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

export default CustomerListPage;
