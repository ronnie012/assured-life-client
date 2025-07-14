import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-800 max-w-[1260px] mx-auto px-24 rounded-2xl text-white py-4 w-full">
      <div className="mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className=''>
            <h3 className="text-2xl font-bold mb-3">AssuredLife</h3>
            <p className="text-blue-200 text-md ">
              Simplifying the process of purchasing and managing life insurance.
              Secure Your Tomorrow, Today.
            </p>
          </div>

          {/* Quick Links */}
          <div className='ml-20'>
            <h4 className="text-lg font-semibold  mb-3">Quick Links</h4>
            <ul>
              <li className="mb-1">
                <Link to="/" className="text-blue-200 hover:text-white transition-colors duration-300">Home</Link>
              </li>
              <li className="mb-1">
                <Link to="/policies" className="text-blue-200 hover:text-white transition-colors duration-300">All Policies</Link>
              </li>
              <li className="mb-1">
                <Link to="/faqs" className="text-blue-200 hover:text-white transition-colors duration-300">FAQs</Link>
              </li>
              <li className="mb-1">
                <Link to="/contact" className="text-blue-200 hover:text-white transition-colors duration-300">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className='ml-8'>
            <h4 className="text-lg font-semibold ml-1 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-300">
                <FaFacebookF className="text-2xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-300">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-300">
                <FaYoutube className="text-2xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-300">
                <FaLinkedinIn className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className='ml-6'>
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <p className="text-blue-200 text-md mb-2">123 Insurance Lane, Suite 400</p>
            <p className="text-blue-200 text-md mb-1">Policy City, PC 12345</p>
            <p className="text-blue-200 text-md mb-1">Email: info@lifesure.com</p>
            <p className="text-blue-200 text-md">Phone: (123) 456-7890</p>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-2 pt-2 text-center text-blue-300 text-sm">
          &copy; {new Date().getFullYear()} AssuredLife. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
