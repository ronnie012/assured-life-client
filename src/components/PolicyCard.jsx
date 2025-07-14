import React from 'react';

import { Link } from 'react-router-dom';

const PolicyCard = ({ policy }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img src={policy.policyImage || "https://via.placeholder.com/300x200"} alt={policy.title} className="rounded-t-lg" />
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {policy.title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Coverage: {policy.coverageRange}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Term: {policy.durationOptions}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Popularity: {policy.purchaseCount}
      </p>
      <Link to={`/policies/${policy._id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        View Details
      </Link>
    </div>
  );
};

export default PolicyCard;
