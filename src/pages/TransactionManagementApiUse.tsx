import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import { jsPDF } from 'jspdf';

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
    branchId: string; // The branch ID for which transactions are managed
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
    const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Fetch transactions from the API endpoint
                // Uncomment and replace with your actual API endpoint when ready
                // const response = await axios.get(`http://localhost:5000/branches/${branchId}/transactions`);
                // setTransactions(response.data); // Set the fetched transactions to state
                // setFilteredTransactions(response.data); // Initialize filtered transactions
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions(); // Call the fetch function when component mounts
    }, [branchId]);

    const filterTransactions = () => {
        let filtered = transactions;

        // Date filtering
        if (startDate && endDate) {
            filtered = filtered.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
            });
        } else {
            const today = new Date();
            if (viewType === 'daily') {
                const todayStr = today.toISOString().split('T')[0];
                filtered = filtered.filter(transaction => transaction.date.startsWith(todayStr));
            } else if (viewType === 'weekly') {
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                filtered = filtered.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
                });
            } else if (viewType === 'monthly') {
                const currentMonth = today.toISOString().slice(0, 7);
                filtered = filtered.filter(transaction => transaction.date.startsWith(currentMonth));
            } else if (viewType === 'yearly') {
                const currentYear = today.getFullYear();
                filtered = filtered.filter(transaction => transaction.date.startsWith(currentYear.toString()));
            }
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

    const handleAddTransaction = async () => {
        try {
            // Send POST request to add a new transaction
            // Uncomment and replace with your actual API endpoint when ready
            // const response = await axios.post(`http://localhost:5000/branches/${branchId}/transactions`, {
            //     ...newTransaction,
            //     date: new Date().toISOString(), // Include current date
            // });
            // Update state with the newly added transaction
            // setTransactions([...transactions, response.data]);
            // setFilteredTransactions([...filteredTransactions, response.data]);
            // Reset newTransaction state
            setNewTransaction({
                amount: 0,
                description: '',
                accountNumber: '',
                name: '',
                merchantCategory: '',
                status: 'pending',
            });
        } catch (error) {
            console.error('Error adding transaction:', error); // Handle error
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        try {
            // Send DELETE request to remove a transaction
            // Uncomment and replace with your actual API endpoint when ready
            // await axios.delete(`http://localhost:5000/branches/${branchId}/transactions/${id}`);
            // Update state after deletion
            setTransactions(transactions.filter(transaction => transaction.id !== id));
            setFilteredTransactions(filteredTransactions.filter(transaction => transaction.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error); // Handle error
        }
    };

    const handleScan = (data: string | null) => {
        if (data) {
            const parsedData = JSON.parse(data);
            setNewTransaction({
                amount: parsedData.amount,
                description: parsedData.description,
                accountNumber: parsedData.accountNumber,
                name: parsedData.name,
                merchantCategory: parsedData.merchantCategory,
                status: 'pending',
            });
            handleAddTransaction(); // Automatically add transaction after scanning
        }
    };

    const handleError = (err: any) => {
        console.error(err); // Log any scanning errors
    };

    const updateTransactionStatus = (id: string, status: 'approved' | 'pending' | 'declined') => {
        setTransactions(transactions.map(transaction => 
            transaction.id === id ? { ...transaction, status } : transaction
        ));
        setFilteredTransactions(filteredTransactions.map(transaction => 
            transaction.id === id ? { ...transaction, status } : transaction
        ));
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Transactions</title>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            td { border: 1px solid #ddd; padding: 8px; }
                            h2 { text-align: center; }
                            img { display: block; margin: 0 auto; max-width: 150px; }
                            th { background-color: #FFA500; color: white; }
                        </style>
                    </head>
                    <body>
                        <div class="printable">
                            <img src="src/images/logo/welogo.png" alt="Logo" />
                            <h2>Transaction Report - ${viewType.charAt(0).toUpperCase() + viewType.slice(1)}</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Account Number</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${filteredTransactions.map(transaction => `
                                        <tr>
                                            <td>${new Date(transaction.date).toLocaleDateString()}</td>
                                            <td>${transaction.description}</td>
                                            <td>${transaction.amount}</td>
                                            <td>${transaction.accountNumber}</td>
                                            <td>${transaction.name}</td>
                                            <td>${transaction.merchantCategory}</td>
                                            <td>${transaction.status}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        } else {
            console.error("Failed to open print window.");
        }
    };

    const handleDownload = () => {
        const pdf = new jsPDF();
        pdf.text("Transaction Report", 10, 10);
        pdf.autoTable({ html: '#transactionTable' });
        pdf.save('transactions-report.pdf');
    };

    // Calculate the index of the last transaction on the current page
    const indexOfLastTransaction = currentPage * rowsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    // Calculate total pages
    const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

    if (loading) return <div>Loading...</div>; // Display loading state

    return (
        <div className="container mx-auto p-5 bg-white">
            <div className="printable">
                <div className="mb-4 text-center">
                    <img src='src/images/logo/welogo.png' alt="Logo" className="max-width: 150px; margin: 0 auto;" />
                    <h2 className="text-2xl font-bold">
                        Transaction Report - {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                    </h2>
                </div>

                <div className="flex mb-4">
                    <label className="mr-2">From:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded p-2 mr-2"
                    />
                    <label className="mr-2">To:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded p-2 mr-2"
                    />
                    <button
                        onClick={filterTransactions}
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    >
                        Show
                    </button>
                </div>

                <div className="mb-4 flex items-center">
                    <label className="mr-2">Search:</label>
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
                    <label className="mr-2">View:</label>
                    <select
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
                        className="border rounded p-2 mr-2"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <button onClick={handlePrint} className="bg-gray-500 text-white rounded p-2 hover:bg-gray-600 mr-2">
                        Print
                    </button>
                    <button onClick={handleDownload} className="bg-indigo-500 text-white rounded p-2 hover:bg-indigo-600">
                        Download Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table id="transactionTable" className="min-w-full border border-shadow shadow-lg">
                        <thead className="bg-[#FFA500]">
                            <tr>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Date</th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Description</th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Amount</th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Account Number</th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Name</th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Category</th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Status</th>
                                <th className="border border-gray-400 px-4 py-2 text-white font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((transaction, index) => {
                                const isOdd = index % 2 !== 0;
                                const rowClass = isOdd ? "bg-[#EAF4FF] text-black" : "bg-[#A4D1FF]";

                                return (
                                    <tr key={transaction.id} className={rowClass}>
                                        <td className="px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{transaction.description}</td>
                                        <td className="px-4 py-2">${transaction.amount}</td>
                                        <td className="px-4 py-2">{transaction.accountNumber}</td>
                                        <td className="px-4 py-2">{transaction.name}</td>
                                        <td className="px-4 py-2">{transaction.merchantCategory}</td>
                                        <td className="px-4 py-2">
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
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="bg-gray-500 text-white rounded p-2 hover:bg-gray-600"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="bg-gray-500 text-white rounded p-2 hover:bg-gray-600"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

                <h3 className="text-xl font-bold mt-6 mb-2">Add New Transaction</h3>
                <div className="mb-4">
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                        className="border rounded p-2 mr-2 w-1/5"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        className="border rounded p-2 mr-2 w-1/5"
                    />
                    <input
                        type="text"
                        placeholder="Account Number"
                        value={newTransaction.accountNumber}
                        onChange={(e) => setNewTransaction({ ...newTransaction, accountNumber: e.target.value })}
                        className="border rounded p-2 mr-2 w-1/5"
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={newTransaction.name}
                        onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                        className="border rounded p-2 mr-2 w-1/5"
                    />
                    <input
                        type="text"
                        placeholder="Merchant Category"
                        value={newTransaction.merchantCategory}
                        onChange={(e) => setNewTransaction({ ...newTransaction, merchantCategory: e.target.value })}
                        className="border rounded p-2 mr-2 w-1/5"
                    />
                    <button
                        onClick={handleAddTransaction}
                        className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
                    >
                        Add Transaction
                    </button>
                </div>

                <h3 className="text-xl font-bold mt-6 mb-2">Scan QR Code</h3>
                <QrReader
                    onScan={handleScan}
                    onError={handleError}
                    style={{ width: '100%' }}
                />
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