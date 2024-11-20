import React, { useState } from 'react';

interface SignInProps {
  handleLogin: (username: string, password: string) => Promise<{ username: string; profileImage?: string }>;
}

const SignIn: React.FC<SignInProps> = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for password visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Both fields are required.');
      return;
    }

    setLoading(true);

    try {
      const user = await handleLogin(username, password);
      
      // Store user information in local storage
      localStorage.setItem('username', user.username);
      localStorage.setItem('userProfileImage', user.profileImage || 'path/to/default/image.png'); // Set default image if none is provided
      
      // Optionally, navigate to a different page after login
      // history.push('/dashboard'); // Uncomment if you have routing set up
    } catch (err) {
      setError('Invalid username or password. Please try again.'); // Consider customizing this message based on error response
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" 
         style={{ backgroundImage: "url('/images/logo/loginbg.svg')" }}>
      <form className="bg-white p-6 rounded-2xl shadow-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 font-bold text-black text-center">Sign In</h2>

        {/* Error Message */}
        {error && <div className="mb-4 text-red-600 text-center" role="alert" aria-live="assertive">{error}</div>}

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
            type={showPassword ? 'text' : 'password'} // Toggle password visibility
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
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Login Button */}
        <button 
          type="submit" 
          className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded hover:from-blue-600 hover:to-blue-800 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-white hover:underline">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default SignIn;