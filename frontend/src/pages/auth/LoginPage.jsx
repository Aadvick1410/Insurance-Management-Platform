import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiEye } from 'react-icons/fi';

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
        <div className="hidden md:flex md:w-1/2 p-8 flex-col justify-center items-center relative bg-white">
           <img src="/illustration.png" alt="Illustration" className="w-full max-w-sm opacity-90 object-contain" />
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
              <Link to="/register" className="hover:text-[#6b73ff] transition-colors font-medium">Haven't registered yet?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
