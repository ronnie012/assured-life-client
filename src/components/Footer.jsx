import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn, FaShieldAlt } from 'react-icons/fa'; // Added FaShieldAlt

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 backdrop-blur-lg bg-opacity-10 dark:bg-opacity-10 border mt-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white py-2 mx-auto max-w-7xl rounded-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-4">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-3 flex items-center justify-center"> {/* Added flex, items-center, justify-center */}
              <FaShieldAlt className="h-5 w-5 md:h-6 md:w-6 mr-2 text-blue-500" /> {/* Shield Icon */}
              AssuredLife
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-md">
              Simplifying the process of purchasing and managing life insurance.
              Secure Your Tomorrow, Today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul>
              <li className="mb-1">
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Home</Link>
              </li>
              <li className="mb-1">
                <Link to="/policies" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">All Policies</Link>
              </li>
              <li className="mb-1">
                <Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Blog</Link>
              </li>
              <li className="mb-1">
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex justify-center space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
                <FaFacebookF className="text-2xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
                <FaYoutube className="text-2xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
                <FaLinkedinIn className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <p className="text-gray-600 dark:text-gray-300 text-md mb-2">123 Insurance Lane, Suite 400</p>
            <p className="text-gray-600 dark:text-gray-300 text-md mb-1">Policy City, PC 12345</p>
            <p className="text-gray-600 dark:text-gray-300 text-md mb-1">Email: info@assured-life.com</p>
            <p className="text-gray-600 dark:text-gray-300 text-md">Phone: (123) 456-7890</p>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-2 pt-3 pb-0 text-center text-gray-600 dark:text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} AssuredLife. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;