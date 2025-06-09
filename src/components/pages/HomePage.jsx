import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import roomService from '@/services/api/roomService';
import reservationService from '@/services/api/reservationService';
import guestService from '@/services/api/guestService';

import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorState from '@/components/organisms/ErrorState';
import QuickStatsSection from '@/components/organisms/QuickStatsSection';
import RoomGrid from '@/components/organisms/RoomGrid';
import CheckInModalOrganism from '@/components/organisms/CheckInModalOrganism';
import StatusUpdateModalOrganism from '@/components/organisms/StatusUpdateModalOrganism';

const HomePage = () => {
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
        totalPrice: updatedRoom.price * Math.ceil((new Date(guestData.checkOut) - new Date()) / (1000 * 60 * 60 * 24)),
        notes: guestData.notes || ''
      };
      
      await reservationService.create(reservation);

      // Update state
      setRooms(prevRooms => prevRooms.map(r => r.id === selectedRoom.id ? updatedRoom : r));
      setGuests(prevGuests => [...prevGuests, newGuest]);
      
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

      setRooms(prevRooms => prevRooms.map(r => r.id === selectedRoom.id ? updatedRoom : r));
      setStatusUpdateModalOpen(false);
      setSelectedRoom(null);
      toast.success(`Room ${selectedRoom.number} status updated`);
    } catch (err) {
      toast.error('Failed to update room status');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState errorMessage={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6">
      <QuickStatsSection rooms={rooms} reservations={reservations} />
      <RoomGrid rooms={rooms} onRoomClick={handleRoomClick} />

      <CheckInModalOrganism
        room={selectedRoom}
        isOpen={checkInModalOpen}
        onClose={() => {
          setCheckInModalOpen(false);
          setSelectedRoom(null);
        }}
        onSubmit={handleCheckIn}
      />

      <StatusUpdateModalOrganism
        room={selectedRoom}
        isOpen={statusUpdateModalOpen}
        onClose={() => {
          setStatusUpdateModalOpen(false);
          setSelectedRoom(null);
        }}
        onSubmit={handleStatusUpdate}
      />
    </div>
  );
};

export default HomePage;