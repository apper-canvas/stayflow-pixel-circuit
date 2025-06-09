import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import roomService from '../services/api/roomService';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (roomId, newStatus) => {
    try {
      const updatedRoom = await roomService.update(roomId, { status: newStatus });
      setRooms(rooms.map(room => room.id === roomId ? updatedRoom : room));
      toast.success('Room status updated successfully');
    } catch (err) {
      toast.error('Failed to update room status');
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
      case 'vacant-dirty': return 'Cleaning Required';
      case 'maintenance': return 'Maintenance';
      case 'out-of-order': return 'Out of Order';
      default: return 'Unknown';
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesType = filterType === 'all' || room.type === filterType;
    return matchesStatus && matchesType;
  });

  const roomTypes = [...new Set(rooms.map(room => room.type))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-surface-200 rounded w-1/3"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                <div className="h-4 bg-surface-200 rounded w-2/3"></div>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Rooms</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadRooms}
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
        <h1 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Room Management</h1>
        <p className="text-gray-600">Monitor and update room status across the hotel</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="occupied">Occupied</option>
              <option value="vacant-clean">Available</option>
              <option value="vacant-dirty">Cleaning Required</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-order">Out of Order</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Rooms', value: rooms.length, color: 'bg-blue-500' },
          { label: 'Occupied', value: rooms.filter(r => r.status === 'occupied').length, color: 'bg-red-500' },
          { label: 'Available', value: rooms.filter(r => r.status === 'vacant-clean').length, color: 'bg-green-500' },
          { label: 'Cleaning', value: rooms.filter(r => r.status === 'vacant-dirty').length, color: 'bg-yellow-500' },
          { label: 'Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: 'bg-gray-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
            <div className={`w-8 h-8 ${stat.color} rounded-lg mb-2`}></div>
            <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-12 text-center">
          <ApperIcon name="Building" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-500">Try adjusting your filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Room {room.number}</h3>
                    <p className="text-gray-500">{room.type} • Floor {room.floor}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${getRoomStatusColor(room.status)}`}></div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{getRoomStatusText(room.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${room.price}/night</span>
                  </div>
                  {room.lastCleaned && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Cleaned:</span>
                      <span className="font-medium">{room.lastCleaned}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Update Status:</label>
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusUpdate(room.id, e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  >
                    <option value="occupied">Occupied</option>
                    <option value="vacant-clean">Available (Clean)</option>
                    <option value="vacant-dirty">Cleaning Required</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out-of-order">Out of Order</option>
                  </select>
                </div>

                {room.status === 'vacant-dirty' && (
                  <button
                    onClick={() => handleStatusUpdate(room.id, 'vacant-clean')}
                    className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 text-sm"
                  >
                    Mark as Clean
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;