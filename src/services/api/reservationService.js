import { delay } from '../index';

// Import mock data
let reservations = [
  {
    "id": "res-001",
    "guestId": "guest-001",
    "roomId": "room-001", 
    "checkIn": "2024-01-15",
    "checkOut": "2024-01-18",
    "status": "checked-in",
    "totalPrice": 360,
    "notes": "Late check-in requested"
  },
  {
    "id": "res-002",
    "guestId": "guest-002",
    "roomId": "room-005",
    "checkIn": "2024-01-16",
    "checkOut": "2024-01-20", 
    "status": "checked-in",
    "totalPrice": 480,
    "notes": "Anniversary celebration"
  },
  {
    "id": "res-003",
    "guestId": "guest-003",
    "roomId": "room-007",
    "checkIn": "2024-01-14",
    "checkOut": "2024-01-19",
    "status": "checked-in",
    "totalPrice": 1500,
    "notes": "VIP guest - complimentary upgrade"
  },
  {
    "id": "res-004",
    "guestId": "guest-004",
    "roomId": "room-002",
    "checkIn": "2024-01-17",
    "checkOut": "2024-01-20",
    "status": "confirmed",
    "totalPrice": 360,
    "notes": ""
  },
  {
    "id": "res-005",
    "guestId": "guest-005",
    "roomId": "room-006",
    "checkIn": "2024-01-18",
    "checkOut": "2024-01-22",
    "status": "confirmed",
    "totalPrice": 720,
    "notes": "Business traveler"
  },
  {
    "id": "res-006",
    "guestId": "guest-001",
    "roomId": "room-003",
    "checkIn": "2024-01-10",
    "checkOut": "2024-01-13",
    "status": "checked-out",
    "totalPrice": 540,
    "notes": "Previous stay - satisfied customer"
  },
  {
    "id": "res-007",
    "guestId": "guest-002",
    "roomId": "room-008",
    "checkIn": "2024-01-20",
    "checkOut": "2024-01-23",
    "status": "confirmed",
    "totalPrice": 360,
    "notes": "Repeat guest"
  }
];

const reservationService = {
  async getAll() {
    await delay(300);
    return [...reservations];
  },

  async getById(id) {
    await delay(200);
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    return { ...reservation };
  },

  async create(reservationData) {
    await delay(400);
    const newReservation = {
      id: `res-${Date.now()}`,
      ...reservationData
    };
    reservations.push(newReservation);
    return { ...newReservation };
  },

  async update(id, updates) {
    await delay(300);
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    
    reservations[index] = { ...reservations[index], ...updates };
    return { ...reservations[index] };
  },

  async delete(id) {
    await delay(300);
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    
    const deletedReservation = reservations[index];
    reservations.splice(index, 1);
    return { ...deletedReservation };
  }
};

export default reservationService;