import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MerchantCount: React.FC = () => {
  const [merchantCount, setMerchantCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchMerchantCount = async () => {
    try {
      const response = await axios.get('http://10.195.49.17:5000/api/merchants');
      if (Array.isArray(response.data.merchants)) {
        setMerchantCount(response.data.merchants.length);
      } else {
        throw new Error('Expected an array of merchants');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.message || 'Error fetching merchant data');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantCount();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h3 className="font-bold text-black text-xl mb-4">Total Merchants</h3>
      {loading && <p>Loading count...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <p className="text-lg">Total Merchants: <strong>{merchantCount}</strong></p>
    </div>
  );
};

export default MerchantCount;