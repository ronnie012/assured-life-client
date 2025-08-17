import React from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useAuth } from '../../../contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';

const ClaimRequestForm = () => {
  const { user, firebaseUser, axiosPublic } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch user's approved policies to allow claim submission
  const { data: approvedPolicies, isLoading: isLoadingPolicies, isError: isErrorPolicies } = useQuery({
    queryKey: ['approvedPoliciesForClaim', firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser?.uid) return [];
      const response = await axiosPublic.get('/applications/my-applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Filter for approved and paid policies only
      return response.data.filter(app => app.status?.toLowerCase() === 'approved' && app.paymentStatus?.toLowerCase() === 'paid');
    },
    enabled: !!firebaseUser?.uid,
  });

  // Fetch user's existing claims
  const { data: userClaims, isLoading: isLoadingClaims, isError: isErrorClaims } = useQuery({
    queryKey: ['userClaims', firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser?.uid) return [];
      const response = await axiosPublic.get('/claims/my-claims', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    },
    enabled: !!firebaseUser?.uid,
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
      Swal.fire({
        icon: 'success',
        title: 'Claim Submitted!',
        text: response.data.message,
        showConfirmButton: false,
        timer: 3000
      });
      reset();
    } catch (error) {
      console.error('Claim submission failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Claim submission failed.');
    }
  };

  if (isLoadingPolicies || isLoadingClaims) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isErrorPolicies || isErrorClaims) return <div className="text-center mt-10 text-red-600">Error loading data for claim.</div>;

  // Commented_to_visualize_the_claim_request_form_in_customer_dashboard_when_no_approved_policies_found_to_claim_against.
  // Removed this early return and instead relied on the logic already present within the <tbody> to display the "No approved policies found" message inside a table row.
  
  // if (!isLoadingPolicies && approvedPolicies && approvedPolicies.length === 0) {
  //   return <div className="text-center mt-10 text-gray-600">No approved policies found to claim against.</div>;
  // }

  return (
    <div className="">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Claim Request Form</h1>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:border dark:border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="policyId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Policy for Claim</label>
            <select id="policyId" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('policyId', { required: 'Policy selection is required' })}>
              <option value="">-- Select an Approved Policy --</option>
              {approvedPolicies && approvedPolicies.length > 0 ? (
                approvedPolicies.map(policy => {
                  const hasPendingClaim = userClaims?.some(claim => claim.policyId === policy.policyInfo._id && claim.status === 'Pending');
                  return (
                    <option key={policy._id} value={policy.policyInfo._id} disabled={hasPendingClaim}>
                      {policy.policyName} {hasPendingClaim && '(Claim Pending)'}
                    </option>
                  );
                })
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
            <input type="file" id="documents" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 file:dark:text-white file:dark:bg-gray-600 file:dark:border-gray-600" {...register('documents')} multiple />
          </div>

          <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full">
            Submit Claim
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimRequestForm;