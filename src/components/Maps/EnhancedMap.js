import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  ClockIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const EnhancedMap = ({ 
  fromCity, 
  toCity, 
  currentLocation, 
  busNumber,
  distance,
  onLocationUpdate 
}) => {
  const [busPosition, setBusPosition] = useState(currentLocation);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [trafficStatus, setTrafficStatus] = useState('normal');

  // Simulate real-time location updates
  useEffect(() => {
    if (!currentLocation) return;

    const interval = setInterval(() => {
      setBusPosition(prev => {
        if (!prev) return currentLocation;
        
        // Simulate movement along route
        const newPosition = {
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001,
          speed: Math.floor(Math.random() * 20) + 55,
          lastUpdated: new Date().toLocaleTimeString()
        };
        
        if (onLocationUpdate) {
          onLocationUpdate(newPosition);
        }
        
        return newPosition;
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [currentLocation, onLocationUpdate]);

  // Initialize map
  useEffect(() => {
    setTimeout(() => {
      setMapLoaded(true);
      setTrafficStatus(Math.random() > 0.8 ? 'heavy' : Math.random() > 0.5 ? 'moderate' : 'light');
    }, 1500);
  }, []);

  const getTrafficColor = (status) => {
    switch (status) {
      case 'heavy': return '#EF4444';
      case 'moderate': return '#F59E0B';
      case 'light': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Departed': return '#10B981';
      case 'On Route': return '#3B82F6';
      case 'Arriving Soon': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Map Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TruckIcon className="w-6 h-6 mr-2" />
            <div>
              <h3 className="font-semibold">Live Bus Tracking</h3>
              <p className="text-blue-100 text-sm">{busNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
            <p className="text-blue-100 text-xs">
              {distance} km route
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading real-time map...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Route Visualization */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Main Route Path */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                d="M 60 320 Q 180 220 300 180 Q 420 140 540 100 Q 620 80 720 60"
                stroke={getTrafficColor(trafficStatus)}
                strokeWidth="6"
                strokeDasharray="15,8"
                fill="none"
                className="drop-shadow-lg"
              />
              
              {/* Traffic Congestion Indicators */}
              {trafficStatus === 'heavy' && (
                <>
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    cx="250"
                    cy="200"
                    r="12"
                    fill="#EF4444"
                    className="opacity-60"
                  />
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    cx="450"
                    cy="120"
                    r="10"
                    fill="#F59E0B"
                    className="opacity-50"
                  />
                </>
              )}
            </svg>

            {/* Start Point - Enhanced */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute bottom-16 left-16 flex items-center"
            >
              <div className="relative">
                <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-xl"></div>
                <div className="absolute inset-0 w-6 h-6 bg-green-400 rounded-full animate-ping opacity-40"></div>
              </div>
              <div className="ml-3 bg-white px-4 py-2 rounded-xl shadow-lg border">
                <div className="text-sm font-bold text-gray-900">{fromCity}</div>
                <div className="text-xs text-green-600 font-medium">Departure Point</div>
              </div>
            </motion.div>

            {/* End Point - Enhanced */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              className="absolute top-16 right-16 flex items-center"
            >
              <div className="relative">
                <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-xl"></div>
                <div className="absolute inset-0 w-6 h-6 bg-red-400 rounded-full animate-ping opacity-40"></div>
              </div>
              <div className="ml-3 bg-white px-4 py-2 rounded-xl shadow-lg border">
                <div className="text-sm font-bold text-gray-900">{toCity}</div>
                <div className="text-xs text-red-600 font-medium">Destination</div>
              </div>
            </motion.div>

            {/* Current Bus Location - Enhanced */}
            {busPosition && (
              <motion.div
                animate={{
                  x: [0, 15, 0],
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute"
                style={{ 
                  left: '50%', 
                  top: '45%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative">
                  {/* Enhanced Bus Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                    <span className="text-white text-xl">🚌</span>
                  </div>
                  
                  {/* Enhanced Bus Info Popup */}
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-xl shadow-xl border-2 border-blue-100 whitespace-nowrap"
                  >
                    <div className="text-sm font-bold text-gray-900">{busNumber}</div>
                    <div className="text-xs text-blue-600 font-medium">
                      {busPosition.speed || 65} km/h • {busPosition.status || 'On Route'}
                    </div>
                    <div className="text-xs text-gray-500">
                      ETA: {busPosition.estimatedArrival || '2h 30m'}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </motion.div>

                  {/* Enhanced Pulse Animation */}
                  <div className="absolute inset-0 w-14 h-14 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 w-10 h-10 bg-blue-300 rounded-full animate-ping opacity-30 animation-delay-500"></div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Intermediate Stops */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute"
              style={{ left: '28%', top: '68%' }}
            >
              <div className="w-4 h-4 bg-yellow-500 rounded-full border-3 border-white shadow-lg"></div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-100 px-2 py-1 rounded-lg text-xs font-medium text-yellow-800 shadow">
                Rest Stop
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4 }}
              className="absolute"
              style={{ left: '68%', top: '28%' }}
            >
              <div className="w-4 h-4 bg-orange-500 rounded-full border-3 border-white shadow-lg"></div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-orange-100 px-2 py-1 rounded-lg text-xs font-medium text-orange-800 shadow">
                Fuel Stop
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Enhanced Footer with Real-time Info */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2 animate-pulse"
              style={{ backgroundColor: getStatusColor(busPosition?.status) }}
            ></div>
            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="text-sm font-semibold">{busPosition?.status || 'On Route'}</div>
            </div>
          </div>

          <div className="flex items-center">
            <SignalIcon className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Speed</div>
              <div className="text-sm font-semibold">{busPosition?.speed || 65} km/h</div>
            </div>
          </div>

          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <div className="text-xs text-gray-500">ETA</div>
              <div className="text-sm font-semibold">{busPosition?.estimatedArrival || '2h 30m'}</div>
            </div>
          </div>

          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Distance</div>
              <div className="text-sm font-semibold">{distance} km</div>
            </div>
          </div>
        </div>

        {/* Enhanced Traffic Alert */}
        {trafficStatus === 'heavy' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-800">Heavy Traffic Alert</div>
                <div className="text-sm text-red-700">
                  Congestion detected on route. Expected delay: 15-20 minutes. Driver has been notified.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {trafficStatus === 'light' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-start">
              <div className="w-5 h-5 bg-green-500 rounded-full mr-2 mt-1"></div>
              <div>
                <div className="text-sm font-semibold text-green-800">Clear Roads</div>
                <div className="text-sm text-green-700">
                  Traffic is flowing smoothly. Bus is on schedule and may arrive early!
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMap;
