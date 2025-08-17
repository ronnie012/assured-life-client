import React from 'react';
import { FaSpinner } from 'react-icons/fa'; // Assuming react-icons/fa is available

const LoadingSpinner = ({ text = 'Loading...', size = '6xl' }) => { // Changed default size to 6xl
  return (
    <div className="flex flex-col items-center justify-center py-12 my-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <FaSpinner className={`animate-spin text-red-600 text-${size} mb-4`} /> {/* Changed text-red-500 to text-red-600 */}
      <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{text}</p> {/* Increased text size and boldness */}
    </div>
  );
};

export default LoadingSpinner;