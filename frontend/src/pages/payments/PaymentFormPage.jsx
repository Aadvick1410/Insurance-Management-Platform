import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recordPayment } from '../../services/paymentService';
import { getPolicies } from '../../services/policyService';
import toast from 'react-hot-toast';

const PaymentFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPolicyId = searchParams.get('policyId') || '';

  const [formData, setFormData] = useState({
    policyId: initialPolicyId,
    paymentDate: new Date().toISOString().split('T')[0],
    amount: '',
    paymentStatus: 'PAID'
  });
  
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await getPolicies(0, 100);
        setPolicies(data.content || []);
      } catch (error) {
        toast.error('Failed to load policies');
      }
    };
    fetchPolicies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await recordPayment(formData);
      toast.success('Payment recorded successfully');
      navigate('/payments');
    } catch (error) {
      // Error handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Record Premium Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Policy</label>
          <select name="policyId" value={formData.policyId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="">-- Choose a Policy --</option>
            {policies.map(p => (
              <option key={p.id} value={p.id}>{p.policyNumber} - {p.customerName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Date</label>
          <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={() => navigate('/payments')} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentFormPage;
