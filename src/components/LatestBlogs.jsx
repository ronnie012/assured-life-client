import React from "react";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "./BlogCard";
import useAxiosPublic from "../hooks/useAxiosPublic";

const LatestBlogs = () => {
  const axiosPublic = useAxiosPublic();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["latest-blogs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/blogs/latest");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <span className="loading loading-lg mr-2"></span> Loading Latest Blogs...
      </div>
    );
  }

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Latest Blog/Articles</h2>
        <p className="text-gray-500">Read our latest articles and stay informed.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default LatestBlogs;