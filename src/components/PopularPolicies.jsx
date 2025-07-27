import React from "react";
import { useQuery } from "@tanstack/react-query";
import PolicyCard from "./PolicyCard";
import useAxiosPublic from "../hooks/useAxiosPublic";

const PopularPolicies = () => {
  const axiosPublic = useAxiosPublic();

  const { data: policies, isLoading, isError } = useQuery({
    queryKey: ["popular-policies"],
    queryFn: async () => {
      const response = await axiosPublic.get('/policies/popular');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center my-12">
        <p>Loading Popular Policies...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center my-12 text-red-600">
        <p>Error loading popular policies. Please try again later.</p>
      </div>
    );
  }

  // Ensure policies is an array before mapping
  const policiesToRender = Array.isArray(policies) ? policies : [];

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Popular Policies</h2>
        <p className="text-gray-500 text-lg">
          Explore our most sought-after life insurance policies.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {policiesToRender.length > 0 ? (
          policiesToRender.map((policy) => (
            <PolicyCard key={policy._id} policy={policy} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            No popular policies found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularPolicies;