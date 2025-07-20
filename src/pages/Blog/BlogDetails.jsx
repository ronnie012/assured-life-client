import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const BlogDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await axiosPublic.get(`/blogs/${id}`);
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
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading blog post.</div>;
  if (!blog) return <div className="text-center mt-10">Blog post not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        {blog.blogImage && (
          <img src={blog.blogImage} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        )}
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{blog.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          By <span className="font-semibold">{blog.author}</span> on {new Date(blog.publishDate).toLocaleDateString()}
        </p>
        <p className="text-gray-700 dark:text-gray-200 mb-6">{blog.content}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Views: {blog.totalVisit}</p>
      </div>
    </div>
  );
};

export default BlogDetails;
