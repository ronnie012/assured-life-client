import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaLightbulb, FaHandshake, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaCalculator, FaUserTie, FaLaptopCode, FaCreditCard, FaChartLine } from 'react-icons/fa';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-12">
      <Helmet>
        <title>About Us - AssuredLife</title>
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
            About AssuredLife
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We are a modern life insurance tech startup dedicated to simplifying the process of purchasing and managing life insurance.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
            <FaLightbulb className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              To bring transparency and trust to the life insurance industry, making it accessible and understandable for everyone. We empower individuals to secure their future with confidence.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
            <FaHandshake className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              To be the leading digital platform for life insurance management, recognized for our user-centric design, innovative solutions, and unwavering commitment to customer well-being.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <FaHeart className="text-4xl text-blue-500 mb-3 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Empathy</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We understand the importance of securing your loved ones' future and approach every interaction with care and understanding.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <FaShieldAlt className="text-4xl text-blue-500 mb-3 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We operate with the highest ethical standards, ensuring honesty and transparency in all our dealings.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <FaLightbulb className="text-4xl text-blue-500 mb-3 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We continuously seek new ways to improve our platform and services, leveraging technology for a better user experience.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us (Benefits) - Reusing Home page concept */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-8">Why Choose AssuredLife?</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
              <FaCalculator className="text-4xl text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Instant Quote Calculation</h3>
              <p className="text-gray-700 dark:text-gray-300">Get personalized premium estimates in minutes.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
              <FaUserTie className="text-4xl text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Expert Agent Support</h3>
              <p className="text-gray-700 dark:text-gray-300">Connect with experienced agents for personalized advice.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
              <FaLaptopCode className="text-4xl text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">100% Online Application</h3>
              <p className="text-gray-700 dark:text-gray-300">Apply for policies conveniently from anywhere, anytime.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
              <FaCreditCard className="text-4xl text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Secure Online Payments</h3>
              <p className="text-gray-700 dark:text-gray-300">Process premiums securely with trusted payment gateways.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
              <FaChartLine className="text-4xl text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Claim Tracking</h3>
              <p className="text-gray-700 dark:text-gray-300">Monitor the status of your claims with ease.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
              <FaUserTie className="text-4xl text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Personalized Dashboard Access</h3>
              <p className="text-gray-700 dark:text-gray-300">Manage your policies and profile from a dedicated dashboard.</p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <FaPhone className="text-4xl text-blue-500 mb-3 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Phone</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">+1 (555) 123-4567</p>
            </div>
            <div>
              <FaEnvelope className="text-4xl text-blue-500 mb-3 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Email</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">info@assuredlife.com</p>
            </div>
            <div>
              <FaMapMarkerAlt className="text-4xl text-blue-500 mb-3 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Address</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">123 Insurance Blvd, Suite 100, Life City, LC 90210</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;