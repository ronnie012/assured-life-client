import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';


const FAQsPage = () => {
  const { data: faqs, isLoading, isError } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5000/api/v1/faqs');
      return response.data;
    },
  });

  if (isLoading) return (
    <div className="text-center mt-10">
      <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  );
  if (isError) return <div className="text-center mt-10 text-red-600">Error loading FAQs.</div>;

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Frequently Asked Questions</h1>

      <div className="max-w-3xl mx-auto">
        {faqs.length > 0 ? (
          <div id="accordion-flush" data-accordion="flush">
            {faqs.map((faq, index) => (
              <div key={faq._id}>
                <h2 id={`accordion-flush-heading-${index}`}>
                  <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-left text-gray-900 border-b border-gray-200 dark:border-gray-700 dark:text-white" data-accordion-target={`#accordion-flush-body-${index}`} aria-expanded="false" aria-controls={`accordion-flush-body-${index}`}>
                    <span>{faq.question}</span>
                    <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                  </button>
                </h2>
                <div id={`accordion-flush-body-${index}`} className="hidden" aria-labelledby={`accordion-flush-heading-${index}`}>
                  <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">No FAQs available at the moment.</div>
        )}
      </div>
    </div>
  );
};

export default FAQsPage;
