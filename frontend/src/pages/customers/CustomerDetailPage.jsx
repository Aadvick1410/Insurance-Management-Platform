import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById } from '../../services/customerService';
import toast from 'react-hot-toast';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(id);
        setCustomer(data);
      } catch (error) {
        toast.error('Failed to load customer details');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!customer) return <div className="p-6 text-center text-red-500">Customer not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Profile</h1>
        <div className="flex gap-4">
          <Link to={`/customers/${id}/edit`} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
            Edit Profile
          </Link>
          <Link to="/customers" className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300">
            Back to List
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-lg text-gray-900">{customer.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-lg text-gray-900">{customer.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="mt-1 text-lg text-gray-900">{customer.phone || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
            <p className="mt-1 text-lg text-gray-900">{customer.dob || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="mt-1 text-lg text-gray-900">{customer.address || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
            <p className="mt-1 text-lg text-gray-900">{new Date(customer.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      {/* Placeholders for related data modules (Policies, Claims, Documents) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-lg shadow">
           <h3 className="font-bold text-gray-800 mb-2">Policies</h3>
           <p className="text-sm text-gray-500">Policy list will be integrated here.</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow">
           <h3 className="font-bold text-gray-800 mb-2">Claims</h3>
           <p className="text-sm text-gray-500">Claims history will be integrated here.</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow">
           <h3 className="font-bold text-gray-800 mb-2">Documents</h3>
           <p className="text-sm text-gray-500">Uploaded documents will be shown here.</p>
         </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
