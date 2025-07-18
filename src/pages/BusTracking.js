import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { generateBusSchedules, getDistance } from '../data/mockData';
import EnhancedMap from '../components/Maps/EnhancedMap';

const BusTracking = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    // Simulate API call to get bus details with real data
    setTimeout(() => {
      const mockBuses = generateBusSchedules('Mumbai', 'Pune', '2024-01-15');
      const selectedBus = mockBuses.find(b => b.id === busId) || mockBuses[0];
      const routeDistance = getDistance('Mumbai', 'Pune') || 149;

      setBus(selectedBus);
      setDistance(routeDistance);
      setCurrentLocation(selectedBus.currentLocation);
      setLoading(false);
    }, 1000);

    // Simulate real-time location updates
    const interval = setInterval(() => {
      setCurrentLocation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [busId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bus location...</p>
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
            Back
          </button>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-3xl mr-4">{bus.operator.logo}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Track Bus: {bus.busNumber}
                  </h1>
                  <p className="text-gray-600">
                    {bus.operator.name} • {bus.busType.name}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center mr-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Live Tracking</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {currentLocation?.status || 'On Route'}
                </div>
                <div className="text-sm text-gray-600">
                  ETA: {currentLocation?.estimatedArrival || '2h 30m'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Map Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <EnhancedMap
                fromCity="Mumbai"
                toCity="Pune"
                currentLocation={currentLocation}
                busNumber={bus.busNumber}
                distance={distance}
                onLocationUpdate={setCurrentLocation}
              />
            </motion.div>
          </div>

          {/* Bus Details & Status */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Journey Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Departed</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {bus.departureTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm text-gray-600">Current Location</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {currentLocation?.nextStop || 'En Route'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Expected Arrival</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {bus.arrivalTime}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="bg-blue-600 h-2 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Driver</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Driver</div>
                      <div className="text-sm text-gray-600">+91 98765 43210</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Conductor</div>
                      <div className="text-sm text-gray-600">+91 98765 43211</div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200">
                  Call Driver
                </button>
              </motion.div>

              {/* Alerts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
              >
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Traffic Alert</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Slight delay expected due to traffic. ETA updated to {currentLocation?.estimatedArrival}.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Next Stops */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Stops</h3>
                
                <div className="space-y-3">
                  {bus.pickupPoints?.slice(1, 3).map((stop, index) => (
                    <div key={index} className="flex items-center">
                      <MapPinIcon className="w-4 h-4 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{stop}</div>
                        <div className="text-xs text-gray-500">
                          ETA: {index === 0 ? '30 min' : '1h 15min'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTracking;
