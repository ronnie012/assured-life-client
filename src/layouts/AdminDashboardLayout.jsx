import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { HiChartPie, HiViewBoards, HiInbox, HiUser, HiShoppingBag, HiArrowSmRight, HiTable, HiCheckCircle } from 'react-icons/hi';

const AdminDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="flex flex-col p-4 bg-gray-800 dark:bg-gray-950 text-white w-64 space-y-2">
        <ul className="space-y-2">
          <li>
            <Link to="/admin/dashboard" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiChartPie className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/applications" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiViewBoards className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Applications</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/users" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiInbox className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Users</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/policies" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiUser className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Policies</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/transactions" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiShoppingBag className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Transactions</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/agents" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiArrowSmRight className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Agents</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/manage-blogs" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiTable className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Blogs</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/policy-clearance" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiCheckCircle className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Policy Clearance</span>
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

export default AdminDashboardLayout;
