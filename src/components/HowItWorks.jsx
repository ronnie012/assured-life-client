
import React from 'react';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 sm:py-20 lg:py-24 max-w-7xl mx-auto">
      <div className="">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12 sm:text-4xl lg:text-5xl">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Get a Free Quote</h3>
            <p className="text-gray-600 dark:text-gray-300">Answer a few simple questions to receive an estimated premium tailored to your needs.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Apply Online</h3>
            <p className="text-gray-600 dark:text-gray-300">Complete our secure and straightforward application form from the comfort of your home.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Get Covered</h3>
            <p className="text-gray-600 dark:text-gray-300">Once approved, your policy is activated, providing you and your loved ones with peace of mind.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
