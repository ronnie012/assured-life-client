import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import GoToTop from './components/GoToTop';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar />
      <div className="flex-grow max-w-7xl mx-auto py-4 w-full">
        <Outlet />
      </div>
      <ToastContainer />
      <Footer />
      <GoToTop />
    </div>
  );
}

export default App;