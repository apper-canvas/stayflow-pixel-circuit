import HomePage from '@/components/pages/HomePage';
import Dashboard from '../pages/Dashboard';
import Reservations from '../pages/Reservations';
import Rooms from '../pages/Rooms';
import Guests from '../pages/Guests';
import Reports from '../pages/Reports';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  reservations: {
    id: 'reservations',
    label: 'Reservations',
    path: '/reservations',
    icon: 'Calendar',
    component: Reservations
  },
  rooms: {
    id: 'rooms',
    label: 'Rooms',
    path: '/rooms',
    icon: 'Building',
    component: Rooms
  },
  guests: {
    id: 'guests',
    label: 'Guests',
    path: '/guests',
    icon: 'Users',
    component: Guests
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFound
  }
};

export const routeArray = Object.values(routes);