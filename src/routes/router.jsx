import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AllPolicies from '../pages/Policies/AllPolicies';
import PolicyDetails from '../pages/Policies/PolicyDetails';
import MultiStepApplicationForm from '../pages/Application/MultiStepApplicationForm';
import PrivateRoute from './PrivateRoute';
import AdminDashboardLayout from '../layouts/AdminDashboardLayout';
import AgentDashboardLayout from '../layouts/AgentDashboardLayout';
import CustomerDashboardLayout from '../layouts/CustomerDashboardLayout';
import ManageApplications from '../pages/Dashboard/Admin/ManageApplications';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManagePolicies from '../pages/Dashboard/Admin/ManagePolicies';
import ManageTransactions from '../pages/Dashboard/Admin/ManageTransactions';
import ManageAgents from '../pages/Dashboard/Admin/ManageAgents';
import AssignedCustomers from '../pages/Dashboard/Agent/AssignedCustomers';
import ManageBlogs from '../pages/Dashboard/Agent/ManageBlogs';
import CreateBlog from '../pages/Dashboard/Agent/CreateBlog';
import MyPolicies from '../pages/Dashboard/Customer/MyPolicies';
import PaymentStatus from '../pages/Dashboard/Customer/PaymentStatus';
import ClaimRequestForm from '../pages/Dashboard/Customer/ClaimRequestForm';
import AgentApplicationForm from '../pages/Dashboard/Customer/AgentApplicationForm';
import ProfilePage from '../pages/Profile/ProfilePage';
import FAQsPage from '../pages/FAQs/FAQsPage';
import AgentsPage from '../pages/Agents/AgentsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/policies',
        element: <AllPolicies />,
      },
      {
        path: '/policies/:id',
        element: <PolicyDetails />,
      },
      {
        path: '/faqs',
        element: <FAQsPage />,
      },
      {
        path: '/agents',
        element: <AgentsPage />,
      },
      {
        path: 'apply',
        element: <PrivateRoute><MultiStepApplicationForm /></PrivateRoute>,
      },
      {
        path: 'profile',
        element: <PrivateRoute><ProfilePage /></PrivateRoute>,
      },
      {
        path: 'admin/dashboard',
        element: <PrivateRoute requiredRole="admin" element={AdminDashboardLayout} />,
        children: [
          {
            index: true,
            element: <Navigate to="applications" replace />,
          },
          {
            path: 'applications',
            element: <ManageApplications />,
          },
          {
            path: 'users',
            element: <ManageUsers />,
          },
          {
            path: 'policies',
            element: <ManagePolicies />,
          },
          {
            path: 'transactions',
            element: <ManageTransactions />,
          },
          {
            path: 'agents',
            element: <ManageAgents />,
          },
          {
            path: 'manage-blogs',
            element: <ManageBlogs />,
          },
        ],
      },
      {
        path: 'agent/dashboard',
        element: <PrivateRoute requiredRole="agent" element={AgentDashboardLayout} />,
        children: [
          {
            index: true,
            element: <Navigate to="assigned-customers" replace />,
          },
          {
            path: 'assigned-customers',
            element: <AssignedCustomers />,
          },
          {
            path: 'manage-blogs',
            element: <ManageBlogs />,
          },
          {
            path: 'create-blog',
            element: <CreateBlog />,
          },
        ],
      },
      {
        path: 'customer/dashboard',
        element: <PrivateRoute requiredRole="customer"><CustomerDashboardLayout /></PrivateRoute>,
        children: [
          {
            index: true,
            element: <Navigate to="my-policies" replace />,
          },
          {
            path: 'my-policies',
            element: <MyPolicies />,
          },
          {
            path: 'payment-status',
            element: <PaymentStatus />,
          },
          {
            path: 'claim-request',
            element: <ClaimRequestForm />,
          },
          {
            path: 'apply-agent',
            element: <AgentApplicationForm />,
          },
        ],
      }
    ],
  },
]);

console.log("Router configuration:", router);

export default router;
