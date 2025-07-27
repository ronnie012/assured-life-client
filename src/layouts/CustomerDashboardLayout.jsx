import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

import { HiChartPie, HiViewBoards, HiCreditCard, HiStar, HiUserAdd } from 'react-icons/hi';

const CustomerDashboardLayout = () => {
  const activeLink = 'flex items-center p-2 text-base font-normal text-white rounded-lg bg-gray-700';
  const normalLink = 'flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700';

  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-800 rounded-lg">
      <nav className="flex flex-col p-4 bg-gray-800 dark:bg-gray-950 text-white w-48 space-y-2 rounded-tl-lg rounded-bl-lg">
        <ul className="space-y-2">
          <li>
            <NavLink to="/customer/dashboard" end className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiChartPie className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="my-policies" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiViewBoards className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">My Policies</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="payment-status" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiCreditCard className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Payment Status</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="claim-request" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiStar className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Claim Request</span>
            </NavLink>
          </li>
        <li>
            <NavLink to="/customer/dashboard/apply-agent" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiUserAdd className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Apply to be Agent</span>
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

export default CustomerDashboardLayout;
