import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import SocialLogin from '../../components/SocialLogin';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      toast.success('Login successful!');
      navigate(user.role === 'ADMIN' ? '/admin/dashboard/applications' : user.role === 'AGENT' ? '/agent/dashboard/assigned-customers' : '/customer/dashboard/my-policies');
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed.');
    }
  };

  return (
    <div className="flex justify-center items-center max-w-[1260px] mx-auto rounded-2xl min-h-[70vh] bg-gray-100 dark:bg-gray-900 py-12">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Login</h2>
        {/* <h2 className="text-2xl font-bold text-center mb-6">Login</h2> */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register('email', { required: 'Email is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer flex items-center text-gray-500"
            >
              <span className="text-xs mr-1">{showPassword ? 'Hide' : 'Show'}</span>
              {showPassword ? <AiOutlineEyeInvisible className="text-lg" /> : <AiOutlineEye className="text-lg" />}
            </span>
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="bg-transparent text-blue-700 font-semibold py-2 px-4 border-2 border-gray-300 hover:border-blue-500 rounded w-full transition-all 2-300 h-12 relative overflow-hidden hover:scale-110 inline-block dark:border-gray-600 dark:text-blue-400 dark:hover:border-blue-400"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
          </p>
        </div>
        <div className="divider my-4">OR</div>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;
