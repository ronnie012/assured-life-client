import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const PrivateRoute = ({ children, element: Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // Call useLocation unconditionally

  // console.log(`PrivateRoute: Rendering. Loading: ${loading}, User: ${!!user}, User Role: ${user?.role}`);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Access requiredRole directly from the route definition in router.jsx
  let requiredRole = null;
  if (location.pathname.startsWith('/admin/dashboard')) {
    requiredRole = 'admin';
  } else if (location.pathname.startsWith('/agent/dashboard')) {
    requiredRole = 'agent';
  } else if (location.pathname.startsWith('/customer/dashboard')) {
    requiredRole = 'customer';
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log(`PrivateRoute: Role mismatch. User role: ${user.role}, Required role: ${requiredRole}. Redirecting to home.`);
    return <Navigate to="/" replace />;
  }

  return Element ? <Element /> : children;
};

export default PrivateRoute;