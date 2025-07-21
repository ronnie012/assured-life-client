import { Fragment, useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthProvider';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Policies', href: '/policies' },
  { name: 'Blog/Articles', href: '/blog' },
];

export default function AppNavbar() {
  const { user, logout, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getNavLinkClass = ({ isActive }) =>
    `relative text-gray-700 dark:text-white font-medium text-sm px-3 py-2 group overflow-hidden ${
      isActive ? 'text-blue-600 dark:text-blue-400' : ''
    }`;

  const getMobileNavLinkClass = ({ isActive }) =>
    `relative text-gray-700 dark:text-white font-medium text-sm px-3 py-2 group overflow-hidden block ${
      isActive ? 'text-blue-600 dark:text-blue-400' : ''
    }`;

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-900 sticky top-0 z-50 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 border-b border-gray-200 dark:border-gray-700">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="flex items-center text-gray-900 dark:text-white text-xl md:text-2xl font-bold">
                  <FaShieldAlt className="h-5 w-5 md:h-6 md:w-6 mr-2 text-blue-500" />
                  AssuredLife
                </Link>
              </div>

              <div className="hidden md:flex flex-grow justify-center items-center">
                <div className="flex items-center md:space-x-2 lg:space-x-4">
                  {navLinks.map((item) => (
                    <NavLink key={item.name} to={item.href} end={item.href === '/'} className={getNavLinkClass}>
                      {({ isActive }) => (
                        <>
                          {item.name}
                          <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </>
                      )}
                    </NavLink>
                  ))}
                  {user && (
                    <NavLink to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard'} className={getNavLinkClass}>
                      {({ isActive }) => (
                        <>
                          Dashboard
                          <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </>
                      )}
                    </NavLink>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <button onClick={toggleDarkMode} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-4">
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12H5.25m-.386-6.364 1.591 1.591M12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                  )}
                </button>

                <div className="hidden md:flex items-center">
                  {user && !loading ? (
                    <div className="flex items-center space-x-2">
                      <Link to="/profile" title="Profile">
                        <img className="h-8 w-8 rounded-full object-cover" src={user?.photoURL || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'} alt="User profile" />
                      </Link>
                      <button onClick={logout} className="text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:focus:ring-red-800 transition-colors duration-200">
                        Logout
                      </button>
                    </div>
                  ) : !loading ? (
                    <div className="flex space-x-2">
                      <Link to="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Login
                      </Link>
                      <Link to="/register" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Register
                      </Link>
                    </div>
                  ) : null}
                </div>

                <div className="md:hidden flex items-center">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : user ? (
                      <img className="h-8 w-8 rounded-full object-cover" src={user?.photoURL || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'} alt="User menu" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navLinks.map((item) => (
                <Disclosure.Button key={item.name} as={NavLink} to={item.href} end={item.href === '/'} className={getMobileNavLinkClass}>
                  {item.name}
                </Disclosure.Button>
              ))}
              {user && (
                <>
                  <Disclosure.Button as={NavLink} to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard'} className={getMobileNavLinkClass}>
                    Dashboard
                  </Disclosure.Button>
                  <Disclosure.Button as={NavLink} to="/profile" className={getMobileNavLinkClass}>
                    My Profile
                  </Disclosure.Button>
                  <Disclosure.Button as="button" onClick={logout} className={`${getMobileNavLinkClass({ isActive: false })} w-full text-left`}>
                    Logout
                  </Disclosure.Button>
                </>
              )}
              {!user && (
                <div className="mt-2 space-y-1">
                  <Disclosure.Button as={NavLink} to="/login" className={getMobileNavLinkClass}>
                    Login
                  </Disclosure.Button>
                  <Disclosure.Button as={NavLink} to="/register" className={getMobileNavLinkClass}>
                    Register
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
