import React from 'react';

import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {blog.title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {blog.content.substring(0, 100)}...
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
        By {blog.author} on {new Date(blog.publishDate).toLocaleDateString()}
      </p>
      <Link to={`/blog/${blog._id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Read more
      </Link>
    </div>
  );
};

export default BlogCard;
