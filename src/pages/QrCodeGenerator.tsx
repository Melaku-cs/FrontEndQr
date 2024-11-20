import React, { useState } from "react";
import QRcode from "react-qr-code";

const QrCodeGenerator = () => {
  const [merchantId, setMerchantId] = useState('');
  const [amount, setAmount] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [merchantAccount, setMerchantAccount] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [status, setStatus] = useState('daily');

  const handleGenerateQr = () => {
    if (merchantId && amount && merchantName && merchantAccount) {
      const qrData = {
        merchantId,
        merchantName,
        merchantAccount,
        amount
      };
      setQrValue(JSON.stringify(qrData));
      
      // Add to transaction history
      setTransactionHistory(prev => [
        ...prev,
        { merchantId, merchantName, amount, date: new Date().toLocaleString() }
      ]);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#FF8C00] rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-white">Generate QR Code for Payment</h2>
      <input
        type="text"
        placeholder="Items"
        value={merchantId}
        onChange={(e) => setMerchantId(e.target.value)}
        className="w-full p-3 mb-4 border border-orange rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Merchant Name"
        value={merchantName}
        onChange={(e) => setMerchantName(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Merchant Account"
        value={merchantAccount}
        onChange={(e) => setMerchantAccount(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleGenerateQr}
        className="inline-flex items-center justify-center rounded-full bg-[#333333] py-4 px-10 text-center font-medium text-[#FFFFFF] hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
        Generate QR Code
      </button>
   
      {qrValue && (
        <div className="mt-4 flex justify-center">
          <QRcode value={qrValue} size={128} />
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg text-[#FFFFFF] font-bold mb-2">Transaction History</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <ul className="list-disc pl-5">
          {transactionHistory.map((transaction, index) => (
            <li key={index} className=" text-white">
              {transaction.date} - {transaction.merchantName}: ${transaction.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QrCodeGenerator;