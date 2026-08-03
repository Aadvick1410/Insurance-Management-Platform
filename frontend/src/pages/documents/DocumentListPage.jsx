import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocumentsByCustomer, getDocumentsByPolicy, getDocumentsByClaim, downloadDocument, deleteDocument } from '../../services/documentService';
import toast from 'react-hot-toast';

const DocumentListPage = () => {
  const [searchType, setSearchType] = useState('policy'); // 'customer', 'policy', 'claim'
  const [searchId, setSearchId] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;

    setLoading(true);
    try {
      let data;
      if (searchType === 'customer') {
        data = await getDocumentsByCustomer(searchId);
      } else if (searchType === 'policy') {
        data = await getDocumentsByPolicy(searchId);
      } else if (searchType === 'claim') {
        data = await getDocumentsByClaim(searchId);
      }
      setDocuments(data || []);
      if (data.length === 0) toast.success('No documents found for this ID.');
    } catch (error) {
      toast.error('Failed to fetch documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      await downloadDocument(id, fileName);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await deleteDocument(id);
        toast.success('Document deleted successfully');
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Document Management</h1>
        <Link to="/documents/upload" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Upload Document
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search By</label>
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
              <option value="policy">Policy ID</option>
              <option value="customer">Customer ID</option>
              <option value="claim">Claim ID</option>
            </select>
          </div>
          <div className="flex-grow max-w-xs">
            <label className="block text-sm font-medium text-gray-700">{searchType.charAt(0).toUpperCase() + searchType.slice(1)} ID</label>
            <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder={`Enter ${searchType} ID...`} />
          </div>
          <button type="submit" disabled={loading} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 disabled:opacity-50">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {documents.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.fileName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.documentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(doc.uploadedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDownload(doc.id, doc.fileName)} className="text-blue-600 hover:text-blue-900 mr-4">Download</button>
                    <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
