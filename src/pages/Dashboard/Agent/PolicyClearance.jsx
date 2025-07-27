
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const PolicyClearance = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

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
        timer: 3000
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve claim.');
    },
  });

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setShowDetailsModal(true);
  };

  const handleApproveClaim = (claimId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this claim?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        approveClaimMutation.mutate(claimId);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <h1 className="text-4xl font-bold text-center mb-4">Policy Clearance</h1>
      {isLoading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : isError ? (
        <div className="text-center mt-10 text-red-600">Error loading claims.</div>
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
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-white font-medium ${claim.status === 'Approved' ? 'bg-green-500' : claim.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(claim)}
                      className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      View Details
                    </button>
                    {claim.status === 'Pending' && (
                      <button
                        className="ml-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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

      {/* View Details Modal */}
      {showDetailsModal && selectedClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                  Claim Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              <div className="p-6 space-y-6 text-gray-900 dark:text-white">
                <p><strong>Policy Name:</strong> {selectedClaim.policyName}</p>
                <p><strong>Amount:</strong> {selectedClaim.policyAmount}</p>
                <p><strong>Reason:</strong> {selectedClaim.reason}</p>
                <p><strong>Status:</strong> {selectedClaim.status}</p>
                <p><strong>Submitted At:</strong> {new Date(selectedClaim.submittedAt).toLocaleString()}</p>
                {selectedClaim.documents && selectedClaim.documents.length > 0 && (
                  <div>
                    <strong>Documents:</strong>
                    <ul>
                      {selectedClaim.documents.map((doc, index) => (
                        <li key={index}><a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Document {index + 1}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Add more details as needed */}
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyClearance;
