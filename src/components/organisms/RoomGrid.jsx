import React from 'react';
import RoomCard from '@/components/molecules/RoomCard';

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

const RoomGrid = ({ rooms, onRoomClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200">
      <div className="p-4 border-b border-surface-200">
        <h2 className="text-lg font-semibold text-gray-900">Room Status Overview</h2>
        <p className="text-sm text-gray-500">Click on any room to update status or check in guests</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={onRoomClick}
              statusColor={getRoomStatusColor(room.status)}
              statusText={getRoomStatusText(room.status)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomGrid;