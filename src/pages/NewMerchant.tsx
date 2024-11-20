import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Merchant {
  id: string; // Merchant ID
  merchant_account: string;
  merchant_category: string;
  merchant_city: string;
  postal_code: string;
  tax_id: string;
  country: string;
  createdAt: string; // Date fields if needed
  updatedAt: string; // Date fields if needed
}

const ViewMerchant: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [merchantsPerPage, setMerchantsPerPage] = useState<number>(3); // Set to 3 for rows per page

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.195.49.17:5000/api/merchants');
      console.log('API Response:', response.data);

      if (Array.isArray(response.data.merchants)) {
        setMerchants(response.data.merchants);
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

  // Get recent merchants (sort by createdAt and limit to the latest)
  const recentMerchants = merchants
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5); // You can adjust this number if needed

  const indexOfLastMerchant = currentPage * merchantsPerPage;
  const indexOfFirstMerchant = indexOfLastMerchant - merchantsPerPage;
  const currentMerchantPage = recentMerchants.slice(indexOfFirstMerchant, indexOfLastMerchant);
  const totalPages = Math.ceil(recentMerchants.length / merchantsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric',
      hour12: true 
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="font-bold text-black text-xl mb-4">Recently Registered Merchants</h3>
      {loading && <p>Loading merchants...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto" id="merchantTable">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-[#FFA500] text-white">
            <tr>
              <th className="border px-4 py-2">Merchant Account</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">City</th>
              <th className="border px-4 py-2">Postal Code</th>
              <th className="border px-4 py-2">Tax ID</th>
              <th className="border px-4 py-2">Country</th>
              <th className="border px-4 py-2">Registration Time</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentMerchantPage.map((merchant, index) => (
              <tr key={merchant.id} className={`border-b ${index % 2 === 0 ? "bg-[#EAF4FF] text-black" : "bg-[#A4D1FF]"}`}>
                <td className="border px-4 py-2">{merchant.merchant_account}</td>
                <td className="border px-4 py-2">{merchant.merchant_category}</td>
                <td className="border px-4 py-2">{merchant.merchant_city}</td>
                <td className="border px-4 py-2">{merchant.postal_code}</td>
                <td className="border px-4 py-2">{merchant.tax_id}</td>
                <td className="border px-4 py-2">{merchant.country}</td>
                <td className="border px-4 py-2">{formatDate(merchant.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewMerchant;