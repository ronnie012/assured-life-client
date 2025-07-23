import React from 'react';


const AgentCard = ({ agent }) => {
  // console.log('AgentCard: Received agent prop:', agent);
  return (
    <div className="max-w-sm text-center p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <img className="w-24 h-24 rounded-full mx-auto mb-4" src={agent.photoURL || agent.photo || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} alt="Agent Avatar" />
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {agent.name}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        <strong>Experience:</strong> {agent.experience}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        <strong>Specialties:</strong> {agent.specialties.join(', ')}
      </p>
    </div>
  );
};

export default AgentCard;
