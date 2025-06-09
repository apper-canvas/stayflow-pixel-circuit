import { delay } from '../index';

// Import mock data
let rooms = [
  {
    "id": "room-001",
    "number": "101",
    "type": "Standard",
    "floor": 1,
    "status": "occupied",
    "currentGuestId": "guest-001",
    "price": 120,
    "lastCleaned": "2024-01-15"
  },
  {
    "id": "room-002", 
    "number": "102",
    "type": "Standard",
    "floor": 1,
    "status": "vacant-clean",
    "currentGuestId": null,
    "price": 120,
    "lastCleaned": "2024-01-15"
  },
  {
    "id": "room-003",
    "number": "103", 
    "type": "Deluxe",
    "floor": 1,
    "status": "vacant-dirty",
    "currentGuestId": null,
    "price": 180,
    "lastCleaned": "2024-01-14"
  },
  {
    "id": "room-004",
    "number": "201",
    "type": "Suite",
    "floor": 2,
    "status": "maintenance",
    "currentGuestId": null,
    "price": 300,
    "lastCleaned": "2024-01-13"
  },
  {
    "id": "room-005",
    "number": "202",
    "type": "Standard",
    "floor": 2,
    "status": "occupied",
    "currentGuestId": "guest-002",
    "price": 120,
    "lastCleaned": "2024-01-15"
  },
  {
    "id": "room-006",
    "number": "203",
    "type": "Deluxe",
    "floor": 2,
    "status": "vacant-clean",
    "currentGuestId": null,
    "price": 180,
    "lastCleaned": "2024-01-15"
  },
  {
    "id": "room-007",
    "number": "301",
    "type": "Suite",
    "floor": 3,
    "status": "occupied",
    "currentGuestId": "guest-003",
    "price": 300,
    "lastCleaned": "2024-01-14"
  },
  {
    "id": "room-008",
    "number": "302",
    "type": "Standard",
    "floor": 3,
    "status": "vacant-clean",
    "currentGuestId": null,
    "price": 120,
    "lastCleaned": "2024-01-15"
  },
  {
    "id": "room-009",
    "number": "303",
    "type": "Deluxe",
    "floor": 3,
    "status": "out-of-order",
    "currentGuestId": null,
    "price": 180,
    "lastCleaned": "2024-01-12"
  },
  {
    "id": "room-010",
    "number": "304",
    "type": "Standard",
    "floor": 3,
    "status": "vacant-dirty",
    "currentGuestId": null,
    "price": 120,
    "lastCleaned": "2024-01-14"
  }
];

const roomService = {
  async getAll() {
    await delay(300);
    return [...rooms];
  },

  async getById(id) {
    await delay(200);
    const room = rooms.find(r => r.id === id);
    if (!room) {
      throw new Error('Room not found');
    }
    return { ...room };
  },

  async create(roomData) {
    await delay(400);
    const newRoom = {
      id: `room-${Date.now()}`,
      ...roomData
    };
    rooms.push(newRoom);
    return { ...newRoom };
  },

  async update(id, updates) {
    await delay(300);
    const index = rooms.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Room not found');
    }
    
    rooms[index] = { ...rooms[index], ...updates };
    return { ...rooms[index] };
  },

  async delete(id) {
    await delay(300);
    const index = rooms.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Room not found');
    }
    
    const deletedRoom = rooms[index];
    rooms.splice(index, 1);
    return { ...deletedRoom };
  }
};

export default roomService;