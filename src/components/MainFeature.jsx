import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import roomService from '../services/api/roomService';
import reservationService from '../services/api/reservationService';
import guestService from '../services/api/guestService';

const MainFeature = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [statusUpdateModalOpen, setStatusUpdateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomsData, reservationsData, guestsData] = await Promise.all([
        roomService.getAll(),
        reservationService.getAll(),
        guestService.getAll()
      ]);
      setRooms(roomsData);
      setReservations(reservationsData);
      setGuests(guestsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load hotel data');
    } finally {
      setLoading(false);
    }
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-red-500';
      case 'vacant-clean': return 'bg-green-500';
      case 'vacant-dirty': return 'bg-yellow-500';
      case 'maintenance': return 'bg-gray-500';
      case 'out-of-order': return 'bg-red-700';
      default: return 'bg-gray-400';
    }
  };

  const getRoomStatusText = (status) => {
    switch (status) {
      case 'occupied': return 'Occupied';
      case 'vacant-clean': return 'Available';
      case 'vacant-dirty': return 'Cleaning';
      case 'maintenance': return 'Maintenance';
      case 'out-of-order': return 'Out of Order';
      default: return 'Unknown';
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    if (room.status === 'vacant-clean') {
      setCheckInModalOpen(true);
    } else {
      setStatusUpdateModalOpen(true);
    }
  };

  const handleCheckIn = async (guestData) => {
    try {
      // Create new guest
      const newGuest = await guestService.create(guestData);
      
      // Update room status
      const updatedRoom = await roomService.update(selectedRoom.id, {
        status: 'occupied',
        currentGuestId: newGuest.id
      });

      // Create reservation
      const reservation = {
        guestId: newGuest.id,
        roomId: selectedRoom.id,
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: guestData.checkOut,
        status: 'checked-in',
        totalPrice: selectedRoom.price * Math.ceil((new Date(guestData.checkOut) - new Date()) / (1000 * 60 * 60 * 24)),
        notes: guestData.notes || ''
      };
      
      await reservationService.create(reservation);

      // Update state
      setRooms(rooms.map(r => r.id === selectedRoom.id ? updatedRoom : r));
      setGuests([...guests, newGuest]);
      
      setCheckInModalOpen(false);
      setSelectedRoom(null);
      toast.success(`Guest checked into room ${selectedRoom.number}`);
    } catch (err) {
      toast.error('Failed to check in guest');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedRoom = await roomService.update(selectedRoom.id, {
        status: newStatus,
        currentGuestId: newStatus === 'occupied' ? selectedRoom.currentGuestId : null
      });

      setRooms(rooms.map(r => r.id === selectedRoom.id ? updatedRoom : r));
      setStatusUpdateModalOpen(false);
      setSelectedRoom(null);
      toast.success(`Room ${selectedRoom.number} status updated`);
    } catch (err) {
      toast.error('Failed to update room status');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bg-surface-100 rounded-lg h-20 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                {rooms.filter(r => r.status === 'occupied').length}
              </h3>
              <p className="text-sm text-gray-500">Occupied Rooms</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <ApperIcon name="Home" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                {rooms.filter(r => r.status === 'vacant-clean').length}
              </h3>
              <p className="text-sm text-gray-500">Available Rooms</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3">
              <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                {reservations.filter(r => r.checkIn === new Date().toISOString().split('T')[0]).length}
              </h3>
              <p className="text-sm text-gray-500">Today's Arrivals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3">
              <ApperIcon name="LogOut" className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                {reservations.filter(r => r.checkOut === new Date().toISOString().split('T')[0]).length}
              </h3>
              <p className="text-sm text-gray-500">Today's Departures</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200">
        <div className="p-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-gray-900">Room Status Overview</h2>
          <p className="text-sm text-gray-500">Click on any room to update status or check in guests</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoomClick(room)}
                className={`relative p-3 rounded-lg cursor-pointer transition-all duration-150 ${getRoomStatusColor(room.status)} hover:shadow-md`}
              >
                <div className="text-white text-center">
                  <div className="text-lg font-semibold">{room.number}</div>
                  <div className="text-xs opacity-90">{room.type}</div>
                  <div className="text-xs opacity-75 mt-1">{getRoomStatusText(room.status)}</div>
                </div>
                
                {room.currentGuestId && (
                  <div className="absolute top-1 right-1">
                    <ApperIcon name="User" className="w-3 h-3 text-white opacity-75" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      {checkInModalOpen && (
        <CheckInModal
          room={selectedRoom}
          onClose={() => {
            setCheckInModalOpen(false);
            setSelectedRoom(null);
          }}
          onSubmit={handleCheckIn}
        />
      )}

      {/* Status Update Modal */}
      {statusUpdateModalOpen && (
        <StatusUpdateModal
          room={selectedRoom}
          onClose={() => {
            setStatusUpdateModalOpen(false);
            setSelectedRoom(null);
          }}
          onSubmit={handleStatusUpdate}
        />
      )}
    </div>
  );
};

const CheckInModal = ({ room, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    address: '',
    checkOut: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
            <h3 className="text-xl font-semibold text-gray-900">
              Check-in to Room {room.number}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number *
              </label>
              <input
                type="text"
                required
                value={formData.idNumber}
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.checkOut}
                onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Special requests or notes..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-surface-300 rounded-lg hover:bg-surface-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150"
              >
                Check In
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatusUpdateModal = ({ room, onClose, onSubmit }) => {
  const [selectedStatus, setSelectedStatus] = useState(room.status);

  const statusOptions = [
    { value: 'occupied', label: 'Occupied', color: 'bg-red-500' },
    { value: 'vacant-clean', label: 'Available (Clean)', color: 'bg-green-500' },
    { value: 'vacant-dirty', label: 'Cleaning Required', color: 'bg-yellow-500' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-gray-500' },
    { value: 'out-of-order', label: 'Out of Order', color: 'bg-red-700' }
  ];

  const handleSubmit = () => {
    onSubmit(selectedStatus);
  };

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
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Update Room {room.number} Status
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-150 ${
                  selectedStatus === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-300 hover:border-surface-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-surface-300 rounded-lg hover:bg-surface-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150"
            >
              Update Status
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MainFeature;