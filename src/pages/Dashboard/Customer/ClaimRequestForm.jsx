import React from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useAuth } from '../../../contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';

const ClaimRequestForm = () => {
  const { user, axiosPublic } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch user's approved policies to allow claim submission
  const { data: approvedPolicies, isLoading: isLoadingPolicies, isError: isErrorPolicies } = useQuery({
    queryKey: ['approvedPoliciesForClaim', user?._id],
    queryFn: async () => {
      if (!user?._id) return [];
      const response = await axiosPublic.get('/applications/my-applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Filter for approved policies only
      return response.data.filter(app => app.status === 'Approved');
    },
    enabled: !!user?.userId,
  });

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to submit a claim.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('policyId', data.policyId);
      formData.append('reason', data.reason);
      // Append files if any
      if (data.documents && data.documents.length > 0) {
        for (let i = 0; i < data.documents.length; i++) {
          formData.append('documents', data.documents[i]);
        }
      }

      const response = await axiosPublic.post('/claims', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success(response.data.message);
      reset();
    } catch (error) {
      console.error('Claim submission failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Claim submission failed.');
    }
  };

  if (isLoadingPolicies) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isErrorPolicies) return <div className="text-center mt-10 text-red-600">Error loading policies for claim.</div>;

  if (!isLoadingPolicies && approvedPolicies && approvedPolicies.length === 0) {
    return <div className="text-center mt-10 text-gray-600">No approved policies found to claim against.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Claim Request Form</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="policyId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Policy for Claim</label>
            <select id="policyId" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('policyId', { required: 'Policy selection is required' })}>
              <option value="">-- Select an Approved Policy --</option>
              {approvedPolicies && approvedPolicies.length > 0 ? (
                approvedPolicies.map(policy => (
                  <option key={policy._id} value={policy.policyInfo._id}>{policy.policyName}</option>
                ))
              ) : (
                <option value="" disabled>No approved policies available</option>
              )}
            </select>
            {errors.policyId && <p className="text-red-500 text-xs italic mt-1">{errors.policyId.message}</p>}
          </div>

          <div>
            <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reason for Claim</label>
            <textarea id="reason" rows="6" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('reason', { required: 'Reason for claim is required' })}></textarea>
            {errors.reason && <p className="text-red-500 text-xs italic mt-1">{errors.reason.message}</p>}
          </div>

          <div>
            <label htmlFor="documents" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Supporting Documents (Optional)</label>
            <input type="file" id="documents" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" {...register('documents')} multiple />
          </div>

          <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full">
            Publish Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimRequestForm;