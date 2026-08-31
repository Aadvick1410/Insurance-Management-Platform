import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiEye, FiMail } from 'react-icons/fi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      // Error handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa] p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl flex relative overflow-hidden min-h-[600px]">
        
        {/* Top Right Decorative Circle */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#b4c3ff] rounded-full flex items-center justify-center opacity-80 pointer-events-none">
          <span className="text-white text-6xl font-bold mt-8 mr-8">D</span>
        </div>

        {/* Left Side - Illustrations (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 p-8 flex-col justify-center items-center relative bg-[#fefefe]">
           <img src="/illustration.png" alt="Illustration" className="w-full max-w-sm opacity-90 object-contain" />
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-10 lg:p-16 z-10 bg-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Register</h1>
          <h2 className="text-2xl font-bold text-gray-700 mb-8">Management System</h2>

          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
            {/* Full Name */}
            <div className="relative">
              <span className="absolute left-0 bottom-2 text-gray-400 text-lg">
                 <FiUser />
              </span>
              <input 
                name="name"
                type="text" 
                required
                placeholder="Full Name"
                className="w-full pl-8 pb-2 border-0 border-b border-gray-300 focus:ring-0 focus:border-[#6c74fb] outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute left-0 bottom-2 text-gray-400 text-lg">
                 <FiMail />
              </span>
              <input 
                name="email"
                type="email" 
                required
                placeholder="Email Address"
                className="w-full pl-8 pb-2 border-0 border-b border-gray-300 focus:ring-0 focus:border-[#6c74fb] outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-0 bottom-2 text-gray-400 text-lg">
                 <FiEye />
              </span>
              <input 
                name="password"
                type="password" 
                required
                placeholder="Password"
                className="w-full pl-8 pb-2 border-0 border-b border-gray-300 focus:ring-0 focus:border-[#6c74fb] outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Role */}
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pb-2 border-0 border-b border-gray-300 focus:ring-0 focus:border-[#6c74fb] outline-none text-gray-700 bg-transparent text-sm cursor-pointer"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="AGENT">Insurance Agent</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#6b73ff] hover:bg-[#5a62ff] text-white font-medium py-3 rounded-lg shadow-md transition duration-300 tracking-wide mt-4 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            {/* Footer */}
            <div className="pt-4 flex items-center justify-between text-xs text-gray-500">
              <Link to="/login" className="hover:text-[#6b73ff] transition-colors font-medium">Already have an account? Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
