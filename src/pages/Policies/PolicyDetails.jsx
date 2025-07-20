import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';


const PolicyDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  

  const { data: policy, isLoading, isError } = useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      console.log('PolicyDetails: Attempting to fetch policy from API:', `/policies/${id}`);
      const response = await axiosPublic.get(`/policies/${id}`);
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
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading policy details.</div>;
  if (!policy) return <div className="text-center mt-10">Policy not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{policy.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Category: {policy.category}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <img src={policy.policyImage || "https://via.placeholder.com/600x400"} alt={policy.title} className="rounded-lg shadow-md w-full" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Policy Overview</h2>
            <p className="text-gray-700 mb-4">{policy.description}</p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><span className="font-semibold">Eligibility:</span> Ages {policy.minAge} to {policy.maxAge}</li>
              <li><span className="font-semibold">Coverage Range:</span> {policy.coverageRange}</li>
              <li><span className="font-semibold">Term Duration Options:</span> {policy.durationOptions.replace(/,?\s*$/, '')}</li>
              <li><span className="font-semibold">Base Premium Rate:</span> ${policy.basePremiumRate}</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quote" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 w-full sm:w-auto">Get Quote</Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
