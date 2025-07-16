import React from "react";
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "./ReviewCard";
import useAxiosPublic from "../hooks/useAxiosPublic";

const CustomerReviews = () => {
  const axiosPublic = useAxiosPublic();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["customer-reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews/customer");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <span className="loading loading-lg mr-2"></span> Loading Customer Reviews...
      </div>
    );
  }

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">What Our Customers Say</h2>
        <p className="text-gray-500">Read what our satisfied customers have to say about our services.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;