import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  MagnifyingGlassIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { cities, popularRoutes } from '../data/mockData';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    passengers: 1
  });

  const handleSwapCities = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchData.from || !searchData.to) {
      toast.error('Please select both departure and destination cities');
      return;
    }

    if (searchData.from === searchData.to) {
      toast.error('Departure and destination cities cannot be the same');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Searching for buses...');
    
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success('Found available buses!');
      
      const params = new URLSearchParams({
        from: searchData.from,
        to: searchData.to,
        date: searchData.date,
        passengers: searchData.passengers.toString()
      });
      
      navigate(`/search?${params.toString()}`);
    }, 1500);
  };

  const handleQuickRoute = (route) => {
    setSearchData(prev => ({
      ...prev,
      from: route.from,
      to: route.to
    }));
  };

  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "100% secure booking with verified bus operators",
      color: "from-green-400 to-green-600"
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Live bus tracking and instant booking confirmation",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <CurrencyRupeeIcon className="w-8 h-8" />,
      title: "Best Prices",
      description: "Compare prices and get the best deals on bus tickets",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Premium Experience",
      description: "Comfortable seats, AC buses, and excellent service",
      color: "from-orange-400 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Your Journey
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Book bus tickets with ease. Compare prices, choose your seats, and travel comfortably across India.
              </p>
            </motion.div>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Cities Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* From City */}
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPinIcon className="w-4 h-4 inline mr-1" />
                        From
                      </label>
                      <select
                        value={searchData.from}
                        onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select departure city</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.name}>
                            {city.name}, {city.state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Swap Button */}
                    <div className="md:col-span-2 flex justify-center">
                      <motion.button
                        type="button"
                        onClick={handleSwapCities}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                      >
                        <ArrowsRightLeftIcon className="w-5 h-5 text-blue-600" />
                      </motion.button>
                    </div>

                    {/* To City */}
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPinIcon className="w-4 h-4 inline mr-1" />
                        To
                      </label>
                      <select
                        value={searchData.to}
                        onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select destination city</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.name}>
                            {city.name}, {city.state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date and Passengers Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                        Departure Date
                      </label>
                      <input
                        type="date"
                        value={searchData.date}
                        onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Passengers */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passengers
                      </label>
                      <select
                        value={searchData.passengers}
                        onChange={(e) => setSearchData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Passenger' : 'Passengers'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        <span>Search Buses</span>
                      </motion.button>
                    </div>
                  </div>
                </form>

                {/* Popular Routes */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Popular routes:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularRoutes.map((route, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickRoute(route)}
                        className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors duration-200"
                      >
                        {route.from} → {route.to}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {[
              { number: "10,000+", label: "Happy Customers" },
              { number: "500+", label: "Bus Partners" },
              { number: "100+", label: "Cities Connected" },
              { number: "24/7", label: "Customer Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-20"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of bus booking with our innovative platform designed for modern travelers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
