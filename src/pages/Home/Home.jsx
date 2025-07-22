import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReviewCard from '../../components/ReviewCard';
import BlogCard from '../../components/BlogCard';
import AgentCard from '../../components/AgentCard';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import LatestBlogs from '../../components/LatestBlogs';
import PopularPolicies from '../../components/PopularPolicies';
import Benefits from '../../components/Benefits';
import CustomerReviews from '../../components/CustomerReviews';

const Home = () => {
  const axiosPublic = useAxiosPublic();

  const { data: latestBlogs, isLoading: isLoadingBlogs, isError: isErrorBlogs } = useQuery({
    queryKey: ['latestBlogs'],
    queryFn: async () => {
      const response = await axiosPublic.get('/blogs/latest');
      return response.data;
    },
  });

  const { data: featuredAgents, isLoading: isLoadingAgents, isError: isErrorAgents } = useQuery({
    queryKey: ['featuredAgents'],
    queryFn: async () => {
      const response = await axiosPublic.get('/agents/featured');
      return response.data;
    },
  });

  const { register: registerNewsletter, handleSubmit, formState: { errors: errorsNewsletter }, reset } = useForm();

  const onSubmitNewsletter = async (data) => {
    try {
      const response = await axiosPublic.post('/newsletter/subscribe', data);
      toast.success(response.data.message);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed.');
    }
  };

  return (
    <>
      <Helmet>
        <title>AssuredLife - Secure Your Tomorrow Today</title>
      </Helmet>

      {/* Hero Section */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="mySwiper rounded-lg overflow-hidden max-w-7xl mx-auto"
      >
        <SwiperSlide>
          <div className="relative w-full min-h-[70vh] lg:min-h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.pexels.com/photos/3059747/pexels-photo-3059747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")' }}>
            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-5xl font-bold leading-tight lg:mt-36 mt-12 mb-4">Secure Your Tomorrow Today</h1>
                <p className="text-md sm:text-xl mb-4">Explore policies, generate personalized quotes, and manage your insurance digitally.</p>
                <Link to="/quote" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">Get a Free Quote</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full min-h-[70vh] lg:min-h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")' }}>
            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-5xl font-bold leading-tight lg:mt-36 mt-12 mb-4">Find the Perfect Policy</h1>
                <p className="text-md sm:text-xl mb-4">We offer a wide range of policies to suit your needs.</p>
                <Link to="/policies" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">View Policies</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full min-h-[70vh] lg:min-h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")' }}>
            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-5xl font-bold leading-tight lg:mt-36 mt-12 mb-4">Expert Guidance</h1>
                <p className="text-md sm:text-xl mb-4">Our agents are here to help you every step of the way.</p>
                <Link to="/agents" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">Meet Our Agents</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Popular Policies Section */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 rounded-2xl mt-8">
        <PopularPolicies />
      </section>

      {/* Customer Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <CustomerReviews />
      </div>

      {/* Latest Blog/Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LatestBlogs />
      </div>

      {/* Newsletter Subscription Section */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800 rounded-2xl mt-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">Subscribe to Our Newsletter</h2>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8">Stay updated with the latest insurance tips and offers.</p>
        <form onSubmit={handleSubmit(onSubmitNewsletter)} className="max-w-md mx-auto bg-white dark:bg-gray-700 p-6 sm:p-8 rounded-lg shadow-md dark:border dark:border-gray-600">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your name"
              {...registerNewsletter('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errorsNewsletter.name && <p className="text-red-500 text-xs italic text-left mt-1">{errorsNewsletter.name.message}</p>}
          </div>
          <div className="mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              {...registerNewsletter('email', { required: 'Email is required', pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errorsNewsletter.email && <p className="text-red-500 text-xs italic text-left mt-1">{errorsNewsletter.email.message}</p>}
          </div>
          <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full">Subscribe</button>
        </form>
      </section>

      {/* Meet Our Agents Section */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className=" mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Meet Our Agents</h2>
          {isLoadingAgents ? (
            <div>Loading agents...</div>
          ) : isErrorAgents ? (
            <div>Error loading agents.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAgents.map((agent) => (
                <AgentCard key={agent._id} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
