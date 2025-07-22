import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-blue-600 text-9xl">404</h1>
        <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 dark:text-white md:text-3xl">
          <span className="text-red-500">Oops!</span> Page not found
        </h6>
        <p className="mb-8 text-center text-gray-500 md:text-lg">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full"
        >
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;