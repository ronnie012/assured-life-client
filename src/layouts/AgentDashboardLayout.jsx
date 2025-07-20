import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { HiChartPie, HiViewBoards, HiInbox, HiUser, HiDocumentText, HiClipboardCheck } from 'react-icons/hi';

const AgentDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="flex flex-col p-4 bg-gray-800 dark:bg-gray-950 text-white w-64 space-y-2">
        <ul className="space-y-2">
          <li>
            <Link to="/agent/dashboard" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiChartPie className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/agent/dashboard/assigned-customers" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiViewBoards className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Assigned Customers</span>
            </Link>
          </li>
          <li>
            <Link to="/agent/dashboard/manage-blogs" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiDocumentText className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Blogs</span>
            </Link>
          </li>
          <li>
            <Link to="/agent/dashboard/policy-clearance" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiClipboardCheck className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Policy Clearance</span>
            </Link>
          </li>
          <li>
            <Link to="/agent/dashboard/create-blog" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiInbox className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Blog Posts</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AgentDashboardLayout;
