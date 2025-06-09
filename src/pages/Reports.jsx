import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import roomService from '../services/api/roomService';
import reservationService from '../services/api/reservationService';
import guestService from '../services/api/guestService';

const Reports = () => {
  const [data, setData] = useState({
    rooms: [],
    reservations: [],
    guests: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rooms, reservations, guests] = await Promise.all([
        roomService.getAll(),
        reservationService.getAll(),
        guestService.getAll()
      ]);
      setData({ rooms, reservations, guests });
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const calculateOccupancyRate = () => {
    const occupiedRooms = data.rooms.filter(room => room.status === 'occupied').length;
    const totalRooms = data.rooms.length;
    return totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  };

  const calculateRevenue = () => {
    const completedReservations = data.reservations.filter(r => r.status === 'checked-out');
    return completedReservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0);
  };

  const getOccupancyChartData = () => {
    const statusCounts = data.rooms.reduce((acc, room) => {
      acc[room.status] = (acc[room.status] || 0) + 1;
      return acc;
    }, {});

    return {
      series: Object.values(statusCounts),
      options: {
        chart: {
          type: 'donut',
          height: 350
        },
        labels: Object.keys(statusCounts).map(status => {
          switch (status) {
            case 'occupied': return 'Occupied';
            case 'vacant-clean': return 'Available';
            case 'vacant-dirty': return 'Cleaning';
            case 'maintenance': return 'Maintenance';
            case 'out-of-order': return 'Out of Order';
            default: return status;
          }
        }),
        colors: ['#ef4444', '#10b981', '#f59e0b', '#6b7280', '#7c2d12'],
        legend: {
          position: 'bottom'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            }
          }
        }]
      }
    };
  };

  const getRevenueChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const dailyRevenue = last7Days.map(date => {
      const dayReservations = data.reservations.filter(r => 
        r.checkOut === date && r.status === 'checked-out'
      );
      return dayReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    });

    return {
      series: [{
        name: 'Revenue',
        data: dailyRevenue
      }],
      options: {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          categories: last7Days.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          })
        },
        yaxis: {
          labels: {
            formatter: (value) => `$${value}`
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3
          }
        },
        colors: ['#2563eb']
      }
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                  <div className="h-8 bg-surface-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
                <div className="animate-pulse">
                  <div className="h-64 bg-surface-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Reports</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  const occupancyRate = calculateOccupancyRate();
  const totalRevenue = calculateRevenue();
  const avgStayLength = data.reservations.length > 0 
    ? Math.round(data.reservations.reduce((sum, r) => {
        const checkIn = new Date(r.checkIn);
        const checkOut = new Date(r.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return sum + nights;
      }, 0) / data.reservations.length * 10) / 10
    : 0;

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Hotel performance metrics and occupancy insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">{occupancyRate}%</h3>
              <p className="text-sm text-gray-500">Occupancy Rate</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">${totalRevenue.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3">
              <ApperIcon name="Users" className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">{data.guests.length}</h3>
              <p className="text-sm text-gray-500">Total Guests</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-full p-3">
              <ApperIcon name="Calendar" className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900">{avgStayLength}</h3>
              <p className="text-sm text-gray-500">Avg Stay (nights)</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold text-gray-900">Room Status Distribution</h3>
          </div>
          <div className="p-6">
            <Chart
              options={getOccupancyChartData().options}
              series={getOccupancyChartData().series}
              type="donut"
              height={350}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend (Last 7 Days)</h3>
          </div>
          <div className="p-6">
            <Chart
              options={getRevenueChartData().options}
              series={getRevenueChartData().series}
              type="area"
              height={350}
            />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-white rounded-lg shadow-sm border border-surface-200"
      >
        <div className="p-6 border-b border-surface-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
        </div>
        <div className="divide-y divide-surface-200">
          {data.reservations.slice(0, 5).map((reservation, index) => {
            const guest = data.guests.find(g => g.id === reservation.guestId);
            const room = data.rooms.find(r => r.id === reservation.roomId);
            
            return (
              <div key={reservation.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Room {room?.number || 'N/A'} • {reservation.checkIn} to {reservation.checkOut}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${reservation.totalPrice}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      reservation.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'checked-out' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {data.reservations.length === 0 && (
            <div className="p-12 text-center">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No reservations available</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;