import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const FormLayout: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    accountNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (formData.firstName.length < 10 || formData.firstName.length > 25) {
      newErrors.firstName = 'First Name must be between 10 and 25 characters';
    }
    if (!formData.middleName) newErrors.middleName = 'Middle Name is required';
    if (formData.middleName.length < 10 || formData.middleName.length > 25) {
      newErrors.middleName = 'Middle Name must be between 10 and 25 characters';
    }
    
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (formData.lastName.length < 10 || formData.lastName.length > 25) {
      newErrors.lastName = 'Last Name must be between 10 and 25 characters';
    }
    
    if (!formData.accountNumber) {
      newErrors.accountNumber = 'Account Number is required';
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account Number must consist of digits only';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one digit';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    if (!formData.address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error for the field being changed
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true); // Set loading to true

    if (!validate()) {
      setLoading(false); // Set loading to false if validation fails
      return; // Validate form data
    }

    try {
      const response = await axios.post('http://10.195.49.17:5000/api/auth/user', {
       
        first_name:formData.firstName,
        last_name:formData.firstName,
        username: formData.firstName,
        password: formData.password,
        phone: formData.accountNumber,
       // email: formData.email,
        gender: formData.gender,
        //dateOfBirth: formData.dateOfBirth,
        address: formData.address
      });

      setSuccess('User created successfully!');
      console.log('Response:', response.data);

      // Reset the form fields
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        accountNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dateOfBirth: '',
        address: ''
      });
    } catch (err) {
      const error = err as AxiosError;
      setErrors({ api: 'Error creating user: ' + (error.response ? error.response.data : error.message) });
      console.error('Error:', error);
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  return (
    <>
      <Breadcrumb pageName="Customer Registration" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-lg border border-stroke bg-white shadow-lg p-6 dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4">
              <h3 className="font-medium text-black dark:text-white text-2xl">Contact Form</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="py-4">
                <InputField 
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <InputField 
                  label="Middle Name"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleChange}
                  error={errors.middleName}
                />
                <InputField 
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
                <InputField 
                  label="Account Number"
                  name="accountNumber"
                  type="text"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  error={errors.accountNumber}
                />
                <InputField 
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <InputField 
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <InputField 
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
                <SelectField 
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={errors.gender}
                />
                <InputField 
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                />
                <InputField 
                  label="Address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                />

                {errors.api && <div className="text-red-500">{errors.api}</div>}
                {success && <div className="text-green-500">{success}</div>}

                <button 
                  type="submit" 
                  className={`mt-4 rounded bg-blue-500 py-2 text-white hover:bg-blue-600 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable Input Field Component
const InputField = ({ label, name, type = "text", value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          className={`block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-indigo-600 dark:border-gray-600 dark:bg-form-input dark:text-white text-lg peer`}
          required
        />
        <label className={`absolute left-3 top-3 ${error ? 'text-red-500' : 'text-indigo-600'} transition-all duration-200 transform origin-[0] bg-white dark:bg-gray-900 px-1 
          ${isFocused || value ? '-translate-y-4 scale-75' : 'top-3 scale-100'} peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-focus:-top-1.5 peer-focus:left-3 peer-focus:text-indigo-600 peer-focus:scale-75 text-lg`}>
          {label}
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

// Reusable Select Field Component
const SelectField = ({ label, name, value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-indigo-600 dark:border-gray-600 dark:bg-form-input dark:text-white text-lg peer`}
        >
          <option value="" disabled>Select {label}</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label className={`absolute left-3 top-3 ${error ? 'text-red-500' : 'text-indigo-600'} transition-all duration-200 transform origin-[0] bg-white dark:bg-gray-900 px-1 
          ${isFocused || value ? '-translate-y-4 scale-75' : 'top-3 scale-100'} peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-focus:-top-1.5 peer-focus:left-3 peer-focus:text-indigo-600 peer-focus:scale-75 text-lg`}>
          {label}
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default FormLayout;