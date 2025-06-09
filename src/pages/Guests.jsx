import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import guestService from '../services/api/guestService';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await guestService.getAll();
      setGuests(data);
    } catch (err) {
      setError(err.message || 'Failed to load guests');
      toast.error('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  const handleGuestClick = (guest) => {
    setSelectedGuest(guest);
    setShowProfile(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-1/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                <div className="h-4 bg-surface-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Guests</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadGuests}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Guest Database</h1>
        <p className="text-gray-600">Manage guest profiles and stay history</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 mb-6">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search guests by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Guest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <ApperIcon name="Users" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">{guests.length}</h3>
              <p className="text-sm text-gray-500">Total Guests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <ApperIcon name="UserCheck" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                {guests.filter(g => g.stayHistory?.length > 1).length}
              </h3>
              <p className="text-sm text-gray-500">Returning Guests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3">
              <ApperIcon name="Star" className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                {guests.filter(g => g.stayHistory?.length >= 5).length}
              </h3>
              <p className="text-sm text-gray-500">VIP Guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guests List */}
      {filteredGuests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-12 text-center">
          <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'No guests have been registered yet'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200">
          <div className="p-4 border-b border-surface-200">
            <h2 className="text-lg font-semibold text-gray-900">Guest Directory</h2>
          </div>
          <div className="divide-y divide-surface-200">
            {filteredGuests.map((guest, index) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleGuestClick(guest)}
                className="p-6 hover:bg-surface-50 cursor-pointer transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {guest.firstName.charAt(0)}{guest.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 break-words">
                        {guest.firstName} {guest.lastName}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Mail" size={14} />
                          <span className="break-all">{guest.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Phone" size={14} />
                          <span>{guest.phone}</span>
                        </div>
                        {guest.stayHistory?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Calendar" size={14} />
                            <span>{guest.stayHistory.length} stay{guest.stayHistory.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {guest.stayHistory?.length >= 5 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        VIP
                      </span>
                    )}
                    <ApperIcon name="ChevronRight" className="text-gray-400" size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Guest Profile Modal */}
      {showProfile && selectedGuest && (
        <GuestProfileModal
          guest={selectedGuest}
          onClose={() => {
            setShowProfile(false);
            setSelectedGuest(null);
          }}
        />
      )}
    </div>
  );
};

const GuestProfileModal = ({ guest, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Guest Profile</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Guest Info */}
          <div className="bg-surface-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-medium">
                  {guest.firstName.charAt(0)}{guest.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {guest.firstName} {guest.lastName}
                </h2>
                {guest.stayHistory?.length >= 5 && (
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mt-1">
                    VIP Guest
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium break-all">{guest.email}</p>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <p className="font-medium">{guest.phone}</p>
              </div>
              <div>
                <span className="text-gray-500">ID Number:</span>
                <p className="font-medium">{guest.idNumber}</p>
              </div>
              <div>
                <span className="text-gray-500">Total Stays:</span>
                <p className="font-medium">{guest.stayHistory?.length || 0}</p>
              </div>
              {guest.address && (
                <div className="md:col-span-2">
                  <span className="text-gray-500">Address:</span>
                  <p className="font-medium break-words">{guest.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stay History */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Stay History</h4>
            {guest.stayHistory?.length > 0 ? (
              <div className="space-y-3">
                {guest.stayHistory.map((stay, index) => (
                  <div key={index} className="border border-surface-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Room {stay.roomNumber}</p>
                        <p className="text-sm text-gray-500">
                          {stay.checkIn} to {stay.checkOut}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${stay.totalAmount}</p>
                        <p className="text-sm text-gray-500">{stay.nights} night{stay.nights !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No stay history available</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Guests;