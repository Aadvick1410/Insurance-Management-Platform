import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPaymentHistory } from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentHistoryPage = () => {
  const { policyId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getPaymentHistory(policyId);
        setPayments(data);
      } catch (error) {
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [policyId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <Link to={`/payments/new?policyId=${policyId}`} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Make Payment
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No payment records found for this policy.</div>
        ) : (
          <div className="relative border-l border-gray-200 ml-6 m-6">
            {payments.map((payment, index) => (
              <div key={payment.id} className="mb-10 ml-6">
                <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${
                  payment.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                  payment.paymentStatus === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  <svg className="w-3 h-3 text-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                  </svg>
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                  ${payment.amount}
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                    {payment.paymentStatus}
                  </span>
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400">Paid on {payment.paymentDate}</time>
                <p className="text-base font-normal text-gray-500">Policy: {payment.policyNumber}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
