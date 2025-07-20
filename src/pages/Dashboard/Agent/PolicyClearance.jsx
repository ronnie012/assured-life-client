
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const PolicyClearance = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  const { data: claims, isLoading, isError } = useQuery({
    queryKey: ['claims'],
    queryFn: async () => {
      const response = await axiosPublic.get('/claims', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    },
  });

  const approveClaimMutation = useMutation({
    mutationFn: async (claimId) => {
      await axiosPublic.put(`/claims/${claimId}/status`, { status: 'Approved' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['claims']);
      Swal.fire({
        icon: 'success',
        title: 'Claim Approved!',
        text: 'The claim has been successfully approved.',
        showConfirmButton: false,
        timer: 1500
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve claim.');
    },
  });

  const handleApproveClaim = (claimId) => {
    if (window.confirm('Are you sure you want to approve this claim?')) {
      approveClaimMutation.mutate(claimId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Policy Clearance</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading claims.</div>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Policy Name</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">{claim.policyName}</td>
                  <td className="px-6 py-4">{claim.policyAmount}</td>
                  <td className="px-6 py-4">{claim.status}</td>
                  <td className="px-6 py-4">
                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Details</button>
                    {claim.status === 'Pending' && (
                      <button
                        className="ml-2 font-medium text-green-600 dark:text-green-500 hover:underline"
                        onClick={() => handleApproveClaim(claim._id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PolicyClearance;
