import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ServerIcon
} from '@heroicons/react/24/outline';
import { healthCheck } from '../services/api';

const ApiDemo = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      setApiStatus('checking');
      const health = await healthCheck();
      
      if (health) {
        setHealthData(health);
        setApiStatus('connected');
      } else {
        setApiStatus('disconnected');
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus('disconnected');
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'connected':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'disconnected':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case 'checking':
        return <ClockIcon className="w-6 h-6 text-yellow-500 animate-spin" />;
      default:
        return <ServerIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'connected':
        return 'bg-green-50 border-green-200';
      case 'disconnected':
        return 'bg-red-50 border-red-200';
      case 'checking':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'connected':
        return 'Backend API Connected';
      case 'disconnected':
        return 'Backend API Disconnected';
      case 'checking':
        return 'Checking API Status...';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border-2 ${getStatusColor()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              {getStatusText()}
            </h3>
            {healthData && (
              <p className="text-xs text-gray-600">
                Uptime: {Math.floor(healthData.uptime / 60)}m {Math.floor(healthData.uptime % 60)}s
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={checkApiHealth}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {apiStatus === 'connected' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-medium text-gray-700">Environment:</span>
              <span className="ml-1 text-gray-600">{healthData?.environment}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="ml-1 text-green-600">{healthData?.status}</span>
            </div>
          </div>
          
          <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-800">
            🎉 <strong>Backend Features Available:</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li>User Authentication (Register/Login)</li>
              <li>Booking History with SQLite Database</li>
              <li>Real-time Features with Socket.IO</li>
              <li>RESTful API Endpoints</li>
            </ul>
          </div>
        </motion.div>
      )}

      {apiStatus === 'disconnected' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-red-200"
        >
          <div className="p-2 bg-red-100 rounded text-xs text-red-800">
            ⚠️ <strong>Backend API is not running.</strong>
            <p className="mt-1">
              To enable backend features, run: <code className="bg-red-200 px-1 rounded">npm run dev</code> in the backend folder.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ApiDemo;
