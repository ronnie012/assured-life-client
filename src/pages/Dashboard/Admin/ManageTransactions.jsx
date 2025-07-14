import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';


const ManageTransactions = () => {
  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5000/api/v1/transactions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    },
  });

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading transactions.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Manage Transactions</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Transaction ID</th>
              <th scope="col" className="px-6 py-3">User Email</th>
              <th scope="col" className="px-6 py-3">Policy Name</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {transaction.transactionId}
                </th>
                <td className="px-6 py-4">{transaction.userEmail}</td>
                <td className="px-6 py-4">{transaction.policyName}</td>
                <td className="px-6 py-4">{transaction.amount} {transaction.currency}</td>
                <td className="px-6 py-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTransactions;
