import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Define the props interface for InputField
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

// Reusable Input Field Component
const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };

  return (
    <div className="mb-4 w-full">
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          className={`block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} bg-white py-3 px-5 text-black outline-none transition focus:border-indigo-600`}
          required
        />
        <label className={`absolute left-3 top-3 ${error ? 'text-red-500' : 'text-indigo-600'} transition-all duration-200 transform origin-[0] bg-white px-1 
          ${isFocused || value ? '-translate-y-4 scale-75' : 'top-3 scale-100'} text-lg font-bold`}>
          {label}
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

// Main UserRegistrationForm Component
const UserRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    phone: '',
    gender: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = 'First Name is required';
    if (!formData.last_name) newErrors.last_name = 'Last Name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.phone) newErrors.phone = 'Phone Number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleClear = () => {
    setFormData({
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      phone: '',
      gender: '',
      address: '',
    });
    setErrors({});
    setSuccess('');
  };

  const handleCancel = () => {
    console.log("Registration canceled");
    handleClear();
  };

  // Define an interface for the API error response
  interface ApiErrorResponse {
    error?: string;
    message?: string; // Add any other properties you expect
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {

      console.log("=============")
      const response = await axios.post('http://10.195.49.17:5000/api/user', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
      });

      setSuccess('User created successfully!');
      console.log('Response:', response.data);
      handleClear();
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        // Assert the type of error.response.data
        const errorData = error.response.data as ApiErrorResponse;
        const errorMessage = errorData.error || errorData.message || 'An unknown error occurred';
        setErrors({ api: `Error creating user: ${errorMessage}` });
        console.error('Error response data:', errorData);
      } else if (error.request) {
        setErrors({ api: 'Error: No response from server. Please try again later.' });
      } else {
        setErrors({ api: `Error: ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg">
        <div className="rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="border-b bg-gray-600 w-full py-4">
            <h3 className="font-bold text-white text-2xl">
              User Registration
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="py-4 flex flex-wrap ">
              <InputField 
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
              />
              <InputField 
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
              />
              <InputField 
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
              />
              <InputField 
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <InputField 
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
              />
              <InputField 
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
              <InputField 
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              {errors.api && <div className="text-red-500 w-full">{errors.api}</div>}
              {success && <div className="text-green-500 w-full">{success}</div>}

              <div className="flex gap-4 mt-4">
                <button 
                  type="submit" 
                  className={`rounded bg-blue-500 py-2 text-white hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded bg-gray-400 py-2 text-white hover:bg-gray-500"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded bg-red-400 py-2 text-white hover:bg-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationForm;