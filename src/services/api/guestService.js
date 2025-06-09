import { delay } from '../index';

// Import mock data
let guests = [
  {
    "id": "guest-001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@email.com",
    "phone": "+1-555-0123",
    "idNumber": "ID123456789",
    "address": "123 Main Street, Anytown, USA",
    "stayHistory": [
      {
        "roomNumber": "101",
        "checkIn": "2024-01-10",
        "checkOut": "2024-01-13",
        "nights": 3,
        "totalAmount": 360
      },
      {
        "roomNumber": "203",
        "checkIn": "2023-12-15",
        "checkOut": "2023-12-18",
        "nights": 3,
        "totalAmount": 540
      }
    ]
  },
  {
    "id": "guest-002", 
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@email.com",
    "phone": "+1-555-0456",
    "idNumber": "ID987654321",
    "address": "456 Oak Avenue, Springfield, USA",
    "stayHistory": [
      {
        "roomNumber": "202",
        "checkIn": "2024-01-12",
        "checkOut": "2024-01-16",
        "nights": 4,
        "totalAmount": 480
      }
    ]
  },
  {
    "id": "guest-003",
    "firstName": "Michael",
    "lastName": "Brown",
    "email": "michael.brown@email.com", 
    "phone": "+1-555-0789",
    "idNumber": "ID456789123",
    "address": "789 Pine Road, Riverside, USA",
    "stayHistory": [
      {
        "roomNumber": "301",
        "checkIn": "2024-01-08",
        "checkOut": "2024-01-12",
        "nights": 4,
        "totalAmount": 1200
      },
      {
        "roomNumber": "301",
        "checkIn": "2023-11-20",
        "checkOut": "2023-11-25",
        "nights": 5,
        "totalAmount": 1500
      },
      {
        "roomNumber": "203",
        "checkIn": "2023-09-10",
        "checkOut": "2023-09-14",
        "nights": 4,
        "totalAmount": 720
      },
      {
        "roomNumber": "102",
        "checkIn": "2023-07-15",
        "checkOut": "2023-07-18",
        "nights": 3,
        "totalAmount": 360
      },
      {
        "roomNumber": "301",
        "checkIn": "2023-05-22",
        "checkOut": "2023-05-27",
        "nights": 5,
        "totalAmount": 1500
      }
    ]
  },
  {
    "id": "guest-004",
    "firstName": "Emily",
    "lastName": "Davis",
    "email": "emily.davis@email.com",
    "phone": "+1-555-0321",
    "idNumber": "ID321654987",
    "address": "321 Elm Street, Lakeside, USA",
    "stayHistory": [
      {
        "roomNumber": "103",
        "checkIn": "2023-12-20",
        "checkOut": "2023-12-23",
        "nights": 3,
        "totalAmount": 540
      },
      {
        "roomNumber": "202",
        "checkIn": "2023-10-05",
        "checkOut": "2023-10-08",
        "nights": 3,
        "totalAmount": 360
      }
    ]
  },
  {
    "id": "guest-005",
    "firstName": "David",
    "lastName": "Wilson",
    "email": "david.wilson@email.com",
    "phone": "+1-555-0654",
    "idNumber": "ID654321789",
    "address": "654 Maple Drive, Hilltown, USA",
    "stayHistory": []
  }
];

const guestService = {
  async getAll() {
    await delay(300);
    return [...guests];
  },

  async getById(id) {
    await delay(200);
    const guest = guests.find(g => g.id === id);
    if (!guest) {
      throw new Error('Guest not found');
    }
    return { ...guest };
  },

  async create(guestData) {
    await delay(400);
    const newGuest = {
      id: `guest-${Date.now()}`,
      stayHistory: [],
      ...guestData
    };
    guests.push(newGuest);
    return { ...newGuest };
  },

  async update(id, updates) {
    await delay(300);
    const index = guests.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Guest not found');
    }
    
    guests[index] = { ...guests[index], ...updates };
    return { ...guests[index] };
  },

  async delete(id) {
    await delay(300);
    const index = guests.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Guest not found');
    }
    
    const deletedGuest = guests[index];
    guests.splice(index, 1);
    return { ...deletedGuest };
  }
};

export default guestService;