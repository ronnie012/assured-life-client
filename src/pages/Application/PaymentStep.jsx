import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { toast } from 'react-toastify';

import { useAuth } from '../../contexts/AuthProvider';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ onNext, onBack, initialData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/application-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
      toast.error(message || "Payment failed!");
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // Save transaction info to your backend
        await axios.post('http://localhost:5000/api/v1/payments/save-payment-info', {
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          paymentMethod: paymentIntent.payment_method_types[0],
          policyId: initialData.policyId, // Assuming policyId is passed from previous steps
          applicationId: initialData.applicationId, // Assuming applicationId is passed
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Payment successful and recorded!');
        onNext(); // Proceed to final step/completion
      } catch (saveError) {
        console.error('Error saving payment info:', saveError);
        toast.error('Payment successful, but failed to record transaction. Please contact support.');
      }
    } else {
      setMessage("Payment processing. You will be notified when it completes.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Back</button>
        <button type="submit" disabled={isLoading || !stripe || !elements} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <span id="button-text">
            {isLoading ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
            </svg> : "Pay now"} 
          </span>
        </button>
      </div>
      {message && <div id="payment-message" className="text-red-500 text-center mt-4">{message}</div>}
    </form>
  );
};

const PaymentStep = ({ onNext, onBack, initialData }) => {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (!user || !initialData.policyId || !initialData.applicationId || !initialData.estimatedPremium) {
      toast.error('Missing payment details. Please go back to previous steps.');
      onBack(); // Go back if data is missing
      return;
    }

    // Create PaymentIntent
    axios.post('http://localhost:5000/api/v1/payments/create-payment-intent', {
      amount: Math.round(parseFloat(initialData.estimatedPremium) * 100), // Convert to cents
      policyId: initialData.policyId,
      applicationId: initialData.applicationId,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => {
        console.error('Error fetching client secret:', err.response?.data || err.message);
        toast.error('Could not initiate payment. Please try again.');
        onBack();
      });
  }, [user, initialData, onBack]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="payment-step">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm onNext={onNext} onBack={onBack} initialData={initialData} />
        </Elements>
      ) : (
        <div className="text-center">
          <svg aria-hidden="true" role="status" className="inline w-8 h-8 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
