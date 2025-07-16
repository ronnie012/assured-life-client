import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import AdminDashboardLayout from '../layouts/AdminDashboardLayout';

const AdminDashboardWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-10">
        <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role.toLowerCase() !== 'admin') {
    console.log(`AdminDashboardWrapper: Access denied. User role: ${user?.role}. Redirecting to home.`);
    return <Navigate to="/" replace />;
  }

  console.log(`AdminDashboardWrapper: Access granted. User role: ${user.role}.`);
  return <AdminDashboardLayout />;
};

export default AdminDashboardWrapper;
