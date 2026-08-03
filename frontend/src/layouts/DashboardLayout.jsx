import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAgentOrAdmin = user?.role?.includes('ROLE_ADMIN') || user?.role?.includes('ROLE_AGENT') || user?.role === 'admin';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
          <span>Insurance App</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex-1 mt-4 space-y-1 overflow-y-auto">
          {isAgentOrAdmin && (
            <Link to="/" onClick={() => setSidebarOpen(false)} className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-blue-500">
              Dashboard
            </Link>
          )}
          <Link to="/customers" onClick={() => setSidebarOpen(false)} className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-blue-500">
            Customers
          </Link>
          <Link to="/policies" onClick={() => setSidebarOpen(false)} className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-blue-500">
            Policies
          </Link>
          <Link to="/payments" onClick={() => setSidebarOpen(false)} className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-blue-500">
            Payments
          </Link>
          <Link to="/claims" onClick={() => setSidebarOpen(false)} className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-blue-500">
            Claims
          </Link>
          <Link to="/documents" onClick={() => setSidebarOpen(false)} className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-blue-500">
            Documents
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow">
          <div className="py-4 px-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
              >
                <FiMenu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 truncate hidden sm:block">
                Welcome, {user?.email || 'User'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 hidden md:block">Role: {user?.role?.replace('ROLE_', '')}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 shadow"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="mx-auto py-6 px-4 sm:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
