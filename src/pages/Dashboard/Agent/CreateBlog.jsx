import React from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthProvider';

const CreateBlog = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await axiosPublic.post('/blogs', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success(response.data.message);
      // Invalidate queries for both agent and admin views
      queryClient.invalidateQueries(['agentBlogs', user?.uid]);
      queryClient.invalidateQueries(['allBlogs', user?.uid]);
      reset();
      navigate('/admin/dashboard/manage-blogs'); // Navigate back to manage blogs after creation
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blog post.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Create New Blog Post</h1>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
            <input type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
            <textarea id="content" rows="10" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('content', { required: 'Content is required' })}></textarea>
            {errors.content && <p className="text-red-500 text-xs italic mt-1">{errors.content.message}</p>}
          </div>
          <div>
            <label htmlFor="blogImage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog Image URL</label>
            <input type="text" id="blogImage" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('blogImage')} />
          </div>
          <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full">
            Publish Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
