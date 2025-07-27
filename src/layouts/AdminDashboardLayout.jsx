import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

import { HiChartPie, HiViewBoards, HiInbox, HiUser, HiShoppingBag, HiArrowSmRight, HiTable, HiCheckCircle } from 'react-icons/hi';

const AdminDashboardLayout = () => {
  const activeLink = 'flex items-center p-2 text-base font-normal text-white rounded-lg bg-gray-700';
  const normalLink = 'flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700';

  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-800 rounded-lg">
      <nav className="flex flex-col p-4 bg-gray-800 dark:bg-gray-950 text-white w-64 space-y-2 rounded-tl-lg rounded-bl-lg">
        <ul className="space-y-2">
          <li>
            <NavLink to="/admin/dashboard" end className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiChartPie className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="applications" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiViewBoards className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Applications</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="users" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiInbox className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="policies" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiUser className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Policies</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="transactions" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiShoppingBag className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Transactions</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="agents" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiArrowSmRight className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Agents</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="manage-blogs" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiTable className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Manage Blogs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="policy-clearance" className={({ isActive }) => isActive ? activeLink : normalLink}>
              <HiCheckCircle className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
              <span className="ml-3">Policy Clearance</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="flex-1 overflow-y-auto p-6 rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
