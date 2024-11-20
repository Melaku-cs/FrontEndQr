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

interface SelectOption {
  value: string;
  label: string;
}

interface ErrorResponse {
  message?: string; // Define the expected structure
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
        <label className={`absolute left-3 top-3 ${error ? 'text-red-500' : 'text-indigo-600'} transition-all duration-200 transform origin-[0] px-1 
          ${isFocused || value ? '-translate-y-4 scale-75' : 'top-3 scale-100'} text-lg font-bold`}>
          {label}
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

// Reusable Select Field Component
const SelectField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: SelectOption[], error?: string }> = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="mb-4 w-full">
      <label className={`block mb-2 ${error ? 'text-red-500' : 'font-bold text-indigo-600'}`}>
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} bg-white font-bold py-3 px-5 text-indigo-600 outline-none transition`}>
        <option value="" disabled>Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

// Spinner Component
const Spinner: React.FC = () => (
  <div className="loader"></div>
);

// CSS for the loading spinner
const spinnerStyle = `
  .loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #f60;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const UserRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    userType: '',
    merchantCategory: '',
    merchantCity: '',
    taxId: '',
    postalCode: '',
    country: '',
    merchantAccount: '',
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
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.userType) newErrors.userType = 'User Type is required';

    if (formData.userType === 'merchant') {
      if (!formData.merchantCategory) newErrors.merchantCategory = 'Merchant Category is required';
      if (!formData.merchantCity) newErrors.merchantCity = 'Merchant City is required';
      if (!formData.taxId) newErrors.taxId = 'Tax ID is required';
      if (!formData.postalCode) newErrors.postalCode = 'Postal Code is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      confirmPassword: '',
      phone: '',
      gender: '',
      userType: '',
      merchantCategory: '',
      merchantCity: '',
      taxId: '',
      postalCode: '',
      country: '',
      merchantAccount: '',
      address: '',
    });
    setErrors({});
    setSuccess('');
  };

  const handleCancel = () => {
    console.log("Registration canceled");
    handleClear();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);

    if (!validate()) {
      console.log('Validation failed:', errors);
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      const userResponse = await axios.post('http://10.195.49.17:5000/api/user', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
      });

      const user_id = userResponse.data.user.id;

      if (formData.userType === 'merchant') {
        const merchantResponse = await axios.post('http://10.195.49.17:5000/api/merchants', {
          userId: user_id,
          merchant_category: formData.merchantCategory,
          merchant_city: formData.merchantCity,
          tax_id: formData.taxId,
          postal_code: formData.postalCode,
          country: formData.country,
          merchant_account: formData.merchantAccount,
        });
        console.log('Merchant registration response:', merchantResponse.data);
      }

      setSuccess('User and merchant registered successfully!');
      handleClear();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 20000);
      
    } catch (err) {
      const error = err as AxiosError;
      console.error('Error object:', error);
      const errorMessage = (error.response?.data as ErrorResponse)?.message || 'An unknown error occurred';
      setErrors({ api: `Error creating user: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const userTypes: SelectOption[] = [
    { value: '', label: 'Select User Type' },
    { value: 'user', label: 'User' },
    { value: 'merchant', label: 'Merchant' },
  ];

  const merchantCategories: SelectOption[] = [
    { value: 'retail', label: 'Retail' },
    { value: 'services', label: 'Services' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'toys', label: 'Toys' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'books', label: 'Books' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'sports', label: 'Sports Equipment' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'travel', label: 'Travel Services' },
    { value: 'home_services', label: 'Home Services' },
    { value: 'pet_services', label: 'Pet Services' },
    { value: 'construction', label: 'Construction' },
    { value: 'consulting', label: 'Consulting Services' },
    { value: 'marketing', label: 'Marketing Services' },
    { value: 'education', label: 'Education Services' },
  ];

  const countries: SelectOption[] = [
    { value: '', label: 'Select Country' },
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'IN', label: 'India' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' },
    { value: 'BR', label: 'Brazil' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'MX', label: 'Mexico' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'SE', label: 'Sweden' },
    { value: 'NO', label: 'Norway' },
    { value: 'FI', label: 'Finland' },
    { value: 'DK', label: 'Denmark' },
    { value: 'IE', label: 'Ireland' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <style>{spinnerStyle}</style>
      <div className="w-full max-w-lg">
        <div className="rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="border-b bg-[#f60] w-full py-4">
            <h3 className="font-bold text-white text-2xl">User Registration</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="py-4 grid grid-cols-2 gap-4">
              <SelectField 
                label="User Type"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                options={userTypes}
                error={errors.userType}
              />
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
              <SelectField 
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Gender' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                ]}
                error={errors.gender}
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
              <InputField 
                label="Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />

              {formData.userType === 'merchant' && (
                <>
                  <SelectField 
                    label="Merchant Category"
                    name="merchantCategory"
                    value={formData.merchantCategory}
                    onChange={handleChange}
                    options={merchantCategories}
                    error={errors.merchantCategory}
                  />
                  <InputField 
                    label="Merchant City"
                    name="merchantCity"
                    value={formData.merchantCity}
                    onChange={handleChange}
                    error={errors.merchantCity}
                  />
                  <InputField 
                    label="Tax ID"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    error={errors.taxId}
                  />
                  <InputField 
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    error={errors.postalCode}
                  />
                  <SelectField 
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    options={countries}
                    error={errors.country}
                  />
                  <InputField 
                    label="Merchant Account"
                    name="merchantAccount"
                    value={formData.merchantAccount}
                    onChange={handleChange}
                    error={errors.merchantAccount}
                  />
                </>
              )}

              {errors.api && <div className="text-red-500 w-full">{errors.api}</div>}
              {success && <div className="text-green-500 w-full text-center font-bold">{success}</div>}

              <div className="flex gap-4 col-span-2 mt-4">
                <button 
                  type="submit" 
                  className={`rounded bg-blue-500 py-2 text-white hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Submit'}
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