import { Fragment, useState, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Policies', href: '/policies' },
  { name: 'Agents', href: '/agents' },
  { name: 'FAQs', href: '/faqs' },
];

export default function AppNavbar() {
  const { user, logout, loading } = useAuth();
  
  useEffect(() => {
    // This effect will re-run whenever the user object changes, ensuring the Navbar re-renders.
  }, [user]);

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
    `relative text-gray-700 dark:text-white font-medium text-sm px-3 py-2 group overflow-hidden
    ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}
    `;

  const getMobileNavLinkClass = ({ isActive }) =>
    `relative text-gray-700 dark:text-white font-medium text-sm px-3 py-2 group overflow-hidden block
    ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}
    `;


  return (
    <Disclosure as="nav" className="bg-transparent dark:bg-transparent sticky top-0 z-50 backdrop-blur-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              
              

              <div className="flex items-center justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-gray-900 dark:text-white text-2xl font-bold">
                    AssuredLife
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex flex-grow justify-center md:ml-4 lg:ml-10">
                <div className="flex md:space-x-2 lg:space-x-4">
                  {navLinks.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      end={item.href === '/'}
                      className={getNavLinkClass}
                    >
                      {({ isActive }) => (
                        <>
                          {item.name}
                          <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </>
                      )}
                    </NavLink>
                  ))}
                  {user && (
                    <NavLink
                      to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard'}
                      className={getNavLinkClass}
                    >
                      {({ isActive }) => {
                        console.log(`Navbar: User Role - ${user.role}, Dashboard Link - ${user.role === 'admin' ? '/admin/dashboard' : user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard'}`);
                        return (
                          <>
                            Dashboard
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                          </>
                        );
                      }}
                    </NavLink>
                  )}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                <button
                  onClick={toggleDarkMode}
                  className="text-blue-300 hover:text-white focus:outline-none mr-2"
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12H5.25m-.386-6.364 1.591 1.591M12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                  )}
                </button>
                <div className="md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {user && !loading ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.photoURL || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard'}
                              className={active ? 'bg-gray-100 block px-4 py-2 text-sm text-gray-700' : 'block px-4 py-2 text-sm text-gray-700'}
                            >
                              My Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={active ? 'bg-gray-100 block px-4 py-2 text-sm text-gray-700' : 'block px-4 py-2 text-sm text-gray-700'}
                            >
                              My Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={active ? 'bg-gray-100 block w-full text-left px-4 py-2 text-sm text-gray-700' : 'block w-full text-left px-4 py-2 text-sm text-gray-700'}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : !loading ? (
                  <div className="hidden md:flex space-x-4">
                    <Link to="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Login
                    </Link>
                    <Link to="/register" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Register
                    </Link>
                  </div>
                ) : null }
              </div>
            </div>
          </div>

          {open && (
            <Disclosure.Panel className="md:hidden fixed top-16 right-0 bg-gray-50/80 dark:bg-blue-900/90 shadow-lg rounded-lg w-25 mr-1 backdrop-blur-sm">
              <div className="space-y-0.5 px-2 py-1">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/'}
                    className={getMobileNavLinkClass}
                  >
                    {({ isActive }) => (
                      <>
                        {item.name}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                      </>
                    )}
                  </NavLink>
                ))}
                {user && (
                  <NavLink
                    to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'AGENT' ? '/agent/dashboard' : '/customer/dashboard'}
                    className={getMobileNavLinkClass}
                  >
                    {({ isActive }) => (
                      <>
                        Dashboard
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                      </>
                    )}
                  </NavLink>
                )}
                {!user && (
                  <div className="mt-2">
                    <NavLink
                      to="/login"
                      className={getMobileNavLinkClass}
                    >
                      {({ isActive }) => (
                        <>
                          Login
                          <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </>
                      )}
                    </NavLink>
                    <NavLink
                      to="/register"
                      className={getMobileNavLinkClass}
                    >
                      {({ isActive }) => (
                        <>
                          Register
                          <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </>
                      )}
                    </NavLink>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
}