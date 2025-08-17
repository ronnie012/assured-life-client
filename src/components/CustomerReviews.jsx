import React from "react";
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "./ReviewCard";
import useAxiosPublic from "../hooks/useAxiosPublic";
import LoadingSpinner from "./LoadingSpinner"; // Import LoadingSpinner

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, Autoplay } from "swiper/modules";

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
      <div className="flex justify-center items-center min-h-[300px]"> {/* Added min-height for better centering */}
        <LoadingSpinner text="Loading Customer Reviews..." />
      </div>
    );
  }

  // Limit reviews to 5 as per requirement
  const displayedReviews = reviews.slice(0, 5);

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-gray-500 text-lg">Read what our satisfied customers have to say about our services.</p>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={displayedReviews.length > 3}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        className="mySwiper customer-reviews-swiper min-h-[280px]"
        
      >
        {displayedReviews.map((review) => (
          <SwiperSlide key={review._id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomerReviews;