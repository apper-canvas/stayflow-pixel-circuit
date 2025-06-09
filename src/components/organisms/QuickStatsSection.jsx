import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const QuickStatsSection = ({ rooms, reservations }) => {
  const occupiedRoomsCount = rooms.filter(r => r.status === 'occupied').length;
  const availableRoomsCount = rooms.filter(r => r.status === 'vacant-clean').length;
  const today = new Date().toISOString().split('T')[0];
  const todayArrivalsCount = reservations.filter(r => r.checkIn === today).length;
  const todayDeparturesCount = reservations.filter(r => r.checkOut === today).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatCard
        iconName="CheckCircle"
        iconBgColor="bg-green-100"
        iconTextColor="text-green-600"
        count={occupiedRoomsCount}
        label="Occupied Rooms"
      />
      <StatCard
        iconName="Home"
        iconBgColor="bg-blue-100"
        iconTextColor="text-blue-600"
        count={availableRoomsCount}
        label="Available Rooms"
      />
      <StatCard
        iconName="Clock"
        iconBgColor="bg-yellow-100"
        iconTextColor="text-yellow-600"
        count={todayArrivalsCount}
        label="Today's Arrivals"
      />
      <StatCard
        iconName="LogOut"
        iconBgColor="bg-purple-100"
        iconTextColor="text-purple-600"
        count={todayDeparturesCount}
        label="Today's Departures"
      />
    </div>
  );
};

export default QuickStatsSection;