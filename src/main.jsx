import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import router from './routes/router';
import './index.css';
import { AuthProvider } from './contexts/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <RouterProvider router={router}>
              <App />
            </RouterProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
    <ToastContainer />
  </React.StrictMode>
);