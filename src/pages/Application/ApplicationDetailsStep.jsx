import React from 'react';
import { useForm } from 'react-hook-form';


const ApplicationDetailsStep = ({ onNext, onBack, initialData, quoteData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...initialData,
      ...initialData.quoteData, // Spread quoteData fields to the top level
    },
  });

  const onSubmit = (data) => {
    onNext({ ...data, quoteData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
            <input type="text" id="fullName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('fullName', { required: 'Full Name is required' })} />
            {errors.fullName && <p className="text-red-500 text-xs italic mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
            <textarea id="address" rows="3" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('address', { required: 'Address is required' })}></textarea>
            {errors.address && <p className="text-red-500 text-xs italic mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label htmlFor="nidSsn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NID/SSN</label>
            <input type="text" id="nidSsn" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('nidSsn', { required: 'NID/SSN is required' })} />
            {errors.nidSsn && <p className="text-red-500 text-xs italic mt-1">{errors.nidSsn.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
            <input type="text" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('phone', { required: 'Phone Number is required' })} />
            {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* Nominee Information */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Nominee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nomineeName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nominee Full Name</label>
            <input type="text" id="nomineeName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('nomineeName', { required: 'Nominee Name is required' })} />
            {errors.nomineeName && <p className="text-red-500 text-xs italic mt-1">{errors.nomineeName.message}</p>}
          </div>
          <div>
            <label htmlFor="nomineeRelationship" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Relationship to Nominee</label>
            <input type="text" id="nomineeRelationship" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('nomineeRelationship', { required: 'Relationship is required' })} />
            {errors.nomineeRelationship && <p className="text-red-500 text-xs italic mt-1">{errors.nomineeRelationship.message}</p>}
          </div>
        </div>
      </div>

      {/* Health Disclosure */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Health Disclosure</h2>
        <p className="mb-2 text-gray-700 dark:text-gray-300">Please check all that apply:</p>
        <div className="space-y-2">
          <div className="flex items-center">
            <input id="condition1" type="checkbox" value="Diabetes" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('medicalConditions')} />
            <label htmlFor="condition1" className="ms-2 text-sm font-medium text-gray-900 dark:text-white">Diabetes</label>
          </div>
          <div className="flex items-center">
            <input id="condition2" type="checkbox" value="Heart Disease" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('medicalConditions')} />
            <label htmlFor="condition2" className="ms-2 text-sm font-medium text-gray-900 dark:text-white">Heart Disease</label>
          </div>
          <div className="flex items-center">
            <input id="condition3" type="checkbox" value="High Blood Pressure" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('medicalConditions')} />
            <label htmlFor="condition3" className="ms-2 text-sm font-medium text-gray-900 dark:text-white">High Blood Pressure</label>
          </div>
          <div className="flex items-center">
            <input id="condition4" type="checkbox" value="Cancer" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('medicalConditions')} />
            <label htmlFor="condition4" className="ms-2 text-sm font-medium text-gray-900 dark:text-white">Cancer</label>
          </div>
          <div className="flex items-center">
            <input id="condition5" type="checkbox" value="Asthma" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" {...register('medicalConditions')} />
            <label htmlFor="condition5" className="ms-2 text-sm font-medium text-gray-900 dark:text-white">Asthma</label>
          </div>
          {/* Add more health conditions as needed */}
        </div>
        <div className="mt-4">
          <label htmlFor="allergies" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Any known allergies?</label>
          <textarea id="allergies" rows="2" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('allergies')} placeholder="e.g., Penicillin, Peanuts"></textarea>
        </div>
        <div className="mt-4">
          <label htmlFor="medications" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Any current medications?</label>
          <textarea id="medications" rows="2" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('medications')} placeholder="e.g., Insulin, Blood Thinners"></textarea>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Back</button>
        <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Next: Make Payment</button>
      </div>
    </form>
  );
};

export default ApplicationDetailsStep;
