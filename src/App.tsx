import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserRegistration from './pages/UserRegistration';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Admin from './Admin';
import TransactionManagement from './pages/TransactionManagement';
import Merchant from './Merchant';
import UserRegistrationForm from './pages/UserRegistrationForm';
import PrivateRoute from './components/PrivateRoute';
import ViewMerchant from './pages/ViewMerchant';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';
import QrCodeGenerator from './pages/QrCodeGenerator';
import Profile from './pages/Profile';
import LogOut from './pages/LogOut';
import NotFound from './pages/NotFound';

// User interface definition
interface User {
  username: string;
  role: string[];
  userId: string;
  profileImage?: string;
}

// Token interface definition
interface Token {
  access_token: string;
  expiry: number;
}

// AuthResponse interface definition
interface AuthResponse {
  user: User;
  token: Token;
}

// Function to authenticate user
const authenticateUser = async (username: string, password: string): Promise<AuthResponse | null> => {
  try {
    const response = await axios.post('http://10.195.49.17:5000/api/auth/login', {
      username,
      password,
    });
    return response.data.user ? { user: response.data.user, token: response.data.token } : null; // Return user and token
  } catch (error) {
    console.error('Authentication error:', axios.isAxiosError(error) ? error.response?.data : error);
    return null;
  }
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');

    if (username) {
      setIsLoggedIn(true);
      if (storedRole) {
        setUserRole(storedRole);
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (username: string, password: string): Promise<{ username: string; profileImage?: string } | null> => {
    const response = await authenticateUser(username, password);

    if (response && response.user) {
      const user = response.user; // Extract user from response
      const newRole = user.role[0];

      // Retrieve the access token from the response
      const accessToken = response.token?.access_token; // Use optional chaining

      setUserRole(newRole);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userRole', newRole);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('token', accessToken || ''); // Store the access token
      
      console.log("Access Token:", accessToken); // Log the token to verify it's being retrieved

      setIsLoggedIn(true);
      navigateBasedOnRole(newRole);
      return { username: user.username, profileImage: user.profileImage }; // Adjust according to your needs
    } else {
      alert('Invalid credentials. Please try again.');
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token') || ''; // Provide fallback value
      await axios.post('http://10.195.49.17:5000/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is a string
        },
      });
      localStorage.clear(); // Clear all local storage
      setIsLoggedIn(false);
      setUserRole(null);
      navigate('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateBasedOnRole = (role: string) => {
    switch (role) {
      case '1':
        navigate('/admin');
        break;
      case '2':
        navigate('/merchant');
        break;
      default:
        alert('Unauthorized role.');
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route path="/" element={<><PageTitle title="Sign In" /><SignIn handleLogin={handleLogin} /></>} />
      <Route path="/auth/signin" element={<SignIn handleLogin={handleLogin} />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/UserRegistrationForm" element={<UserRegistrationForm />} />
      <Route path="/logOut" element={<LogOut handleLogout={handleLogout} />} />
      <Route element={<PrivateRoute role={userRole || ''} isLoggedIn={isLoggedIn} />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/transaction-management" element={<TransactionManagement branchId={''} />} />
        <Route path="/ViewMerchant" element={<ViewMerchant />} />
        <Route path="/UserRegistration" element={<UserRegistration />} />
        <Route path="/qrcodegenerator" element={<QrCodeGenerator />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;