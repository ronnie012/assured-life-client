import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import QuoteStep from './QuoteStep';
import ApplicationDetailsStep from './ApplicationDetailsStep';
import PaymentStep from './PaymentStep';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const MultiStepApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = [
    { name: 'Get Quote', component: QuoteStep },
    { name: 'Application Details', component: ApplicationDetailsStep },
    { name: 'Make Payment', component: PaymentStep },
  ];

  const totalSteps = steps.length;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = async (data) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (currentStep === 0) { // After QuoteStep, we have estimatedPremium
      // No backend call needed yet, just move to next step
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 1) { // After ApplicationDetailsStep
      // Submit application to backend
      try {
        const applicationData = {
          userId: user._id, // Assuming user._id is available from auth context
          policyId: updatedFormData.policyId, // This should come from a selected policy, not directly from quote form
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
            allergies: updatedFormData.allergies || [],
            medications: updatedFormData.medications || [],
          },
        };

        const response = await axios.post('http://localhost:5000/api/v1/applications/submit', applicationData);
        toast.success(response.data.message);
        setFormData(prev => ({ ...prev, applicationId: response.data.applicationId }));
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        console.error('Application submission failed:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Application submission failed.');
      }
    } else if (currentStep === 2) { // After PaymentStep (final step)
      toast.success('Application process completed!');
      navigate('/dashboard/customer/my-policies'); // Redirect after final submission
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

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressValue}%` }}></div>
          </div>
          <p className="text-center text-sm mt-2">Step {currentStep + 1} of {totalSteps}: {steps[currentStep].name}</p>
        </div>

        {CurrentStepComponent && (
          <CurrentStepComponent
            onNext={handleNext}
            onBack={handleBack}
            initialData={formData}
            // Pass policyId and applicationId to PaymentStep
            policyId={formData.policyId} 
            applicationId={formData.applicationId}
            amount={formData.estimatedPremium ? Math.round(parseFloat(formData.estimatedPremium) * 100) : 0} // Pass amount in cents
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepApplicationForm;