// Utility function for delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Export all services
export { default as roomService } from './api/roomService';
export { default as guestService } from './api/guestService';
export { default as reservationService } from './api/reservationService';