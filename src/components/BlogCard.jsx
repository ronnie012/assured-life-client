import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  // Function to truncate content to a specific word count
  const truncateContent = (content, wordLimit) => {
    const words = content.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return content;
  };

  return (
    <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div>
        <img src={blog.blogImage || 'https://via.placeholder.com/300'} alt={blog.title} className="w-full h-40 object-cover rounded-t-lg mb-3" />
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {blog.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 my-2">
          {truncateContent(blog.content, 15)} 
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          <p>
            By <span className="font-semibold bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{blog.author}</span>
          </p>
          <p>{new Date(blog.publishDate).toLocaleDateString()}</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <p>Total Visits: <span className="font-semibold">{blog.totalVisit || 0}</span></p>
        </div>
      </div>
      <Link to={`/blog/${blog._id}`} className="inline-flex items-center px-3 py-2 mt-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-start">
        Read more
      </Link>
    </div>
  );
};

export default BlogCard;
