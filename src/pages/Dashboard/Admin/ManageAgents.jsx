import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { toast } from 'react-toastify';

const ManageAgents = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedAgentApplication, setSelectedAgentApplication] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');

  // Fetch pending agent applications
  const { data: pendingApplications = [], isLoading: isLoadingPending, isError: isErrorPending } = useQuery({
    queryKey: ['pendingAgentApplications'],
    queryFn: async () => {
      console.log('ManageAgents: Attempting to fetch pending agent applications.');
      const response = await axiosPublic.get('/agents/applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('ManageAgents: Received pending agent applications data:', response.data);
      return response.data;
    },
  });

  // Fetch all approved agents
  const { data: approvedAgents = [], isLoading: isLoadingApproved, isError: isErrorApproved } = useQuery({
    queryKey: ['approvedAgents'],
    queryFn: async () => {
      console.log('ManageAgents: Attempting to fetch approved agents.');
      const response = await axiosPublic.get('/agents/approved', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // console.log('ManageAgents: Received approved agents data:', response.data);
      return response.data;
    },
  });

  const approveAgentMutation = useMutation({
    mutationFn: async ({ id, userId }) => {
      await axiosPublic.put(`/agents/applications/${id}/approve`, { userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingAgentApplications']);
      queryClient.invalidateQueries(['approvedAgents']);
      toast.success('Agent application approved!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve agent application.');
    },
  });

  const rejectAgentMutation = useMutation({
    mutationFn: async ({ id, feedback }) => {
      await axiosPublic.put(`/agents/applications/${id}/reject`, { feedback }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingAgentApplications']);
      toast.success('Agent application rejected!');
      setOpenRejectModal(false);
      setSelectedAgentApplication(null);
      setRejectionFeedback('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject agent application.');
    },
  });

  const demoteAgentMutation = useMutation({
    mutationFn: async (userId) => {
      await axiosPublic.put(`/users/${userId}/role`, { role: 'customer' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['approvedAgents']);
      queryClient.invalidateQueries(['users']);
      toast.success('Agent demoted to customer!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to demote agent.');
    },
  });

  const handleRejectClick = (application) => {
    setSelectedAgentApplication(application);
    setOpenRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (selectedAgentApplication) {
      rejectAgentMutation.mutate({ id: selectedAgentApplication._id, feedback: rejectionFeedback });
    }
  };

  if (isLoadingPending || isLoadingApproved) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isErrorPending || isErrorApproved) return <div className="text-center mt-10 text-red-600">Error loading agent data.</div>;

  return (
    <div className="container mx-auto px-4 pt-0 pb-8">
      <h1 className="text-4xl font-bold text-center mb-4">Manage Agents</h1>

      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              id="pending-tab"
              type="button"
              role="tab"
              aria-controls="pending"
              aria-selected={activeTab === 'pending'}
              onClick={() => setActiveTab('pending')}
            >
              Pending Applications
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'approved' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              id="approved-tab"
              type="button"
              role="tab"
              aria-controls="approved"
              aria-selected={activeTab === 'approved'}
              onClick={() => setActiveTab('approved')}
            >
              All Current Agents
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        <div className={`${activeTab === 'pending' ? '' : 'hidden'} p-4 rounded-lg bg-gray-50 dark:bg-gray-800`} id="pending" role="tabpanel" aria-labelledby="pending-tab">
          <div className="relative overflow-x-auto shadow-xl sm:rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Experience</th>
                  <th scope="col" className="px-6 py-3">Specialties</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(pendingApplications) && pendingApplications.map((app) => (
                  <tr key={app._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {app.name}
                    </th>
                    <td className="px-6 py-4">{app.userEmail}</td>
                    <td className="px-6 py-4">{app.experience}</td>
                    <td className="px-6 py-4">{Array.isArray(app.specialties) ? app.specialties.join(', ') : 'N/A'}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => approveAgentMutation.mutate({ id: app._id, userId: app.userId })}>Approve</button>
                      <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => handleRejectClick(app)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={`${activeTab === 'approved' ? '' : 'hidden'} p-4 rounded-lg bg-gray-50 dark:bg-gray-800`} id="approved" role="tabpanel" aria-labelledby="approved-tab">
          <div className="relative overflow-x-auto shadow-xl sm:rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Experience</th>
                  <th scope="col" className="px-6 py-3">Specialties</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(approvedAgents) && approvedAgents.map((agent) => (
                  <tr key={agent._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {agent.name}
                    </th>
                    <td className="px-6 py-4">{agent.userEmail}</td>
                    <td className="px-6 py-4">{agent.experience}</td>
                    <td className="px-6 py-4">{Array.isArray(agent.specialties) ? agent.specialties.join(', ') : 'N/A'}</td>
                    <td className="px-6 py-4">
                      <button type="button" className="focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 dark:focus:ring-orange-900" onClick={() => demoteAgentMutation.mutate(agent.userId)}>Demote to Customer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Agent Modal */}
      {openRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                  Reject Agent Application
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setOpenRejectModal(false)}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="rejectionFeedback" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reason for Rejection (Optional)</label>
                  <textarea id="rejectionFeedback" value={rejectionFeedback} onChange={(e) => setRejectionFeedback(e.target.value)} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                </div>
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleConfirmReject}>Reject Application</button>
                <button type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => setOpenRejectModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAgents;