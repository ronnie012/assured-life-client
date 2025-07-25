import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const QuotePage = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [estimatedPremium, setEstimatedPremium] = useState(null);
  const [formData, setFormData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const policy = location.state?.policy; // Optional: Pass policy data for context
  console.log('QuotePage - received policy:', policy);
  console.log('QuotePage - estimatedPremium initial state:', estimatedPremium);

  const smoker = watch('smoker');

  const calculatePremium = (data) => {
    let premium = 50; // Base premium
    if (data.age && data.coverageAmount && data.duration) {
      premium += (parseInt(data.age, 10) * 2);
      premium += (parseFloat(data.coverageAmount) / 1000) * 0.5; // Use parseFloat for coverage
      premium += (parseInt(data.duration, 10) * 10);
      if (data.smoker === 'yes') {
        premium *= 1.5; // 50% higher for smokers
      }
    }
    return premium.toFixed(2);
  };

  const onSubmit = (data) => {
    const premium = calculatePremium(data);
    const dataWithPremiumAndPolicyId = { ...data, estimatedPremium: premium };
    if (policy) {
      dataWithPremiumAndPolicyId.policyId = policy._id;
    }
    setEstimatedPremium(premium);
    setFormData(dataWithPremiumAndPolicyId);
  };

  const handleApplyForPolicy = () => {
    if (!estimatedPremium) {
      toast.error('Please calculate your premium first.');
      return;
    }
    console.log('QuotePage - Navigating with state:', { policy: policy, quoteData: { ...formData, estimatedPremium: parseFloat(estimatedPremium) } });
    navigate('/application-form', {
      state: {
        policy: policy,
        quoteData: { ...formData, estimatedPremium: parseFloat(estimatedPremium) },
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Get an Instant Quote</h1>
        
        {policy && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{policy.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">Category: {policy.category}</p>
          </div>
        )}

        {!estimatedPremium ? (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Age</label>
              <input
                type="number"
                id="age"
                placeholder="e.g., 30"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                {...register('age', { required: 'Age is required', min: { value: 18, message: 'Must be at least 18' } })}
            />
            {errors.age && <p className="text-red-500 text-xs italic mt-1">{errors.age.message}</p>}
          </div>

          <div>
            <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
            <select id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" {...register('gender', { required: 'Gender is required' })}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs italic mt-1">{errors.gender.message}</p>}
          </div>

          <div>
            <label htmlFor="coverageAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Coverage Amount ($)</label>
            <input
              type="number"
              id="coverageAmount"
              placeholder="e.g., 250,000"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              {...register('coverageAmount', { required: 'Coverage amount is required', min: { value: 10000, message: 'Minimum coverage is $10,000' } })}
            />
            {errors.coverageAmount && <p className="text-red-500 text-xs italic mt-1">{errors.coverageAmount.message}</p>}
          </div>

          <div>
            <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration (Years)</label>
            <input
              type="number"
              id="duration"
              placeholder="e.g., 20"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              {...register('duration', { required: 'Duration is required', min: { value: 5, message: 'Minimum duration is 5 years' } })}
            />
            {errors.duration && <p className="text-red-500 text-xs italic mt-1">{errors.duration.message}</p>}
          </div>

          <div className="col-span-full">
            <label htmlFor="smoker" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Do you smoke?</label>
            <select id="smoker" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" {...register('smoker', { required: 'Smoker status is required' })}>
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.smoker && <p className="text-red-500 text-xs italic mt-1">{errors.smoker.message}</p>}
          </div>

          <div className="col-span-full flex justify-center mt-4">
            <button type="submit" className="text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-8 py-3 text-center w-full md:w-auto">Calculate Premium</button>
          </div>
        </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Estimated Premium</h2>
            <p className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">${estimatedPremium}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">per month</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/apply" 
                  state={{ policy: policy, quoteData: { ...formData, estimatedPremium: parseFloat(estimatedPremium) } }}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 w-full sm:w-auto"
                >
                  Apply for Policy
                </Link>
                <button 
                  onClick={() => setEstimatedPremium(null)} 
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 w-full sm:w-auto"
                >
                  Recalculate
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotePage;