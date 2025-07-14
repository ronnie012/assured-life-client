import React from "react";

const Benefits = () => {
  const benefits = [
    {
      title: "Instant Quote Calculation",
      description: "Get estimated premiums quickly and easily.",
    },
    {
      title: "Expert Agent Support",
      description: "Connect with experienced agents for personalized advice.",
    },
    {
      title: "100% Online Application",
      description: "Apply for policies conveniently from anywhere.",
    },
    {
      title: "Secure Online Payments",
      description: "Make premium payments safely and securely.",
    },
    {
      title: "Real-Time Claim Tracking",
      description: "Monitor the status of your claims in real-time.",
    },
    {
      title: "Personalized Dashboard Access",
      description: "Manage your policies and profile from a dedicated dashboard.",
    },
  ];

  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Benefits of AssuredLife
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {benefit.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;