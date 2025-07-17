import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import PolicyCard from '../../components/PolicyCard';


const AllPolicies = () => {
  const axiosPublic = useAxiosPublic();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allPolicies', currentPage, category, searchTerm],
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(`/policies?page=${currentPage}&limit=6&category=${category}&search=${searchTerm}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching policies:", error);
        throw error;
      }
    },
  });

  const policies = data?.policies || [];
  const totalPages = data?.totalPages || 1;

  const onPageChange = (page) => setCurrentPage(page);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  if (isLoading) return <div>Loading policies...</div>;
  if (isError) return <div>Error loading policies.</div>;

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">All Policies</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Search by policy title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <select value={category} onChange={handleCategoryChange} className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
          <option value="All" className="dark:bg-gray-700 dark:text-white">All Categories</option>
          <option value="Term Life" className="dark:bg-gray-700 dark:text-white">Term Life</option>
          <option value="Senior Plan" className="dark:bg-gray-700 dark:text-white">Senior Plan</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {policies.length > 0 ? (
          policies.map((policy) => (
            <PolicyCard key={policy._id} policy={policy} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">No policies found matching your criteria.</div>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-10 text-base">
            <li>
              <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button onClick={() => onPageChange(index + 1)} className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === index + 1 ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}>{index + 1}</button>
              </li>
            ))}
            <li>
              <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default AllPolicies;
