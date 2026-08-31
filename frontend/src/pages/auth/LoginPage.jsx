import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiEye } from 'react-icons/fi';
import { FaWeixin, FaQq, FaWeibo } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa] p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl flex relative overflow-hidden h-[600px]">
        
        {/* Top Right Decorative Circle */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#b4c3ff] rounded-full flex items-center justify-center opacity-80 pointer-events-none">
          <span className="text-white text-6xl font-bold mt-8 mr-8">D</span>
        </div>

        {/* Left Side - Illustrations (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 p-8 flex-col justify-center items-center relative border-r border-gray-100 bg-[#fefefe]">
           {/* We use a beautiful inline SVG as a placeholder for the user's illustration */}
           <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 500 500" className="w-full max-w-sm opacity-90">
              <path fill="#e2e8f0" d="M100 400 h300 v5 h-300 z" />
              <circle cx="250" cy="200" r="100" fill="#cbd5e1" opacity="0.3"/>
              <path fill="#64748b" d="M250 400 C250 250, 150 200, 150 150 C150 100, 250 100, 250 50 C250 100, 350 100, 350 150 C350 200, 250 250, 250 400 Z" />
              <rect x="220" y="250" width="60" height="150" fill="#475569" />
              <circle cx="200" cy="150" r="15" fill="#8b5cf6" />
              <circle cx="300" cy="120" r="12" fill="#8b5cf6" />
              <circle cx="180" cy="220" r="10" fill="#8b5cf6" />
              <rect x="50" y="250" width="120" height="80" fill="none" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="110" cy="290" r="25" fill="#3b82f6" />
              <rect x="180" y="300" width="120" height="80" fill="none" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="195" y="340" width="15" height="30" fill="#64748b" />
              <rect x="215" y="320" width="15" height="50" fill="#8b5cf6" />
              <rect x="235" y="360" width="15" height="10" fill="#3b82f6" />
           </svg>
           <p className="mt-8 text-gray-400 text-sm italic">Illustration Area</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 lg:p-16 z-10 bg-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
          <h2 className="text-2xl font-bold text-gray-700 mb-12">Management System</h2>

          <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-sm">
            {/* Username/Email */}
            <div className="relative">
              <span className="absolute left-0 bottom-2 text-gray-400 text-lg">
                 <FiUser />
              </span>
              <input 
                type="email" 
                required
                placeholder="Email: admin@insurance.com"
                className="w-full pl-8 pb-2 border-0 border-b border-gray-300 focus:ring-0 focus:border-[#6c74fb] outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-0 bottom-2 text-gray-400 text-lg">
                 <FiEye />
              </span>
              <input 
                type="password" 
                required
                placeholder="Password: admin123"
                className="w-full pl-8 pb-2 border-0 border-b border-gray-300 focus:ring-0 focus:border-[#6c74fb] outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center pt-2">
              <input type="checkbox" id="remember" className="w-4 h-4 text-[#6c74fb] border-gray-300 rounded focus:ring-[#6c74fb]" />
              <label htmlFor="remember" className="ml-2 text-xs text-gray-400">Remember me</label>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className="w-full bg-[#6b73ff] hover:bg-[#5a62ff] text-white font-medium py-3 rounded-lg shadow-md transition duration-300 tracking-wide mt-2"
            >
              Login
            </button>

            {/* Footer */}
            <div className="pt-6 flex items-center justify-between text-xs text-gray-500">
              <a href="#" className="hover:text-[#6b73ff] transition-colors">Haven't registered yet?</a>
              <div className="flex items-center space-x-3">
                <span>Other ways</span>
                <div className="flex space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#4cb55e] text-white flex items-center justify-center cursor-pointer hover:opacity-80"><FaWeixin size={12} /></span>
                  <span className="w-6 h-6 rounded-full bg-[#3fa8ea] text-white flex items-center justify-center cursor-pointer hover:opacity-80"><FaQq size={12} /></span>
                  <span className="w-6 h-6 rounded-full bg-[#df5246] text-white flex items-center justify-center cursor-pointer hover:opacity-80"><FaWeibo size={12} /></span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
