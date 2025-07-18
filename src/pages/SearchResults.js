import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ClockIcon, 
  MapPinIcon, 
  StarIcon,
  WifiIcon,
  BoltIcon,
  TvIcon,
  ShieldCheckIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { generateBusSchedules } from '../data/mockData';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    busType: 'all',
    priceRange: [0, 5000],
    departureTime: 'all',
    rating: 0
  });
  const [sortBy, setSortBy] = useState('departure');

  const searchData = {
    from: searchParams.get('from'),
    to: searchParams.get('to'),
    date: searchParams.get('date'),
    passengers: parseInt(searchParams.get('passengers')) || 1
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockBuses = generateBusSchedules(searchData.from, searchData.to, searchData.date);
      setBuses(mockBuses);
      setLoading(false);
    }, 1500);
  }, [searchData.from, searchData.to, searchData.date]);

  const filteredAndSortedBuses = buses
    .filter(bus => {
      // Bus type filter
      if (filters.busType !== 'all' && !bus.busType.name.toLowerCase().includes(filters.busType)) {
        return false;
      }
      
      // Price range filter
      if (bus.price < filters.priceRange[0] || bus.price > filters.priceRange[1]) {
        return false;
      }
      
      // Departure time filter
      if (filters.departureTime !== 'all') {
        const hour = parseInt(bus.departureTime.split(':')[0]);
        switch (filters.departureTime) {
          case 'morning':
            if (hour < 6 || hour >= 12) return false;
            break;
          case 'afternoon':
            if (hour < 12 || hour >= 18) return false;
            break;
          case 'evening':
            if (hour < 18 || hour >= 24) return false;
            break;
          case 'night':
            if (hour >= 6 && hour < 18) return false;
            break;
          default:
            // Handle unexpected departure time filter
            break;
        }
      }
      
      // Rating filter
      if (parseFloat(bus.rating) < filters.rating) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        default:
          return 0;
      }
    });

  const handleSelectSeat = (busId) => {
    toast.success('Redirecting to seat selection...');
    setTimeout(() => {
      navigate(`/seat-selection/${busId}`);
    }, 1000);
  };

  const getAmenityIcon = (amenityName) => {
    switch (amenityName.toLowerCase()) {
      case 'wifi':
        return <WifiIcon className="w-4 h-4" />;
      case 'charging point':
        return <BoltIcon className="w-4 h-4" />;
      case 'entertainment':
        return <TvIcon className="w-4 h-4" />;
      default:
        return <ShieldCheckIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 mb-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchData.from} → {searchData.to}
          </h1>
          <p className="text-gray-600">
            {format(new Date(searchData.date), 'EEEE, MMMM d, yyyy')} • {searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredAndSortedBuses.length} buses found
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <div className="flex items-center mb-6">
                <FunnelIcon className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="departure">Departure Time</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Bus Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Type
                </label>
                <select
                  value={filters.busType}
                  onChange={(e) => setFilters(prev => ({ ...prev, busType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="ac">AC Buses</option>
                  <option value="non-ac">Non-AC Buses</option>
                  <option value="sleeper">Sleeper Buses</option>
                  <option value="seater">Seater Buses</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Departure Time */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Time
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Any Time' },
                    { value: 'morning', label: 'Morning (6AM - 12PM)' },
                    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
                    { value: 'evening', label: 'Evening (6PM - 12AM)' },
                    { value: 'night', label: 'Night (12AM - 6AM)' }
                  ].map(time => (
                    <label key={time.value} className="flex items-center">
                      <input
                        type="radio"
                        name="departureTime"
                        value={time.value}
                        checked={filters.departureTime === time.value}
                        onChange={(e) => setFilters(prev => ({ ...prev, departureTime: e.target.value }))}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{time.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bus Listings */}
          <div className="lg:col-span-3">
            {filteredAndSortedBuses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-12 text-center shadow-sm"
              >
                <div className="text-6xl mb-4">🚌</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No buses found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedBuses.map((bus, index) => (
                  <motion.div
                    key={bus.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        {/* Bus Info */}
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center mb-2">
                            <div className="text-2xl mr-3">{bus.operator.logo}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {bus.operator.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {bus.busType.name} • {bus.busNumber}
                              </p>
                            </div>
                          </div>

                          {/* Time and Duration */}
                          <div className="flex items-center mb-3">
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900">
                                {bus.departureTime}
                              </div>
                              <div className="text-sm text-gray-600">
                                {searchData.from}
                              </div>
                            </div>

                            <div className="flex-1 mx-4">
                              <div className="flex items-center">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                  {bus.duration}
                                </div>
                                <div className="flex-1 h-px bg-gray-300"></div>
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900">
                                {bus.arrivalTime}
                              </div>
                              <div className="text-sm text-gray-600">
                                {searchData.to}
                              </div>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {bus.amenities.slice(0, 4).map((amenity, idx) => (
                              <div
                                key={idx}
                                className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                              >
                                {getAmenityIcon(amenity.name)}
                                <span className="ml-1">{amenity.name}</span>
                              </div>
                            ))}
                            {bus.amenities.length > 4 && (
                              <div className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{bus.amenities.length - 4} more
                              </div>
                            )}
                          </div>

                          {/* Rating and Reviews */}
                          <div className="flex items-center">
                            <div className="flex items-center mr-4">
                              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {bus.rating}
                              </span>
                              <span className="text-sm text-gray-600 ml-1">
                                ({bus.reviews} reviews)
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {bus.availableSeats} seats available
                            </div>
                          </div>
                        </div>

                        {/* Price and Book Button */}
                        <div className="lg:text-right">
                          <div className="mb-2">
                            {bus.originalPrice > bus.price && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{bus.originalPrice}
                              </div>
                            )}
                            <div className="text-2xl font-bold text-gray-900">
                              ₹{bus.price}
                            </div>
                            {bus.discount > 0 && (
                              <div className="text-sm text-green-600">
                                {bus.discount}% off
                              </div>
                            )}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSelectSeat(bus.id)}
                            className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            Select Seats
                          </motion.button>

                          <button
                            onClick={() => navigate(`/track-bus/${bus.id}`)}
                            className="w-full lg:w-auto mt-2 px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                          >
                            Track Bus
                          </button>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <strong>Pickup Points:</strong>
                            <ul className="mt-1">
                              {bus.pickupPoints.slice(0, 2).map((point, idx) => (
                                <li key={idx} className="flex items-center">
                                  <MapPinIcon className="w-3 h-3 mr-1" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Drop Points:</strong>
                            <ul className="mt-1">
                              {bus.dropPoints.slice(0, 2).map((point, idx) => (
                                <li key={idx} className="flex items-center">
                                  <MapPinIcon className="w-3 h-3 mr-1" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          <ClockIcon className="w-3 h-3 inline mr-1" />
                          {bus.cancellationPolicy}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
