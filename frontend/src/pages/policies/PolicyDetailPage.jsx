import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPolicyById, renewPolicy } from '../../services/policyService';
import toast from 'react-hot-toast';

const PolicyDetailPage = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);

  const fetchPolicy = async () => {
    try {
      const data = await getPolicyById(id);
      setPolicy(data);
    } catch (error) {
      toast.error('Failed to load policy details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [id]);

  const handleRenew = async () => {
    if (window.confirm('Renew this policy for 1 year?')) {
      setRenewing(true);
      try {
        await renewPolicy(id);
        toast.success('Policy renewed successfully');
        fetchPolicy();
      } catch (error) {
        toast.error('Failed to renew policy');
      } finally {
        setRenewing(false);
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!policy) return <div className="p-6 text-center text-red-500">Policy not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Policy Details - {policy.policyNumber}</h1>
        <div className="flex gap-4">
          {policy.status !== 'CANCELLED' && (
            <button onClick={handleRenew} disabled={renewing} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50">
              {renewing ? 'Renewing...' : 'Renew Policy'}
            </button>
          )}
          <Link to={`/policies/${id}/edit`} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
            Edit Policy
          </Link>
          <Link to="/policies" className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300">
            Back to List
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Customer</h3>
            <p className="mt-1 text-lg text-gray-900">
              <Link to={`/customers/${policy.customerId}`} className="text-blue-600 hover:underline">{policy.customerName}</Link>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Policy Type</h3>
            <p className="mt-1 text-lg text-gray-900">{policy.policyType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Premium Amount</h3>
            <p className="mt-1 text-lg text-gray-900">${policy.premiumAmount}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                policy.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                policy.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {policy.status}
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
            <p className="mt-1 text-lg text-gray-900">{policy.startDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">End Date</h3>
            <p className="mt-1 text-lg text-gray-900">{policy.endDate}</p>
          </div>
        </div>
      </div>
      
      {/* Placeholders for Premium Payments and Claims specific to this policy */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-lg shadow">
           <h3 className="font-bold text-gray-800 mb-2">Premium History</h3>
           <p className="text-sm text-gray-500">Payment records will be shown here.</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow">
           <h3 className="font-bold text-gray-800 mb-2">Claims against Policy</h3>
           <p className="text-sm text-gray-500">Associated claims will be shown here.</p>
         </div>
      </div>
    </div>
  );
};

export default PolicyDetailPage;
