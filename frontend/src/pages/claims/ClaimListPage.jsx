import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClaims } from '../../services/claimService';
import toast from 'react-hot-toast';

const ClaimListPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchClaims(page);
  }, [page]);

  const fetchClaims = async (pageNumber) => {
    try {
      setLoading(true);
      const data = await getClaims(pageNumber);
      setClaims(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Claims Management</h1>
        <Link to="/claims/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          File a Claim
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Incident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{claim.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <Link to={`/policies/${claim.policyId}`}>{claim.policyNumber}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.dateOfIncident}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      claim.claimStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      claim.claimStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      claim.claimStatus === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {claim.claimStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/claims/${claim.id}`} className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                    {claim.claimStatus === 'PENDING' && (
                       <Link to={`/claims/${claim.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
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

export default ClaimListPage;
