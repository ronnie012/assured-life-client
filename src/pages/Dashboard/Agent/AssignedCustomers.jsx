import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthProvider';

const AssignedCustomers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState('');

  const { data: assignedApplications = [], isLoading, isError } = useQuery({
    queryKey: ['assignedApplications', user?._id], // Depend on user ID
    queryFn: async () => {
      if (!user?._id) {
        console.log('Frontend: User ID not available, skipping query.');
        return [];
      }
      console.log('Frontend: Fetching assigned applications for agent with MongoDB ID:', user._id);
      console.log('Frontend: Agent Firebase UID:', user.firebaseUid);
      const response = await axiosPublic.get(`/applications/assigned`);
      console.log('Frontend: Assigned applications data:', response.data);
      return response.data;
    },
    enabled: !!user?._id, // Only run query if user ID is available
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, feedback, policyId }) => {
      await axiosPublic.put(`/applications/${id}/status`, { status, feedback, policyId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assignedApplications']);
      toast.success('Application status updated successfully!');
      setOpenModal(false);
      setSelectedApplication(null);
      setStatus('');
      setFeedback('');
    },
    onError: (error) => {
      console.error('Frontend: Error in useQuery for assigned applications:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to load assigned applications.');
    },
  });

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setStatus(application.status);
    setOpenModal(true);
  };

  const handleStatusUpdate = () => {
    if (selectedApplication && status) {
      updateStatusMutation.mutate({ id: selectedApplication._id, status, feedback });
    }
  };

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading assigned customers.</div>;

  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <h1 className="text-4xl font-bold text-center mb-4">Assigned Customers</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Customer Name</th>
              <th scope="col" className="px-6 py-3">Customer Email</th>
              <th scope="col" className="px-6 py-3">Policy Interested In</th>
              <th scope="col" className="px-6 py-3">Application Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedApplications.map((app) => (
              <tr key={app._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {app.applicantName}
                </th>
                <td className="px-6 py-4">{app.applicantEmail}</td>
                <td className="px-6 py-4">{app.policyName}</td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-white font-medium ${app.status === 'Approved' ? 'bg-green-500' : app.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'}`}>
                      {app.status}
                    </span>
                </td>
                <td className="px-6 py-4">
                  <button type="button" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-center" onClick={() => handleViewDetails(app)}>View Details /<br/>Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details / Update Status Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="relative py-8 w-full max-w-3xl h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                  Application Details for {selectedApplication?.applicantName}
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setOpenModal(false)}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedApplication && (
                  <>
                    <div className="space-y-4">
                      <p><strong>Policy:</strong> {selectedApplication.policyName}</p>
                      <p><strong>Email:</strong> {selectedApplication.applicantEmail}</p>
                      <p><strong>Status:</strong> {selectedApplication.status}</p>
                      <p><strong>Submitted On:</strong> {new Date(selectedApplication.submittedAt).toLocaleDateString()}</p>
                      <p><strong>NID/SSN:</strong> {selectedApplication.personalData?.nidSsn}</p>
                      <p><strong>Address:</strong> {selectedApplication.personalData?.address}</p>
                      <p><strong>Phone:</strong> {selectedApplication.personalData?.phone}</p>
                    </div>
                    <div className="space-y-4">
                      <p><strong>Nominee:</strong> {selectedApplication.nomineeData?.nomineeName} ({selectedApplication.nomineeData?.nomineeRelationship})</p>
                      <p><strong>Health Disclosure:</strong> {selectedApplication.healthDisclosure?.medicalConditions?.join(', ') || 'None'}</p>
                      <p><strong>Allergies:</strong> {selectedApplication.healthDisclosure?.allergies || 'None'}</p>
                      <p><strong>Medications:</strong> {selectedApplication.healthDisclosure?.medications || 'None'}</p>

                      <div className="mt-4">
                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Update Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      {(status === 'Rejected' || selectedApplication?.status === 'Rejected') && ( // Always show feedback if status is Rejected or was previously Rejected
                        <div className="mt-4">
                          <label htmlFor="feedback" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rejection Feedback</label>
                          <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows="3" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleStatusUpdate}>Save Changes</button>
                <button type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => setOpenModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedCustomers;
