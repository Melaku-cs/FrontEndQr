import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

interface Transaction {
    id: string;
    amount: number;
    description: string;
    date: string;
    accountNumber: string;
    name: string;
    merchantCategory: string;
    status: 'approved' | 'pending' | 'declined';
}

interface TransactionManagerProps {
    branchId: string;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({ branchId }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTransaction, setNewTransaction] = useState<{
        amount: number;
        description: string;
        accountNumber: string;
        name: string;
        merchantCategory: string;
        mobileNumber?: string;
        status: 'approved' | 'pending' | 'declined';
    }>({
        amount: 0,
        description: '',
        accountNumber: '',
        name: '',
        merchantCategory: '',
        status: 'pending',
    });

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page can be set to 10
    const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Example transaction data for testing
                const exampleTransactions: Transaction[] = Array.from({ length: 40 }, (_, index) => ({
                    id: `${index + 1}`,
                    amount: parseFloat((Math.random() * 1000).toFixed(2)),
                    description: `Transaction ${index + 1}`,
                    date: `2024-11-${String(index % 30 + 1).padStart(2, '0')}T12:00:00Z`,
                    accountNumber: `12345${index}`,
                    name: `Customer ${index + 1}`,
                    merchantCategory: 'General',
                    status: index % 3 === 0 ? 'approved' : index % 3 === 1 ? 'pending' : 'declined',
                }));

                setTransactions(exampleTransactions);
                setFilteredTransactions(exampleTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [branchId]);

    const filterTransactions = () => {
        let filtered = transactions;

        // Date filtering
        if (startDate && endDate) {
            filtered = filtered.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
            });
        }

        // Search filtering
        if (searchTerm) {
            filtered = filtered.filter(transaction =>
                transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.accountNumber.includes(searchTerm) ||
                transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.merchantCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleSort = (key: keyof Transaction) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
    
        setSortConfig({ key, direction });
    
        const sortedTransactions = [...filteredTransactions].sort((a, b) => {
            if (key === 'amount' || key === 'date') {
                return direction === 'ascending' 
                    ? (key === 'amount' ? a.amount - b.amount : new Date(a.date).getTime() - new Date(b.date).getTime())
                    : (key === 'amount' ? b.amount - a.amount : new Date(b.date).getTime() - new Date(a.date).getTime());
            }
            if (typeof a[key] === 'string') {
                return direction === 'ascending' 
                    ? a[key].localeCompare(b[key]) 
                    : b[key].localeCompare(a[key]);
            }
            return 0;
        });
    
        setFilteredTransactions(sortedTransactions);
    };
    const handleAddTransaction = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/branches/${branchId}/transactions`, {
                ...newTransaction,
                date: new Date().toISOString(),
            });
            setTransactions([...transactions, response.data]);
            setFilteredTransactions([...filteredTransactions, response.data]);
            setNewTransaction({
                amount: 0,
                description: '',
                accountNumber: '',
                name: '',
                merchantCategory: '',
                status: 'pending',
            });
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/branches/${branchId}/transactions/${id}`);
            setTransactions(transactions.filter(transaction => transaction.id !== id));
            setFilteredTransactions(filteredTransactions.filter(transaction => transaction.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const updateTransactionStatus = (id: string, status: 'approved' | 'pending' | 'declined') => {
        setTransactions(transactions.map(transaction => 
            transaction.id === id ? { ...transaction, status } : transaction
        ));
        setFilteredTransactions(filteredTransactions.map(transaction => 
            transaction.id === id ? { ...transaction, status } : transaction
        ));
    };

    // Calculate the index of the last transaction on the current page
    const indexOfLastTransaction = currentPage * rowsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  
    // Calculate total pages
    const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-5 bg-gradient-to-r from-white to-gray-200">
            <div className="printable">
                <div className="mb-4 text-center">
                  
                    <h2 className="text-2xl text-black font-bold">
                        Transaction Report
                    </h2>
                </div>

                <div className="flex mb-4">
                    <label className="mr-2 font-bold text-black">From:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded p-2 mr-2"
                    />
                    <label className="mr-2 font-bold text-black">To:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded p-2 mr-2"
                    />
                    <button
                        onClick={filterTransactions}
                        className="bg-blue-500 text-white rounded p-2 font-bold hover:bg-blue-600"
                    >
                        Show
                    </button>
                </div>

                <div className="mb-4 flex items-center">
                    <label className="mr-2 text-black font-bold">Search:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded p-2 mr-2"
                        placeholder="Search transactions..."
                    />
                    <button
                        onClick={filterTransactions}
                        className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
                    >
                        Search
                    </button>
                </div>

                <div className="mb-4">
    <label className="mr-2 text-black font-bold">Rows per page:</label>
    <select
        value={rowsPerPage}
        onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);  // Reset to first page when changing rows per page
        }}
        className="border rounded p-2"
    >
        {Array.from({ length: 40 }, (_, index) => (
            <option key={index + 1} value={index + 1}>{index + 1}</option>
        ))}
    </select>
</div>

                <div className="overflow-x-auto">
                    <table id="transactionTable" className="min-w-full border border-shadow shadow-lg">
                        <thead className="bg-[#FFA500]">
                            <tr>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold cursor-pointer" onClick={() => handleSort('date')}>
                                    Date
                                    {sortConfig.key === 'date' ? (
                                        sortConfig.direction === 'ascending' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                    ) : <FaSortUp className="inline ml-1" />}
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold cursor-pointer" onClick={() => handleSort('description')}>
                                    Description
                                    {sortConfig.key === 'description' ? (
                                        sortConfig.direction === 'ascending' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                    ) : <FaSortUp className="inline ml-1" />}
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold cursor-pointer" onClick={() => handleSort('amount')}>
                                    Amount
                                    {sortConfig.key === 'amount' ? (
                                        sortConfig.direction === 'ascending' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                    ) : <FaSortUp className="inline ml-1" />}
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold cursor-pointer" onClick={() => handleSort('accountNumber')}>
                                    Account Number
                                    {sortConfig.key === 'accountNumber' ? (
                                        sortConfig.direction === 'ascending' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                    ) : <FaSortUp className="inline ml-1" />}
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold cursor-pointer" onClick={() => handleSort('name')}>
                                    Name
                                    {sortConfig.key === 'name' ? (
                                        sortConfig.direction === 'ascending' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                    ) : <FaSortUp className="inline ml-1" />}
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold cursor-pointer" onClick={() => handleSort('merchantCategory')}>
                                    Category
                                    {sortConfig.key === 'merchantCategory' ? (
                                        sortConfig.direction === 'ascending' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                    ) : <FaSortUp className="inline ml-1" />}
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold cursor-pointer" onClick={() => handleSort('status')}>
                                    Status
                                    {sortConfig.key === 'status' ? (
                                        sortConfig.direction === 'ascending' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                    ) : <FaSortUp className="inline ml-1" />}
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((transaction, index) => {
                                const isOdd = index % 2 !== 0;
                                const rowClass = isOdd ? "bg-[#EAF4FF] text-black" : "bg-[#A4D1FF]";

                                return (
                                    <tr key={transaction.id} className={rowClass}>
                                        <td className="px-4 py-2 text-black">{new Date(transaction.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 text-black">{transaction.description}</td>
                                        <td className="px-4 py-2 text-black">${transaction.amount}</td>
                                        <td className="px-4 py-2 text-black">{transaction.accountNumber}</td>
                                        <td className="px-4 py-2 text-black">{transaction.name}</td>
                                        <td className="px-4 py-2 text-black">{transaction.merchantCategory}</td>
                                        <td className="px-4 py-2 text-black">
                                            <span className={`font-bold ${transaction.status === 'approved' ? 'text-green-500' : transaction.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button onClick={() => updateTransactionStatus(transaction.id, 'approved')} className="bg-green-500 text-white rounded px-2 py-1 text-xs hover:bg-green-600 transition duration-200">Approve</button>
                                            <button onClick={() => updateTransactionStatus(transaction.id, 'pending')} className="bg-blue-500 text-white rounded px-2 py-1 text-xs hover:bg-blue-600 transition duration-200 ml-2">Pending</button>
                                            <button onClick={() => updateTransactionStatus(transaction.id, 'declined')} className="bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600 transition duration-200 ml-2">Decline</button>
                                            <button onClick={() => handleDeleteTransaction(transaction.id)} className="ml-2 text-red-500 hover:text-red-700 text-xs">Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="w-full flex justify-end">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="bg-gray-500 text-white rounded p-2 hover:bg-gray-600"
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="mx-2">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="bg-gray-500 text-white rounded p-2 hover:bg-gray-600"
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                @media print {
                    body * {
                        display: none !important;
                    }
                    .printable, .printable * {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default TransactionManager;