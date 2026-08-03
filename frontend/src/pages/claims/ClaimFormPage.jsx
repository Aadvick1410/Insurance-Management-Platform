import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createClaim, getClaimById, updateClaimDetails } from '../../services/claimService';
import { getPolicies } from '../../services/policyService';
import toast from 'react-hot-toast';

const ClaimFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPolicyId = searchParams.get('policyId') || '';

  const [formData, setFormData] = useState({
    policyId: initialPolicyId,
    description: '',
    claimAmount: '',
    dateOfIncident: ''
  });
  
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const polData = await getPolicies(0, 100);
        setPolicies(polData.content || []);

        if (isEditMode) {
          const data = await getClaimById(id);
          setFormData({
            policyId: data.policyId || '',
            description: data.description || '',
            claimAmount: data.claimAmount || '',
            dateOfIncident: data.dateOfIncident || ''
          });
        }
      } catch (error) {
        toast.error('Failed to load required data');
      }
    };
    fetchInitialData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await updateClaimDetails(id, formData);
        toast.success('Claim updated successfully');
      } else {
        await createClaim(formData);
        toast.success('Claim filed successfully');
      }
      navigate('/claims');
    } catch (error) {
      // Error handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? 'Edit Claim' : 'File a New Claim'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Policy</label>
          <select name="policyId" value={formData.policyId} onChange={handleChange} disabled={isEditMode} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border disabled:bg-gray-100">
            <option value="">-- Choose a Policy --</option>
            {policies.map(p => (
              <option key={p.id} value={p.id}>{p.policyNumber} - {p.customerName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Incident</label>
          <input type="date" name="dateOfIncident" value={formData.dateOfIncident} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Claim Amount ($)</label>
          <input type="number" step="0.01" name="claimAmount" value={formData.claimAmount} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description / Reason</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={() => navigate('/claims')} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimFormPage;
