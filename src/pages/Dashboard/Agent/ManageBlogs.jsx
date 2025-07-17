import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../contexts/AuthProvider';

const ManageBlogs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const axiosPublic = useAxiosPublic();

  const { data: blogs, isLoading, isError } = useQuery({
    queryKey: ['agentBlogs', user?.userId],
    queryFn: async () => {
      if (!user?.userId) return [];
      const response = await axiosPublic.get('/blogs/agent', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    },
    enabled: !!user?.userId, // Only run query if user ID is available
  });

  const createBlogMutation = useMutation({
    mutationFn: async (newBlog) => {
      await axiosPublic.post('/blogs', newBlog, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agentBlogs']);
      toast.success('Blog post created successfully!');
      setOpenModal(false);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create blog post.');
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async (updatedBlog) => {
      await axiosPublic.put(`/blogs/${updatedBlog._id}`, updatedBlog, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agentBlogs']);
      toast.success('Blog post updated successfully!');
      setOpenModal(false);
      reset();
      setSelectedBlog(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update blog post.');
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId) => {
      await axiosPublic.delete(`/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agentBlogs']);
      toast.success('Blog post deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete blog post.');
    },
  });

  const handleAddBlog = () => {
    setEditMode(false);
    setSelectedBlog(null);
    reset();
    setOpenModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditMode(true);
    setSelectedBlog(blog);
    reset(blog); // Pre-fill form with blog data
    setOpenModal(true);
  };

  const handleDeleteBlog = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogMutation.mutate(blogId);
    }
  };

  const onSubmit = (data) => {
    if (editMode) {
      updateBlogMutation.mutate({ ...data, _id: selectedBlog._id });
    } else {
      createBlogMutation.mutate(data);
    }
  };

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading blogs.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Manage Blogs</h1>

      <div className="flex justify-end mb-4">
        <button type="button" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleAddBlog}>Add New Blog</button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Author</th>
              <th scope="col" className="px-6 py-3">Publish Date</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(blogs) && blogs.map((blog) => (
              <tr key={blog._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {blog.title}
                </th>
                <td className="px-6 py-4">{blog.author}</td>
                <td className="px-6 py-4">{new Date(blog.publishDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button type="button" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => handleEditBlog(blog)}>Edit</button>
                  <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Blog Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                  {editMode ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setOpenModal(false)}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                    <input type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('title', { required: 'Title is required' })} />
                    {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                    <textarea id="content" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('content', { required: 'Content is required' })}></textarea>
                    {errors.content && <p className="text-red-500 text-xs italic mt-1">{errors.content.message}</p>}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                      {editMode ? 'Update Blog' : 'Publish Blog'}
                    </button>
                    <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => setOpenModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;