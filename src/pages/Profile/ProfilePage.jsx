import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../contexts/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ProfilePage = () => {
  const { user, axiosPublic, setUser, refreshUser, firebaseUser } = useAuth();
  console.log("ProfilePage - current user:", user);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: profileData, isLoading, isError, refetch } = useQuery({
    queryKey: ['userProfile', firebaseUser?.uid],
    queryFn: async () => {
      console.log("ProfilePage - useQuery queryFn: Current firebaseUser object:", firebaseUser);
      if (!firebaseUser?.uid) {
        console.log("ProfilePage - firebaseUser.uid is null or undefined, skipping fetch.");
        return null;
      }
      console.log("ProfilePage - Fetching user profile for Firebase UID:", firebaseUser.uid, "with photoURL:", firebaseUser.photoURL, "and email:", firebaseUser.email);
      const response = await axiosPublic.get('/profile');
      console.log("ProfilePage - User profile fetched:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("ProfilePage - useQuery onSuccess: Resetting form with fetched data:", data);
      reset(data);
    },
    enabled: !!firebaseUser?.uid,
    staleTime: 0, // Data is always stale, forcing refetch on key change
    cacheTime: 0, // Data is immediately garbage collected after use
  });

  useEffect(() => {
    if (profileData) {
      console.log("ProfilePage - useEffect: Resetting form with profileData:", profileData);
      reset(profileData);
    }
  }, [profileData, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      console.log("Executing mutationFn with data:", updatedData);
      const response = await axiosPublic.put('/profile', updatedData);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data); // Optimistically update the user state
      queryClient.invalidateQueries(['userProfile']);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    },
  });

  const onSubmit = (data) => {
    console.log("Attempting to submit profile update with data:", data);
    updateProfileMutation.mutate(data);
  };

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading profile.</div>;
  if (!user?._id) return <div className="text-center mt-10 text-red-600">Please log in to view your profile.</div>;

  console.log("ProfilePage - Rendering with user:", user); // Added log
  console.log("ProfilePage - Rendering with profileData:", profileData); // Added log
  console.log("ProfilePage - Photo URL being used:", user?.photoURL || "https://flowbite.com/docs/images/people/profile-picture-5.jpg");

  return (
    <div class="container mx-auto px-4 py-2 dark:bg-gray-900">
      <h1 class="text-3xl font-bold text-center mb-4 dark:text-white">My Profile</h1>
      <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff`} alt="User Avatar" class="w-24 h-24 rounded-full mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold mb-2">{profileData?.name || 'N/A'}</h2>
        <p className="text-gray-600 mb-4">Email: {profileData?.email}</p>
        <p className="text-lg font-semibold text-blue-600 mb-6">Role: {profileData?.role}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
            <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('name')} />
          </div>
          <div>
            <label htmlFor="photoURL" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photo URL</label>
            <input type="text" id="photoURL" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('photoURL')} />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email (Non-editable)</label>
            <input type="email" id="email" value={profileData?.email} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </div>
          {profileData?.lastLogin && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Login</label>
              <input type="text" value={new Date(profileData.lastLogin).toLocaleString()} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
          )}
          <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
