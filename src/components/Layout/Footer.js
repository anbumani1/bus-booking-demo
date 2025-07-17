import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Cancellation', href: '#' },
      { name: 'Refund Policy', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Disclaimer', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🚌</span>
              <span className="text-xl font-bold">BusBooking Demo</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Your trusted partner for comfortable and affordable bus travel across India. 
              Book tickets, track buses, and travel with confidence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-400">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>1800-123-4567</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                <span>support@busbooking.com</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-gray-400 mb-4 md:mb-0">
              <span>© {currentYear} BusBooking Demo. Made with</span>
              <HeartIcon className="w-4 h-4 mx-1 text-red-500" />
              <span>for travelers</span>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-xs font-bold">
                    {social.charAt(0)}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <p className="text-yellow-200 text-sm text-center">
              🚌 This is a demo application showcasing interactive bus booking UI with mock data. 
              No real bookings are processed.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
