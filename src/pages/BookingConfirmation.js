import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CreditCardIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
// import Confetti from 'react-confetti';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [passengerDetails, setPassengerDetails] = useState([]);

  useEffect(() => {
    // Get booking data from localStorage
    const data = localStorage.getItem('bookingData');
    if (data) {
      const booking = JSON.parse(data);
      setBookingData(booking);
      
      // Generate passenger details for selected seats
      const passengers = booking.selectedSeats.map((seatNumber, index) => ({
        seatNumber,
        name: `Passenger ${index + 1}`,
        age: Math.floor(Math.random() * 50) + 20,
        gender: Math.random() > 0.5 ? 'Male' : 'Female'
      }));
      setPassengerDetails(passengers);
    } else {
      navigate('/');
    }

    // Hide confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  }, [navigate]);

  const bookingNumber = `BUS${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const bookingDate = new Date().toLocaleDateString();

  const handlePrint = () => {
    toast.success('Ticket will be downloaded shortly...');
    // In a real app, this would generate and download a PDF
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bus Ticket Booking Confirmed',
        text: `Booking confirmed! Reference: ${bookingNumber}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Booking confirmed! Reference: ${bookingNumber}`);
      toast.success('Booking details copied to clipboard!');
    }
  };

  const handleTrackBus = () => {
    navigate(`/track-bus/${bookingData.bus.id}`);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Your bus ticket has been successfully booked
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Booking Reference: <span className="font-mono font-semibold">{bookingNumber}</span>
          </p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-3xl mr-4">{bookingData.bus.operator.logo}</div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {bookingData.bus.operator.name}
                  </h2>
                  <p className="text-blue-100">
                    {bookingData.bus.busType.name} • {bookingData.bus.busNumber}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{bookingData.totalAmount}</div>
                <div className="text-blue-100 text-sm">Total Amount</div>
              </div>
            </div>
          </div>

          {/* Journey Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Journey Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Travel Date</div>
                      <div className="text-sm text-gray-600">{bookingDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Departure Time</div>
                      <div className="text-sm text-gray-600">{bookingData.bus.departureTime}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Route</div>
                      <div className="text-sm text-gray-600">
                        Mumbai → Pune ({bookingData.bus.duration})
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Passenger Details</h3>
                <div className="space-y-3">
                  {passengerDetails.map((passenger, index) => (
                    <div key={index} className="flex items-center">
                      <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Seat {passenger.seatNumber}: {passenger.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {passenger.age} years, {passenger.gender}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <div className="text-sm text-gray-600">+91 98765 43210</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-sm text-gray-600">passenger@example.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <PrinterIcon className="w-5 h-5 mr-2" />
            Download Ticket
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <ShareIcon className="w-5 h-5 mr-2" />
            Share Booking
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTrackBus}
            className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <MapPinIcon className="w-5 h-5 mr-2" />
            Track Bus
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Book Another
          </motion.button>
        </motion.div>

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• Please arrive at the boarding point 15 minutes before departure</li>
            <li>• Carry a valid ID proof during travel</li>
            <li>• Keep your booking reference number handy</li>
            <li>• Cancellation allowed up to 2 hours before departure</li>
            <li>• For any queries, contact customer support: 1800-123-4567</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
