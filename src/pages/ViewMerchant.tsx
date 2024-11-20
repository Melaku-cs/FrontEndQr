import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Merchant {
  id: string;
  merchant_account: string;
  merchant_category: string;
  merchant_city: string;
  postal_code: string;
  tax_id: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

const ViewMerchant: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');  // State for success messages
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [merchantsPerPage, setMerchantsPerPage] = useState<number>(5);
  const [editMerchant, setEditMerchant] = useState<Merchant | null>(null);
  const [formData, setFormData] = useState<Partial<Merchant>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<string>('merchant_account');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const countryOptions = ["USA", "Canada", "Mexico"];
  const categoryOptions = ["Retail", "Wholesale", "Service"];

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this merchant?')) {
      try {
        await axios.delete(`http://10.195.49.17:5000/api/merchants/${id}`);
        setMerchants(prevMerchants => prevMerchants.filter(merchant => merchant.id !== id));
        setSuccessMessage('Merchant deleted successfully!');  // Set success message
        clearSuccessMessage(); // Clear message after a timeout
      } catch (err) {
        console.error('Error deleting merchant:', err);
        setError('Failed to delete merchant. Please try again later.');
      }
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editMerchant) return;

    const updatedMerchant: Merchant = {
      ...editMerchant,
      ...formData,
    };

    try {
      const response = await axios.put(`http://10.195.49.17:5000/api/merchants/${id}`, updatedMerchant);
      setMerchants(prevMerchants => prevMerchants.map(merchant => (merchant.id === id ? response.data : merchant)));
      setSuccessMessage('Merchant updated successfully!');  // Set success message
      clearSuccessMessage(); // Clear message after a timeout
    } catch (err) {
      console.error('Error updating merchant:', err);
      setError('Failed to update merchant. Please try again later.');
    } finally {
      setEditMerchant(null);
      setFormData({});
    }
  };

  const clearSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // Clear after 3 seconds
  };

  const indexOfLastMerchant = currentPage * merchantsPerPage;
  const indexOfFirstMerchant = indexOfLastMerchant - merchantsPerPage;

  // Enhanced Search Logic
  const filteredMerchants = merchants.filter(merchant => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      merchant.merchant_account?.toLowerCase().includes(lowerCaseSearchTerm) ||
      merchant.merchant_category?.toLowerCase().includes(lowerCaseSearchTerm) ||
      merchant.merchant_city?.toLowerCase().includes(lowerCaseSearchTerm) ||
      merchant.postal_code?.toLowerCase().includes(lowerCaseSearchTerm) ||
      merchant.tax_id?.toLowerCase().includes(lowerCaseSearchTerm) ||
      merchant.country?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  // Sorting Logic
  const sortedMerchants = filteredMerchants.sort((a, b) => {
    const aValue = a[sortField as keyof Merchant];
    const bValue = b[sortField as keyof Merchant];
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const currentMerchants = sortedMerchants.slice(indexOfFirstMerchant, indexOfLastMerchant);
  const totalPages = Math.ceil(filteredMerchants.length / merchantsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Merchant Account,Category,City,Postal Code,Tax ID,Country"].concat(
        filteredMerchants.map(merchant => 
          `${merchant.merchant_account},${merchant.merchant_category},${merchant.merchant_city},${merchant.postal_code},${merchant.tax_id},${merchant.country}`
        )
      ).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "merchants.csv");
    document.body.appendChild(link);

    link.click();
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h3 className="font-bold text-black text-xl mb-4">Registered Merchants</h3>
      
      {loading && <p>Loading merchants...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}  {/* Display success message */}
      
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search by Merchant Account, Category, City..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <div>
          <button onClick={handlePrint} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Print</button>
          <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">Download CSV</button>
        </div>
      </div>

      <div className="mb-4">
        <p>Total Merchants: <strong>{filteredMerchants.length}</strong></p>
      </div>

      <div className="mb-4 flex justify-between">
        <div>
          <label htmlFor="merchantsPerPage" className="mr-2 text-black">Merchants per page:</label>
          <select
            id="merchantsPerPage"
            value={merchantsPerPage}
            onChange={(e) => {
              setMerchantsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto" id="merchantTable">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-[#FFA500] text-white">
            <tr>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('merchant_account')}>Merchant Account</th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('merchant_category')}>Category</th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('merchant_city')}>City</th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('postal_code')}>Postal Code</th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('tax_id')}>Tax ID</th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('country')}>Country</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentMerchants.map((merchant, index) => (
              <tr key={merchant.id} className={`border-b ${index % 2 === 0 ? "bg-[#EAF4FF] text-black" : "bg-[#A4D1FF]"}`}>
                <td className="border px-4 py-2">{merchant.merchant_account}</td>
                <td className="border px-4 py-2">{merchant.merchant_category}</td>
                <td className="border px-4 py-2">{merchant.merchant_city}</td>
                <td className="border px-4 py-2">{merchant.postal_code}</td>
                <td className="border px-4 py-2">{merchant.tax_id}</td>
                <td className="border px-4 py-2">{merchant.country}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      setEditMerchant(merchant);
                      setFormData(merchant);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(merchant.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
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

      {editMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded p-4 w-1/3">
            <h4 className="font-bold">Update Merchant</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editMerchant.id);
            }}>
              <div className="mb-2">
                <label>Merchant Account:</label>
                <input
                  type="text"
                  value={formData.merchant_account ?? ''}
                  onChange={(e) => setFormData({ ...formData, merchant_account: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Category:</label>
                <select
                  value={formData.merchant_category ?? ''}
                  onChange={(e) => setFormData({ ...formData, merchant_category: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label>City:</label>
                <input
                  type="text"
                  value={formData.merchant_city ?? ''}
                  onChange={(e) => setFormData({ ...formData, merchant_city: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Postal Code:</label>
                <input
                  type="text"
                  value={formData.postal_code ?? ''}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Tax ID:</label>
                <input
                  type="text"
                  value={formData.tax_id ?? ''}
                  onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label>Country:</label>
                <select
                  value={formData.country ?? ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
                <button type="button" onClick={() => setEditMerchant(null)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMerchant;