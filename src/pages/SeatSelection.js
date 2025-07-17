import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserIcon,
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { generateBusSchedules, generateSeatLayout } from '../data/mockData';

const SeatSelection = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get bus details
    setTimeout(() => {
      const mockBuses = generateBusSchedules('Mumbai', 'Pune', '2024-01-15');
      const selectedBus = mockBuses.find(b => b.id === busId) || mockBuses[0];
      const layout = generateSeatLayout(selectedBus.busType, selectedBus.totalSeats);
      
      setBus(selectedBus);
      setSeatLayout(layout);
      setLoading(false);
    }, 1000);
  }, [busId]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) {
      toast.error('This seat is already booked');
      return;
    }

    if (selectedSeats.includes(seat.number)) {
      setSelectedSeats(prev => prev.filter(s => s !== seat.number));
      toast.success(`Seat ${seat.number} deselected`);
    } else {
      if (selectedSeats.length >= 6) {
        toast.error('You can select maximum 6 seats');
        return;
      }
      setSelectedSeats(prev => [...prev, seat.number]);
      toast.success(`Seat ${seat.number} selected`);
    }
  };

  const getSeatClass = (seat) => {
    if (seat.isBooked) return 'seat-booked';
    if (selectedSeats.includes(seat.number)) return 'seat-selected';
    if (seat.isLadies) return 'seat-ladies';
    return 'seat-available';
  };

  const getSeatIcon = (seat) => {
    if (seat.isBooked) return <XCircleIcon className="w-3 h-3" />;
    if (selectedSeats.includes(seat.number)) return <CheckCircleIcon className="w-3 h-3" />;
    if (seat.isLadies) return <HeartIcon className="w-3 h-3" />;
    return <UserIcon className="w-3 h-3" />;
  };

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    const bookingData = {
      bus,
      selectedSeats,
      totalAmount: selectedSeats.length * bus.price
    };

    // Store booking data in localStorage for demo
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    toast.success('Proceeding to booking confirmation...');
    setTimeout(() => {
      navigate('/booking-confirmation');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seat layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to search results
          </button>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-3xl mr-4">{bus.operator.logo}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {bus.operator.name}
                  </h1>
                  <p className="text-gray-600">
                    {bus.busType.name} • {bus.busNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {bus.departureTime} - {bus.arrivalTime} • {bus.duration}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">₹{bus.price}</div>
                <div className="text-sm text-gray-600">per seat</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Layout */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Select Your Seats
              </h2>

              {/* Bus Layout */}
              <div className="bus-layout max-w-md mx-auto">
                {/* Driver Section */}
                <div className="flex justify-end mb-4">
                  <div className="w-12 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600">🚗</span>
                  </div>
                </div>

                {/* Seats */}
                <div className="space-y-3">
                  {seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-between items-center">
                      {/* Left side seats */}
                      <div className="flex space-x-2">
                        {row.slice(0, Math.ceil(row.length / 2)).map((seat) => (
                          <motion.button
                            key={seat.number}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSeatClick(seat)}
                            className={`seat ${getSeatClass(seat)}`}
                            disabled={seat.isBooked}
                          >
                            {getSeatIcon(seat)}
                            <span className="text-xs mt-1">{seat.number}</span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Aisle */}
                      <div className="w-8 text-center text-xs text-gray-400">
                        {rowIndex + 1}
                      </div>

                      {/* Right side seats */}
                      <div className="flex space-x-2">
                        {row.slice(Math.ceil(row.length / 2)).map((seat) => (
                          <motion.button
                            key={seat.number}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSeatClick(seat)}
                            className={`seat ${getSeatClass(seat)}`}
                            disabled={seat.isBooked}
                          >
                            {getSeatIcon(seat)}
                            <span className="text-xs mt-1">{seat.number}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="seat seat-available mr-2">
                    <UserIcon className="w-3 h-3" />
                  </div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="seat seat-selected mr-2">
                    <CheckCircleIcon className="w-3 h-3" />
                  </div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="seat seat-booked mr-2">
                    <XCircleIcon className="w-3 h-3" />
                  </div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="seat seat-ladies mr-2">
                    <HeartIcon className="w-3 h-3" />
                  </div>
                  <span>Ladies</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>

              {selectedSeats.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Selected Seats:</span>
                      <span className="font-medium">
                        {selectedSeats.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Number of Seats:</span>
                      <span className="font-medium">{selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price per Seat:</span>
                      <span className="font-medium">₹{bus.price}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total Amount:</span>
                        <span className="font-bold text-xl text-gray-900">
                          ₹{selectedSeats.length * bus.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToBooking}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Proceed to Book
                  </motion.button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🪑</div>
                  <p className="text-gray-600 text-sm">
                    Select seats to see booking summary
                  </p>
                </div>
              )}

              {/* Bus Amenities */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Bus Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {bus.amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
