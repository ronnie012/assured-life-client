import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useAuth } from '../../../contexts/AuthProvider';

const AgentApplicationForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    try {
      const applicationData = {
        ...data,
        userId: user._id, // Assuming user._id is available from AuthProvider
        userName: user.name,
        userEmail: user.email,
        status: 'Pending', // Initial status
      };
      const response = await axiosPublic.post('/agents/applications', applicationData);
      toast.success('Agent application submitted successfully!');
      reset();
    } catch (error) {
      console.error('Agent application submission failed:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Apply to be an Agent</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <p className="text-gray-700 mb-6">
          Fill out the form below to apply to become an agent. Your application will be reviewed by an administrator.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-900">Years of Experience</label>
            <input
              type="number"
              id="experience"
              placeholder="e.g., 5"
              {...register('experience', { required: 'Years of experience is required', min: { value: 0, message: 'Experience cannot be negative' } })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.experience && <p className="text-red-500 text-xs italic mt-1">{errors.experience.message}</p>}
          </div>
          <div>
            <label htmlFor="specialties" className="block mb-2 text-sm font-medium text-gray-900">Specialties (comma-separated)</label>
            <input
              type="text"
              id="specialties"
              placeholder="e.g., Life Insurance, Health Insurance, Financial Planning"
              {...register('specialties', { required: 'Specialties are required' })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.specialties && <p className="text-red-500 text-xs italic mt-1">{errors.specialties.message}</p>}
          </div>
          <div>
            <label htmlFor="motivation" className="block mb-2 text-sm font-medium text-gray-900">Why do you want to be an agent?</label>
            <textarea
              id="motivation"
              rows="4"
              placeholder="Tell us about your motivation..."
              {...register('motivation', { required: 'Motivation is required' })}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            {errors.motivation && <p className="text-red-500 text-xs italic mt-1">{errors.motivation.message}</p>}
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentApplicationForm;
