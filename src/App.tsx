import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import UserRegistration from './pages/UserRegistration';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Admin from './Admin';
import Chart from './pages/Chart';
import FormElements from './pages/Form/FormElements';
import Profile from './pages/Profile';
//import Settings from './pages/ResetPassword';
//import Tables from './pages/Tables';
//import RegistrationFlow  from './pages/RegistrationFlow';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import QrCodeGenerator from './pages/QrCodeGenerator';
import TransactionManagement from './pages/TransactionManagement';
import MerchantRegistration from './pages/MerchantRegistrationForm';
import TestForm from './pages/Form/TestForm';
import Merchant from './Merchant';
import UserProfile from './pages/UserProfile';
import ViewMerchant from './pages/ViewMerchant';
import ResetPassword from './pages/ResetPassword';
import UserRegistrationForm from './pages/UserRegistrationForm';

interface User {
  username: string;
  role: string;
  id:string;
  userId:string; // Role can be '1' for admin or '2' for merchant
}

const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await axios.post('http://10.195.49.17:5000/login', {
      username,
      password,
    });

    console.log('API Response:', response.data.user.role); // Log the entire response

    //const { username: user, role } = response.data;
    return response.data.user;// Return user object
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Authentication error:', error.response?.data || error.message);
    } else {
      console.error('Authentication error:', error);
    }
    return null; // Return null if authentication fails
  }
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [, setUserRole] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(null); // State for success message
  const { pathname } = useLocation();
  const navigate = useNavigate(); // Use the useNavigate hook

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const user = await authenticateUser(username, password);
    
    if (user) {
      setUserRole(user.role);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id); // Ensure user ID is stored
  
      const role = user.role[0];
      if (role === '1') {
        navigate('/admin');
      } else {
        navigate('/merchant');
      }
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };
  const userId = localStorage.getItem('userId');
  // Load user role from local storage on initial render
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole); // Set user role from local storage
    }
  }, []);
  

  return loading ? (
    <Loader />
  ) : (
    <>
      {successMessage && ( // Render success message if it exists
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <Routes>
        <Route path="/" element={  <><PageTitle title="Sign In" /><SignIn handleLogin={handleLogin} />
          </>
        } />
        <Route path="/auth/signin" element={
          <><SignIn handleLogin={handleLogin} />
          </>
        } />
        <Route path="/auth/signup" element={ <> <SignUp />  </>} />
       
        {/* Merchant Routes */}
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forms/form-elements" element={<FormElements />} />
        
        <Route path="/Userprofile" element={<UserProfile/>} />      
        <Route path="/TestForm" element={<TestForm />} /> 
        <Route path="/TransactionManagement" element={<TransactionManagement branchId={''}/>} />
        <Route path="/ViewMerchant" element={<ViewMerchant userId={userId}/>} />
        <Route path="/UserRegistration" element={<UserRegistration />} />
        <Route path='/UserRegistrationForm' element={<UserRegistrationForm/>}/>
        <Route path="/QrCodeGenerator" element={<QrCodeGenerator />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/ui/alerts" element={<Alerts />} />
        <Route path="/ui/buttons" element={<Buttons />} />
        <Route path="/Merchant" element={<Merchant />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin/>} />
       
      </Routes>
    </>
  );
}

export default App;