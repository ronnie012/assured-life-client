import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthProvider';

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('ManageUsers: Attempting to fetch users.');
      const response = await axiosPublic.get('/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // console.log('ManageUsers: Received users data:', response.data);
      return response.data;
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      await axiosPublic.put(`/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User role updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user role.');
    },
  });

  const handleRoleChange = (userId, newRole) => {
    if (currentUser._id === userId) {
      toast.error('You cannot change your own role.');
      return;
    }
    updateUserRoleMutation.mutate({ id: userId, role: newRole });
  };

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading users.</div>;

  if (!isLoading && Array.isArray(users) && users.length === 0) {
    return <div className="text-center mt-10 text-gray-600">No users found.</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <h1 className="text-4xl font-bold text-center mb-4">Manage Users</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Registration Date</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map((user) => (
              <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.name || 'N/A'}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={currentUser._id === user._id}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${currentUser._id === user._id ? 'cursor-not-allowed' : ''}`}
                  >
                    <option value="customer">Customer</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4">
                  {/* Optional: Delete user button */}
                  <button type="button" className={`focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 ${ (String(currentUser._id) === String(user._id) || user.role === 'admin') ? 'opacity-50 cursor-not-allowed' : '' }`} disabled={String(currentUser._id) === String(user._id) || user.role === 'admin'}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;