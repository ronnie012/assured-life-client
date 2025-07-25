import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import QuoteStep from './QuoteStep';
import ApplicationDetailsStep from './ApplicationDetailsStep';
import PaymentStep from './PaymentStep';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import axios from 'axios'; // Import axios for direct use

const MultiStepApplicationForm = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const initialPolicyId = location.state?.policy?._id;
  const initialQuoteData = location.state?.quoteData;

  useEffect(() => {
    console.log('MultiStepApplicationForm - location.state:', location.state);
    console.log('MultiStepApplicationForm - initialQuoteData from location.state:', initialQuoteData);

    if (initialPolicyId || initialQuoteData) {
      setFormData(prev => {
        const newFormData = {
          ...prev,
          ...(initialPolicyId && { policyId: initialPolicyId }),
          ...(initialQuoteData && { quoteData: initialQuoteData }),
        };
        console.log('MultiStepApplicationForm - useEffect - initial formData:', newFormData);
        return newFormData;
      });
    }
  }, [location.state, initialPolicyId, initialQuoteData]);

  const steps = [
    { name: 'Get Quote', component: QuoteStep },
    { name: 'Application Details', component: ApplicationDetailsStep },
    
  ];

  const totalSteps = steps.length;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = async (data) => {
    let updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    console.log('MultiStepApplicationForm - updatedFormData:', updatedFormData);

    if (currentStep === 0) { // After QuoteStep, we have estimatedPremium
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 1) { // After ApplicationDetailsStep
      // Submit application to backend
      try {
        const applicationData = {
          userId: user.firebaseUid, // Use Firebase UID for consistency
          policyId: updatedFormData.policyId || formData.policyId,
          personalData: {
            fullName: updatedFormData.fullName,
            email: updatedFormData.email,
            address: updatedFormData.address,
            nidSsn: updatedFormData.nidSsn,
            phone: updatedFormData.phone,
          },
          nomineeData: {
            nomineeName: updatedFormData.nomineeName,
            nomineeRelationship: updatedFormData.nomineeRelationship,
          },
          healthDisclosure: {
            medicalConditions: updatedFormData.medicalConditions || [],
            allergies: updatedFormData.allergies || '',
            medications: updatedFormData.medications || '',
          },
          quoteData: formData.quoteData, // Explicitly use quoteData from previous state
          status: 'Pending', // Set initial status to Pending
        };

        console.log('MultiStepApplicationForm - applicationData before submission:', applicationData);
        const response = await axiosPublic.post(`/applications/submit`, applicationData);
        const newFormDataWithApplicationId = { ...updatedFormData, applicationId: response.data.applicationId.toString() };
        setFormData(newFormDataWithApplicationId);
        console.log('MultiStepApplicationForm - response.data.applicationId:', response.data.applicationId);
        console.log('MultiStepApplicationForm - typeof response.data.applicationId:', typeof response.data.applicationId);
        toast.success('Application submitted successfully! Pending agent review.');
        navigate('/customer/dashboard/my-policies'); // Redirect after application submission
      } catch (error) {
        console.error('Application submission failed:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Application submission failed.');
      }
    } else if (currentStep === 2) { // This step should ideally be reached only after admin approval and payment initiation
      // The logic for payment completion will be handled in PaymentStep.jsx
      // This block might be removed or modified based on how payment is re-integrated
      toast.success('Application process completed!');
      navigate('/customer/dashboard/my-policies'); // Redirect after final submission
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (!user) {
    return <div className="text-center mt-10 text-red-600">Please log in to start the application process.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Policy Application Process</h1>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressValue}%` }}></div>
          </div>
          <p className="text-center text-sm mt-2 text-gray-900 dark:text-white">Step {currentStep + 1} of {totalSteps}: {steps[currentStep].name}</p>
        </div>

        {CurrentStepComponent && (
          <CurrentStepComponent
            onNext={handleNext}
            onBack={handleBack}
            initialData={currentStep === 0 ? initialQuoteData : formData}
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepApplicationForm;