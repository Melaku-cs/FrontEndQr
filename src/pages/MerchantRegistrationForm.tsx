// src/components/MerchantRegistrationForm.tsx
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Reusable Input Field Component
const InputField: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}> = ({ label, name, type = "text", value, onChange, error }) => {
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

// Merchant Registration Form Component
const MerchantRegistrationForm: React.FC<{ userId: number; onSuccess: () => void }> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    merchantName: '',
    mobileNumber: '',
    city: '',
    taxId: '',
    postalCode: '',
    country: '',
    merchantAccount: '',
    merchantCategory: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.merchantName) newErrors.merchantName = 'Merchant Name is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.taxId) newErrors.taxId = 'Tax ID is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal Code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.merchantAccount) newErrors.merchantAccount = 'Merchant Account is required';
    if (!formData.merchantCategory) newErrors.merchantCategory = 'Merchant Category is required';

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
      merchantName: '',
      mobileNumber: '',
      city: '',
      taxId: '',
      postalCode: '',
      country: '',
      merchantAccount: '',
      merchantCategory: '',
    });
    setErrors({});
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://10.195.49.17:5000/api/merchants', {
        userId,
        ...formData,
      });

      setSuccess('Merchant registered successfully!');
      onSuccess(); // Callback to indicate success
      handleClear();
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data?.message || 'An unknown error occurred';
      setErrors({ api: `Error registering merchant: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg">
        <div className="rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="border-b bg-gray-600 w-full py-4">
            <h3 className="font-bold text-white text-2xl">Merchant Registration</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="py-4 flex flex-wrap">
              <InputField label="Merchant Name" name="merchantName" value={formData.merchantName} onChange={handleChange} error={errors.merchantName} />
              <InputField label="Mobile Number" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} />
              <InputField label="Tax ID" name="taxId" value={formData.taxId} onChange={handleChange} error={errors.taxId} />
              <InputField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} />
              <InputField label="Country" name="country" value={formData.country} onChange={handleChange} error={errors.country} />
              <InputField label="Merchant Account" name="merchantAccount" value={formData.merchantAccount} onChange={handleChange} error={errors.merchantAccount} />
              <InputField label="Merchant Category" name="merchantCategory" value={formData.merchantCategory} onChange={handleChange} error={errors.merchantCategory} />

              {errors.api && <div className="text-red-500 w-full">{errors.api}</div>}
              {success && <div className="text-green-500 w-full">{success}</div>}

              <div className="flex gap-4 mt-4">
                <button type="submit" className={`rounded bg-blue-500 py-2 text-white hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MerchantRegistrationForm;