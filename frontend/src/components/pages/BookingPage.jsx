import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, CreditCard, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingsPage({user}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!user.token) {
        alert("LogIn to view this page")
        navigate("/login")
        setError('Please log in to view your bookings');
        setLoading(false);
      }
      
      const response = await fetch(`${API_URL}/api/v1/bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.data.bookings);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('An error occurred while fetching bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getBookingStatus = (checkInDate, checkOutDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (today < checkIn) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (today >= checkIn && today <= checkOut) {
      return { status: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className='h-16 w-full flex justify-between items-center px-5 bg-white shadow'>
          <div className='flex items-center'>
            <button 
              onClick={() => navigate('/')} 
              className='mr-4 p-2 hover:bg-gray-100 rounded-full'
            >
              <ArrowLeft className='h-5 w-5' />
            </button>
            <div className='text-xl text-blue-500 font-semibold flex items-center cursor-pointer' onClick={() => navigate('/')}>
              <img className='h-10 mr-2' src="/StayFinderLogo.png" alt="StayFinder Logo" />
              StayFinder
            </div>
          </div>
        </div>
        <div className="pt-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className='h-16 w-full flex justify-between items-center px-5 bg-white shadow'>
          <div className='flex items-center'>
            <button 
              onClick={() => navigate('/')} 
              className='mr-4 p-2 hover:bg-gray-100 rounded-full'
            >
              <ArrowLeft className='h-5 w-5' />
            </button>
            <div className='text-xl text-blue-500 font-semibold flex items-center cursor-pointer' onClick={() => navigate('/')}>
              <img className='h-10 mr-2' src="/StayFinderLogo.png" alt="StayFinder Logo" />
              StayFinder
            </div>
          </div>
        </div>
        <div className="pt-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='h-16 w-full flex justify-between items-center px-5 bg-white shadow'>
        <div className='flex items-center'>
          <button 
            onClick={() => navigate('/')} 
            className='mr-4 p-2 hover:bg-gray-100 rounded-full'
          >
            <ArrowLeft className='h-5 w-5' />
          </button>
          <div className='text-xl text-blue-500 font-semibold flex items-center cursor-pointer' onClick={() => navigate('/')}>
            <img className='h-10 mr-2' src="/StayFinderLogo.png" alt="StayFinder Logo" />
            StayFinder
          </div>
        </div>
      </div>
      
      <div className="pt-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Manage and view all your booking details</p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
              <p className="text-gray-600 mb-6">Start exploring amazing places to stay!</p>
              <button 
                onClick={() => window.location.href = '/homes'}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Homes
              </button>
            </div>
          ) : (
            <div className="space-y-6 mb-10">
              {bookings.map((booking) => {
                const { status, color } = getBookingStatus(booking.checkInDate, booking.checkOutDate);
                
                return (
                  <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={booking.listingId?.images?.[0] || '/api/placeholder/400/300'}
                          alt={booking.listingId?.title || 'Property'}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {booking.listingId?.title || 'Property Title'}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {booking.listingId?.location?.city}, {booking.listingId?.location?.state}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                            {status}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Check-in: {formatDate(booking.checkInDate)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Check-out: {formatDate(booking.checkOutDate)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <CreditCard className="h-4 w-4 mr-2" />
                              <span>Total: {formatAmount(booking.amount)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>Booked: {formatDate(booking.createdAt)}</span>
                            </div>
                            {booking.specialRequests && (
                              <div className="flex items-start text-sm text-gray-600">
                                <MessageSquare className="h-4 w-4 mr-2 mt-0.5" />
                                <span className="line-clamp-2">{booking.specialRequests}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <button 
                            onClick={() => window.location.href = `/listing/${booking.listingId?._id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Property
                          </button>
                          {status === 'Upcoming' && (
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                              Cancel Booking
                            </button>
                          )}
                          {status === 'Completed' && (
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}