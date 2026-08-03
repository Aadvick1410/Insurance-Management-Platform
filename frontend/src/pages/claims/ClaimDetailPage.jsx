import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClaimById, updateClaimStatus } from '../../services/claimService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ClaimDetailPage = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const isAgentOrAdmin = user?.role?.includes('ROLE_ADMIN') || user?.role?.includes('ROLE_AGENT') || user?.role === 'admin';

  const fetchClaim = async () => {
    try {
      const data = await getClaimById(id);
      setClaim(data);
    } catch (error) {
      toast.error('Failed to load claim details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      setUpdating(true);
      try {
        await updateClaimStatus(id, newStatus);
        toast.success(`Claim status updated to ${newStatus}`);
        fetchClaim();
      } catch (error) {
        toast.error('Failed to update claim status');
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!claim) return <div className="p-6 text-center text-red-500">Claim not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Claim Details - #{claim.id}</h1>
        <div className="flex gap-4">
          {claim.claimStatus === 'PENDING' && (
            <Link to={`/claims/${id}/edit`} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
              Edit Details
            </Link>
          )}
          <Link to="/claims" className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300">
            Back to List
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Policy Number</h3>
            <p className="mt-1 text-lg text-gray-900">
              <Link to={`/policies/${claim.policyId}`} className="text-blue-600 hover:underline">{claim.policyNumber}</Link>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Customer</h3>
            <p className="mt-1 text-lg text-gray-900">{claim.customerName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Claim Amount</h3>
            <p className="mt-1 text-lg font-bold text-red-600">${claim.claimAmount}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date of Incident</h3>
            <p className="mt-1 text-lg text-gray-900">{claim.dateOfIncident}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                claim.claimStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                claim.claimStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                claim.claimStatus === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {claim.claimStatus}
              </span>
            </p>
          </div>
          <div>
             <h3 className="text-sm font-medium text-gray-500">Submitted On</h3>
             <p className="mt-1 text-gray-900">{new Date(claim.createdAt).toLocaleString()}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Description of Incident</h3>
            <p className="mt-1 text-gray-900 bg-gray-50 p-4 rounded border whitespace-pre-wrap">{claim.description}</p>
          </div>
        </div>
      </div>
      
      {/* Admin/Agent Action Panel for changing claim status */}
      {isAgentOrAdmin && (
        <div className="bg-white p-6 rounded-lg shadow">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Admin Actions</h3>
           <div className="flex flex-wrap gap-4">
              <button onClick={() => handleStatusChange('IN_REVIEW')} disabled={updating || claim.claimStatus === 'IN_REVIEW'} className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50">Mark as In Review</button>
              <button onClick={() => handleStatusChange('APPROVED')} disabled={updating || claim.claimStatus === 'APPROVED'} className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50">Approve Claim</button>
              <button onClick={() => handleStatusChange('REJECTED')} disabled={updating || claim.claimStatus === 'REJECTED'} className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50">Reject Claim</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClaimDetailPage;
