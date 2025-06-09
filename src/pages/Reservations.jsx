import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import reservationService from '../services/api/reservationService';
import guestService from '../services/api/guestService';
import roomService from '../services/api/roomService';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reservationsData, guestsData, roomsData] = await Promise.all([
        reservationService.getAll(),
        guestService.getAll(),
        roomService.getAll()
      ]);
      setReservations(reservationsData);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch (err) {
      setError(err.message || 'Failed to load reservations');
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const getGuestName = (guestId) => {
    const guest = guests.find(g => g.id === guestId);
    return guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest';
  };

  const getRoomNumber = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.number : 'N/A';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      const updatedReservation = await reservationService.update(reservationId, {
        status: newStatus
      });
      setReservations(reservations.map(r => 
        r.id === reservationId ? updatedReservation : r
      ));
      toast.success('Reservation status updated');
    } catch (err) {
      toast.error('Failed to update reservation status');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = searchTerm === '' || 
      getGuestName(reservation.guestId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoomNumber(reservation.roomId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Reservations</h3>
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
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Reservations</h1>
        <p className="text-gray-600">Manage all hotel reservations and bookings</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by guest name, confirmation number, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-12 text-center">
          <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria'
              : 'No reservations have been made yet'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 break-words">
                        {getGuestName(reservation.guestId)}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Home" size={16} />
                        <span>Room {getRoomNumber(reservation.roomId)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Calendar" size={16} />
                        <span>{reservation.checkIn} to {reservation.checkOut}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="DollarSign" size={16} />
                        <span>${reservation.totalPrice}</span>
                      </div>
                    </div>
                    
                    {reservation.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 break-words">{reservation.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2">
                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'checked-in')}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-150"
                      >
                        Check In
                      </button>
                    )}
                    {reservation.status === 'checked-in' && (
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'checked-out')}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-150"
                      >
                        Check Out
                      </button>
                    )}
                    {(reservation.status === 'confirmed' || reservation.status === 'checked-in') && (
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-150"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;