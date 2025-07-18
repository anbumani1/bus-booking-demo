import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import BusTracking from './pages/BusTracking';
import BookingHistory from './pages/BookingHistory';

// Styles
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <AnimatePresence mode="wait">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/seat-selection/:busId" element={<SeatSelection />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/track-bus/:busId" element={<BusTracking />} />
          <Route path="/booking-history" element={<BookingHistory />} />
            </Routes>
          </main>
        </AnimatePresence>
        
        <Footer />
      </div>
      
      {/* Toast notifications with beautiful styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 20px 48px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#667eea',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#ff6b6b',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            },
          },
        }}
      />
      
      {/* Global Loading Overlay */}
      <motion.div
        id="loading-overlay"
        className="fixed inset-0 bg-white z-50 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            BusBooking Demo
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading your journey...
          </motion.p>
        </div>
      </motion.div>
    </Router>
  );
}

export default App;
