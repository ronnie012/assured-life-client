import React from 'react';
import { useForm } from 'react-hook-form';


const QuoteStep = ({ onNext, initialData }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  // Watch form values to dynamically calculate premium (simplified logic)
  const age = watch('age');
  const coverageAmount = watch('coverageAmount');
  const duration = watch('duration');
  const smoker = watch('smoker');

  const calculatePremium = (data) => {
    let premium = 0;
    if (data.age && data.coverageAmount && data.duration) {
      premium = (parseInt(data.coverageAmount) / 100000) * (parseInt(data.duration) * 10) + (parseInt(data.age) * 5);
      if (data.smoker === 'yes') {
        premium *= 1.5; // 50% higher for smokers
      }
    }
    return premium.toFixed(2);
  };

  const onSubmit = (data) => {
    const premium = calculatePremium(data);
    onNext({ ...data, estimatedPremium: premium });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Age</label>
          <input
            type="number"
            id="age"
            placeholder="e.g., 30"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register('age', { required: 'Age is required', min: { value: 18, message: 'Must be at least 18' } })}
          />
        {errors.age && <p className="text-red-500 text-xs italic mt-1">{errors.age.message}</p>}
      </div>

      <div>
        <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
        <select id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('gender', { required: 'Gender is required' })}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-xs italic mt-1">{errors.gender.message}</p>}
      </div>

      <div>
        <label htmlFor="coverageAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Coverage Amount (e.g., 100000)</label>
        <input
          type="number"
          id="coverageAmount"
          placeholder="e.g., 100000"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register('coverageAmount', { required: 'Coverage amount is required', min: { value: 10000, message: 'Minimum coverage is 10,000' } })}
        />
        {errors.coverageAmount && <p className="text-red-500 text-xs italic mt-1">{errors.coverageAmount.message}</p>}
      </div>

      <div>
        <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration (Years)</label>
        <input
          type="number"
          id="duration"
          placeholder="e.g., 20"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register('duration', { required: 'Duration is required', min: { value: 5, message: 'Minimum duration is 5 years' } })}
        />
        {errors.duration && <p className="text-red-500 text-xs italic mt-1">{errors.duration.message}</p>}
      </div>

      <div className="col-span-full">
        <label htmlFor="smoker" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Smoker?</label>
        <select id="smoker" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('smoker', { required: 'Smoker status is required' })}>
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {errors.smoker && <p className="text-red-500 text-xs italic mt-1">{errors.smoker.message}</p>}
      </div>

      <div className="col-span-full flex justify-center">
        <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full md:w-auto">Next: Application Details</button>
      </div>
    </form>
  );
};

export default QuoteStep;
