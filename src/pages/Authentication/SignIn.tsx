import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
  handleLogin: (username: string, password: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    console.log('hdhjas')
    e.preventDefault();
    handleLogin(username, password); // Pass only username and password
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" 
         style={{ backgroundImage: "url('/images/logo/loginbg.svg')" }}>
      <form className="bg-white p-6 rounded-2xl shadow-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 font-bold text-black text-center">Sign In</h2>

        {/* Username Input */}
        <div className="mb-4 relative">
          <input
            type="text"
            id="username"
            className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label
            htmlFor="username"
            className={`absolute font-bold text-xl left-2 top-2 transition-all duration-200 transform ${username ? 'scale-75 -translate-y-3' : 'translate-y-0'} origin-top-left text-black`}
          >
            Username
          </label>
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <input
            type="password"
            id="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label
            htmlFor="password"
            className={`absolute font-bold text-xl left-2 top-2 transition-all duration-200 transform ${password ? 'scale-75 -translate-y-3' : 'translate-y-0'} origin-top-left text-black`}
          >
            Password
          </label>
        </div>

        {/* Login Button */}
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded hover:from-blue-600 hover:to-blue-800 transition duration-200"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-white hover:underline">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default SignIn;