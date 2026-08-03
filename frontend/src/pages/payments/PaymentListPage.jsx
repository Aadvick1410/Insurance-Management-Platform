import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPayments } from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentListPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  const fetchPayments = async (pageNumber) => {
    try {
      setLoading(true);
      const data = await getPayments(pageNumber);
      setPayments(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Premium Payments</h1>
        <Link to="/payments/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Record Payment
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link to={`/policies/${payment.policyId}`}>{payment.policyNumber}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                      payment.paymentStatus === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.paymentStatus}
                    </span>
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

export default PaymentListPage;
