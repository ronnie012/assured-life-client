import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../contexts/AuthProvider';
import { jsPDF } from 'jspdf';

const MyPolicies = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedPolicyForReview, setSelectedPolicyForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: myApplications, isLoading, isError } = useQuery({
    queryKey: ['myApplications', user?._id],
    queryFn: async () => {
      if (!user?._id) return [];
      const response = await axiosPublic.get('/applications/my-applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('My Applications data:', response.data);
      return response.data;
    },
    enabled: !!user?._id, // Only run query if user ID is available
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      await axiosPublic.post('/reviews', reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customerReviews']); // Invalidate public reviews to show new one
      toast.success('Review submitted successfully!');
      setOpenReviewModal(false);
      setSelectedPolicyForReview(null);
      setReviewRating(0);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review.');
    },
  });

  const handleGiveReview = (application) => {
    setSelectedPolicyForReview(application);
    setOpenReviewModal(true);
  };

  const onSubmitReview = (data) => {
    if (!reviewRating) {
      toast.error('Please provide a star rating.');
      return;
    }
    if (!user) {
      toast.error('User information not available for review.');
      return;
    }

    const reviewData = {
      userId: user._id,
      userName: user.name || user.email,
      userImage: user.photoURL || '',
      rating: reviewRating,
      message: data.reviewMessage,
      policyId: selectedPolicyForReview?.policyInfo?._id,
    };
    submitReviewMutation.mutate(reviewData);
  };

  const handleDownloadPolicy = (application) => {
    try {
      const policy = application.policyInfo;
      const quote = application.quoteData;

      if (!policy || !quote) {
        toast.error('Policy details or quote not found.');
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(30).text('AssuredLife Policy Document', 40, 40);
      doc.setFontSize(18).text(`Policy: ${policy.title}`, 40, 60);
      doc.setFontSize(16).text(`Category: ${policy.category}`, 40, 70);

      doc.setFontSize(24).text('\nPolicy Holder Information:', 40, 90);
      doc.setFontSize(16).text(`Name: ${user.name || user.email}`, 40, 110);
      doc.setFontSize(16).text(`Email: ${user.email}`, 40, 120);
      doc.setFontSize(16).text(`NID/SSN: ${application.personalData.nidSsn || 'N/A'}`, 40, 130);
      doc.setFontSize(16).text(`Address: ${application.personalData.address || 'N/A'}`, 40, 140);

      doc.setFontSize(24).text('\nCoverage Details:', 40, 160);
      doc.setFontSize(16).text(`Coverage Amount: $ ${quote.coverageAmount || 'N/A'}`, 40, 180);
      doc.setFontSize(16).text(`Term Duration: ${quote.duration || 'N/A'} years`, 40, 190);
      doc.setFontSize(16).text(`Premium: $ ${quote.estimatedPremium || 'N/A'} per month`, 40, 200);

      doc.save(`AssuredLife_${user.name || user.email}_${policy.title}.pdf`);
      toast.success('Policy PDF downloaded!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate policy PDF.');
    }
  };

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading policies. Please ensure your backend is running and accessible, and that the API endpoint returns a valid response.</div>;

  return (
    <div className="mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">My Policies</h1>

      <div className="relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">Policy Name</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Coverage</th>
              <th scope="col" className="px-4 py-3">Duration</th>
              <th scope="col" className="px-4 py-3">Premium</th>
              <th scope="col" className="px-1 py-3 whitespace-normal">Application Date</th>
              <th scope="col" className="px-1 py-3 whitespace-normal">Payment Status</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myApplications && myApplications.length > 0 ? (
              myApplications.map((app) => (
                <tr key={app._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {app.policyName}
                  </th>
                  <td className="px-4 py-4">
                    {app.status}
                    {app.status === 'Rejected' && app.feedback && (
                      <p className="text-red-500 text-xs mt-1">Feedback: {app.feedback}</p>
                    )}
                    {app.claimStatus === 'Approved' && (
                      <button
                        type="button"
                        className="ml-2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onClick={() => Swal.fire({
                          icon: 'info',
                          title: 'Claim Approved!',
                          text: 'Your claim for this policy has been approved. Please contact our agent for further details.',
                          confirmButtonText: 'OK'
                        })}
                      >
                        Claim Approved
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-4">{app.quoteData?.coverageAmount ? `$ ${app.quoteData.coverageAmount}` : 'N/A'}</td>
                  <td className="px-4 py-4">{app.quoteData?.duration ? `${app.quoteData.duration} Years` : 'N/A'}</td>
                  <td className="px-4 py-4">{app.quoteData?.estimatedPremium ? `$ ${app.quoteData.estimatedPremium}` : 'N/A'}</td>
                  <td className="px-1 py-4 whitespace-normal">{new Date(app.submittedAt).toLocaleDateString()}</td>
                  <td className="px-1 py-4 whitespace-normal">{app.paymentStatus}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-4">
                      {app.status === 'Approved' && app.paymentStatus === 'Paid' && (
                        <button type="button" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-1 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 whitespace-normal min-w-[70px] text-center" onClick={() => handleGiveReview(app)}>Give<br/>Review</button>
                      )}
                      {app.status === 'Approved' && (
                        <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-6 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 whitespace-normal min-w-[70px] text-center" onClick={() => handleDownloadPolicy(app)}>Download<br/>Policy</button>
                      )}
                      {app.status === 'Approved' && app.paymentStatus === 'Due' && (
                        <button
                          type="button"
                          className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-xs px-1 py-1.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 whitespace-normal min-w-[70px] text-center"
                          onClick={() => navigate(`/apply/payment/${app._id}`)}
                        >
                          Pay<br/>Now
                        </button>
                      )}
                      {/* Add View Details button if needed */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-600">
                  No policies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {openReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                  Give Review for {selectedPolicyForReview?.policyName}
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setOpenReviewModal(false)}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Star Rating</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-6 h-6 cursor-pointer ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => setReviewRating(star)}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reviewMessage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Feedback</label>
                    <textarea id="reviewMessage" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('reviewMessage', { required: 'Feedback is required' })}></textarea>
                    {errors.reviewMessage && <p className="text-red-500 text-xs italic mt-1">{errors.reviewMessage.message}</p>}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Submit Review</button>
                    <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => setOpenReviewModal(false)}>Cancel</button>
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

export default MyPolicies;