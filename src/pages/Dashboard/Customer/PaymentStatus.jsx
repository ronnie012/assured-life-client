import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

import { useAuth } from '../../../contexts/AuthProvider';
import { Link } from 'react-router-dom';

const PaymentStatus = () => {
  const { user, firebaseUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  console.log('PaymentStatus - user:', user);
  console.log('PaymentStatus - user.uid:', user?.uid);

  const { data: applications, isLoading, isError, error } = useQuery({
    queryKey: ['myApplications', firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser?.uid) return [];
      const response = await axiosPublic.get('/applications/my-applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data.filter(app => app.status === 'Approved'); // Only show approved policies
    },
    enabled: !!firebaseUser?.uid, // Only run query if user ID is available
  });

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isError) {
    console.error('Error loading payment status:', error);
    return <div className="text-center mt-10 text-red-600">Error loading payment status. Please check console for details.</div>;
  }

  

  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <h1 className="text-4xl font-bold text-center mb-4">Payment Status</h1>

      <div className="relative overflow-x-auto shadow-xl sm:rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">Policy Name</th>
              <th scope="col" className="px-6 py-3">Premium Amount</th>
              <th scope="col" className="px-6 py-3">Payment Frequency</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications && applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {app.policyName}
                  </th>
                  <td className="px-6 py-4">{`$ ${app.quoteData?.estimatedPremium ? (app.quoteData.estimatedPremium).toFixed(2) : 'N/A'}`}</td>
                  <td className="px-6 py-4">Monthly</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-white font-medium ${app.paymentStatus === 'Paid' ? 'bg-green-500' : app.paymentStatus === 'Due' ? 'bg-orange-500' : 'bg-red-500'}`}>
                      {app.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {app.paymentStatus === 'Due' && (
                      <Link to={`/apply/payment/${app._id}`} className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 whitespace-normal min-w-[70px] text-center">Pay Now</Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No approved policies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentStatus;