import React from 'react';
import { useNavigate } from 'react-router-dom';

const PolicyCard = ({ policy }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    console.log('Navigating to policy details with ID:', policy._id);
    navigate(`/policies/${policy._id}`);
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img src={policy.policyImage || "https://images.pexels.com/photos/3059747/pexels-photo-3059747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} alt={policy.title} className="w-full h-48 object-cover rounded-t-lg" />
      <div className="p-5">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          {policy.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 mb-1">
          <span className="font-semibold">Coverage:</span> {policy.coverageRange}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400 mb-1">
          <span className="font-semibold">Term:</span> {policy.durationOptions}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400 mb-4">
          <span className="font-semibold">Popularity:</span> {policy.purchaseCount}
        </p>
        <button onClick={handleViewDetails} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          View Details
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;
