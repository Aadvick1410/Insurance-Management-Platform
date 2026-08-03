import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPolicy, getPolicyById, updatePolicy } from '../../services/policyService';
import { getCustomers } from '../../services/customerService';
import toast from 'react-hot-toast';

const PolicyFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerId: '',
    policyType: 'LIFE',
    premiumAmount: '',
    startDate: '',
    endDate: ''
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const custData = await getCustomers(0, 100); // fetch list of customers for dropdown
        setCustomers(custData.content || []);

        if (isEditMode) {
          const data = await getPolicyById(id);
          setFormData({
            customerId: data.customerId || '',
            policyType: data.policyType || 'LIFE',
            premiumAmount: data.premiumAmount || '',
            startDate: data.startDate || '',
            endDate: data.endDate || ''
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
        await updatePolicy(id, formData);
        toast.success('Policy updated successfully');
      } else {
        await createPolicy(formData);
        toast.success('Policy created successfully');
      }
      navigate('/policies');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? 'Edit Policy' : 'Create New Policy'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer</label>
          <select name="customerId" value={formData.customerId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="">Select a Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Policy Type</label>
          <select name="policyType" value={formData.policyType} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="LIFE">Life</option>
            <option value="HEALTH">Health</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="HOME">Home</option>
            <option value="TRAVEL">Travel</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Premium Amount</label>
          <input type="number" step="0.01" name="premiumAmount" value={formData.premiumAmount} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={() => navigate('/policies')} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PolicyFormPage;
