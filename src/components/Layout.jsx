import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { routes } from '../config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    routes.dashboard,
    routes.reservations,
    routes.rooms,
    routes.guests,
    routes.reports
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 lg:px-6 z-40">
        <div className="flex items-center justify-between h-full max-w-full">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <ApperIcon name="Building2" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-semibold text-lg text-gray-900">StayFlow</h1>
              <p className="text-xs text-gray-500">Grand Plaza Hotel</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-primary bg-primary/10 border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary hover:bg-surface-50'
                  }`
                }
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="relative">
                <ApperIcon name="Bell" className="w-5 h-5 text-gray-600 cursor-pointer hover:text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">SM</span>
                </div>
                <span className="text-sm text-gray-700">Sarah Manager</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-50"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-surface-200 mt-4 pt-4 space-y-2"
            >
              {navigationItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-primary hover:bg-surface-50'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-surface-50">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;