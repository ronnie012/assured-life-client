import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

import { useAuth } from '../../../contexts/AuthProvider';
import { Link } from 'react-router-dom';

const PaymentStatus = () => {
  const { user } = useAuth();

  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: ['myTransactions', user?._id],
    queryFn: async () => {
      if (!user?._id) return [];
      const response = await axiosPublic.get('/transactions/my-transactions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    },
    enabled: !!user?.userId, // Only run query if user ID is available
  });

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading payment status.</div>;

  if (!isLoading && transactions && transactions.length === 0) {
    return <div className="text-center mt-10 text-gray-600">No transactions found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Payment Status</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Policy Name</th>
              <th scope="col" className="px-6 py-3">Premium Amount</th>
              <th scope="col" className="px-6 py-3">Payment Frequency</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {transaction.policyName}
                  </th>
                  <td className="px-6 py-4">{transaction.amount} {transaction.currency}</td>
                  <td className="px-6 py-4">Monthly</td>
                  <td className="px-6 py-4">{transaction.status}</td>
                  <td className="px-6 py-4">
                    {transaction.status === 'Due' && (
                      <Link to={`/payment/${transaction.policyId}`} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Make Payment</Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentStatus;