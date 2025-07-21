import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const ManageTransactions = () => {
  const axiosPublic = useAxiosPublic();

  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      console.log('ManageTransactions: Attempting to fetch transactions.');
      const response = await axiosPublic.get('/transactions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('ManageTransactions: Received transactions data:', response.data);
      return response.data;
    },
  });

  // Process data for the chart
  const processChartData = (transactions) => {
    const monthlyData = {};

    transactions.forEach(transaction => {
      if (transaction.status === 'succeeded' && transaction.createdAt) {
        const date = new Date(transaction.createdAt);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        monthlyData[monthYear] += transaction.amount;
      }
    });

    // Convert to array of objects for Recharts
    const chartData = Object.keys(monthlyData).map(key => ({
      month: key,
      totalAmount: monthlyData[key]
    }));

    // Sort by date (optional, but good for time series)
    chartData.sort((a, b) => new Date(a.month) - new Date(b.month));

    return chartData;
  };

  const chartData = processChartData(transactions);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Manage Transactions</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">Total Earnings Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}`}>
              <Label value="Total Amount" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip wrapperStyle={{ zIndex: 1000 }} />
            <Legend />
            <Bar dataKey="totalAmount" fill="#8884d8" name="Total Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-red-600">
                  Error loading transactions.
                </td>
              </tr>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {transaction.transactionId}
                  </th>
                  <td className="px-6 py-4">{transaction.userEmail}</td>
                  <td className="px-6 py-4">{transaction.policyName}</td>
                  <td className="px-6 py-4">{transaction.amount} {transaction.currency}</td>
                  <td className="px-6 py-4">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4">{transaction.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-600">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTransactions;