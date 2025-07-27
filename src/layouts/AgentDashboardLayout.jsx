import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

import { HiChartPie, HiViewBoards, HiInbox, HiUser, HiDocumentText, HiClipboardCheck } from 'react-icons/hi';

const AgentDashboardLayout = () => {
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center p-2 text-base font-normal rounded-lg ${isActive ? 'text-white bg-gray-700' : 'text-white hover:bg-gray-700'}`;

  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-800 rounded-lg">
      <nav className="flex flex-col p-4 bg-gray-800 dark:bg-gray-950 text-white w-64 space-y-2 rounded-tl-lg rounded-bl-lg">
        <ul className="space-y-2">
          <li>
            <NavLink to="/agent/dashboard" end className={getNavLinkClass}>
              <HiChartPie className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/dashboard/assigned-customers" className={getNavLinkClass}>
              <HiViewBoards className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Assigned Customers</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/dashboard/manage-blogs" className={getNavLinkClass}>
              <HiDocumentText className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Blogs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/dashboard/policy-clearance" className={getNavLinkClass}>
              <HiClipboardCheck className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Policy Clearance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/agent/dashboard/create-blog" className={getNavLinkClass}>
              <HiInbox className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Blog Posts</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="flex-1 overflow-y-auto p-6 rounded-lg rounded-tr-lg rounded-br-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AgentDashboardLayout;
