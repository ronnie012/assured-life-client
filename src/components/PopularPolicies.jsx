import React from "react";
import { useQuery } from "@tanstack/react-query";
import PolicyCard from "./PolicyCard";
import useAxiosPublic from "../hooks/useAxiosPublic";

const PopularPolicies = () => {
  const axiosPublic = useAxiosPublic();

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ["popular-policies"],
    queryFn: async () => {
      const res = await axiosPublic.get("/popular-policies");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Popular Policies</h2>
        <p className="text-gray-500">
          Explore our most sought-after life insurance policies.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {policies.map((policy) => (
          <PolicyCard key={policy._id} policy={policy} />
        ))}
      </div>
    </div>
  );
};

export default PopularPolicies;