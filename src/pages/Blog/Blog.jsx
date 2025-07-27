import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import BlogCard from '../../components/BlogCard';

const Blog = () => {
  const axiosPublic = useAxiosPublic();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allBlogs', currentPage, searchTerm],
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(`/blogs?page=${currentPage}&search=${searchTerm}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
    },
  });

  const blogs = data?.blogs || [];
  const totalPages = data?.totalPages || 1;

  const onPageChange = (page) => setCurrentPage(page);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
      <p className="text-red-600 text-5xl font-bold mt-4">Loading blogs...</p>
    </div>
  );
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading blogs.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">All Blog Posts</h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search blogs by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">No blog posts found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Page navigation example" className="mt-8 flex justify-center">
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

export default Blog;