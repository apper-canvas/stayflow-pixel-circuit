import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const RoomCard = ({ room, onClick, statusColor, statusText }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(room)}
      className={`relative p-3 rounded-lg cursor-pointer transition-all duration-150 ${statusColor} hover:shadow-md`}
    >
      <div className="text-white text-center">
        <div className="text-lg font-semibold">{room.number}</div>
        <div className="text-xs opacity-90">{room.type}</div>
        <div className="text-xs opacity-75 mt-1">{statusText}</div>
      </div>

      {room.currentGuestId && (
        <div className="absolute top-1 right-1">
          <ApperIcon name="User" className="w-3 h-3 text-white opacity-75" />
        </div>
      )}
    </motion.div>
  );
};

export default RoomCard;