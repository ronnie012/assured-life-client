import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import AgentCard from '../../components/AgentCard';

const AgentsPage = () => {
  const axiosPublic = useAxiosPublic();

  const { data: agents = [], isLoading, isError } = useQuery({
    queryKey: ['allAgents'],
    queryFn: async () => {
      const response = await axiosPublic.get('/agents');
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading agents...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading agents.</div>;

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Our Agents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <AgentCard key={agent._id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default AgentsPage;
