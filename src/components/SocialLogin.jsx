
import React from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const SocialLogin = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      toast.success('Successfully logged in with Google!');
      navigate('/'); // Redirect to home or dashboard
    } catch (error) {
      toast.error(error.message || 'Google sign-in failed.');
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleGoogleSignIn}
        className="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-gray-400 hover:border-blue-500 hover:ring-2 hover:ring-blue-500 rounded w-full flex items-center justify-center h-12 transition-all duration-300 hover:scale-110"
      >
        <FcGoogle className="mr-2 text-2xl" />
        <span className="">Continue with Google</span>
      </button>
    </div>
  );
};

export default SocialLogin;
