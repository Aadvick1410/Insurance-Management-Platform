import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument } from '../../services/documentService';
import toast from 'react-hot-toast';

const DocumentUploadPage = () => {
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    documentType: 'IDENTITY_PROOF',
    customerId: '',
    policyId: '',
    claimId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!formData.customerId && !formData.policyId && !formData.claimId) {
      toast.error('Please associate the document with at least one entity (Customer, Policy, or Claim)');
      return;
    }

    setLoading(true);
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('documentType', formData.documentType);
    if (formData.customerId) uploadData.append('customerId', formData.customerId);
    if (formData.policyId) uploadData.append('policyId', formData.policyId);
    if (formData.claimId) uploadData.append('claimId', formData.claimId);

    try {
      await uploadDocument(uploadData);
      toast.success('Document uploaded successfully');
      navigate('/documents');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Document</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select File</label>
          <input type="file" onChange={handleFileChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Document Type</label>
          <select name="documentType" value={formData.documentType} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="IDENTITY_PROOF">Identity Proof</option>
            <option value="ADDRESS_PROOF">Address Proof</option>
            <option value="POLICY_AGREEMENT">Policy Agreement</option>
            <option value="CLAIM_FORM">Claim Form</option>
            <option value="MEDICAL_REPORT">Medical Report</option>
            <option value="VEHICLE_REGISTRATION">Vehicle Registration</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="border-t pt-4 mt-6">
          <p className="text-sm text-gray-500 mb-4">Link this document to one or more of the following (at least one is required):</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer ID</label>
              <input type="number" name="customerId" value={formData.customerId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Policy ID</label>
              <input type="number" name="policyId" value={formData.policyId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Claim ID</label>
              <input type="number" name="claimId" value={formData.claimId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={() => navigate('/documents')} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUploadPage;
