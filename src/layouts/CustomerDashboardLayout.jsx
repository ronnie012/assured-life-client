import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { HiChartPie, HiViewBoards, HiCreditCard, HiStar, HiUserAdd } from 'react-icons/hi';

const CustomerDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="flex flex-col p-4 bg-gray-800 dark:bg-gray-950 text-white w-64 space-y-2">
        <ul className="space-y-2">
          <li>
            <Link to="/customer/dashboard/my-policies" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiChartPie className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="my-policies" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiViewBoards className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">My Policies</span>
            </Link>
          </li>
          <li>
            <Link to="payment-status" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiCreditCard className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Payment Status</span>
            </Link>
          </li>
          <li>
            <Link to="claim-request" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiStar className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Claim Request</span>
            </Link>
          </li>
        <li>
            <Link to="/customer/dashboard/apply-agent" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
              <HiUserAdd className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Apply to be Agent</span>
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

export default CustomerDashboardLayout;
