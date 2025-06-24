import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineMenu } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export default function Navbar({ search, setSearch, page }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const menuRef = useRef(null);
  const guestRef = useRef(null);
  const destRef = useRef(null);
  const navigate = useNavigate();

  const destinations = [
    { title: "Nearby", desc: "Find what's around you" },
    { title: "Mumbai, Maharashtra", desc: "Gateway of India" },
    { title: "Goa, India", desc: "Beach destination" },
    { title: "Lonavala", desc: "Nature retreats" },
    { title: "New Delhi", desc: "Architecture and history" },
  ];

  // Function to handle search
  const handleSearch = async () => {
    if (!destination.trim()) {
      alert('Please select a destination');
      return;
    }

    setIsLoading(true);
    
    try {
      // Parse destination to extract city/state
      const [city, state] = destination.split(',').map(item => item.trim());
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (city && city !== 'Nearby') queryParams.append('city', city);
      if (state) queryParams.append('state', state);
      if (guests > 1) queryParams.append('guests', guests.toString());
      
      // Add date filters if needed (you can extend this based on your backend requirements)
      if (checkIn) queryParams.append('checkIn', checkIn);
      if (checkOut) queryParams.append('checkOut', checkOut);

      const response = await fetch(`/api/v1/listings/get-homes?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(data.data.homes)
      if (data.success) {
        setSearch(data.data.homes);
        // Close all dropdowns
        setShowSuggestions(false);
        setShowGuests(false);
      } else {
        console.error('Search failed:', data.message);
        alert('Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Error searching homes:', error);
      alert('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll behavior for search bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowSearch(false);
      else setShowSearch(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
      if (guestRef.current && !guestRef.current.contains(e.target)) setShowGuests(false);
      if (destRef.current && !destRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <div className='h-20 w-full flex justify-between items-center px-5 fixed top-0 bg-white z-50 shadow'>
        <div
          className='text-2xl text-blue-500 font-semibold flex items-center cursor-pointer'
          onClick={() => navigate('/homes')}
        >
          <img className='h-12 mr-2' src="/StayFinderLogo.png" alt="StayFinder Logo" />
          StayFinder
        </div>

        <div className='flex items-center font-semibold space-x-8'>
          <div
            className={page === "homes" ? 'cursor-pointer text-blue-500 border-b-2 border-blue-500' : 'cursor-pointer'}
            onClick={() => navigate('/homes')}
          >
            Homes
          </div>
          <div
            className={page === "services" ? 'cursor-pointer text-blue-500 border-b-2 border-blue-500' : 'cursor-pointer'}
            onClick={() => navigate('/services')}
          >
            Services
          </div>
        </div>

        <div className='flex items-center gap-5'>
          <div className='cursor-pointer hover:text-blue-500' onClick={() => navigate('/list')}>List Your Property/Service</div>
          <div className='cursor-pointer hover:text-blue-500' onClick={() => navigate('/login')}>Log In</div>
          <div className='text-xl cursor-pointer hover:text-blue-500' onClick={() => setIsOpen(!isOpen)}><HiOutlineMenu /></div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div ref={menuRef} className="absolute right-5 top-20 w-64 bg-white border rounded-xl shadow-lg z-50 p-4 text-sm">
            <div className="border-b pb-3 cursor-pointer hover:text-blue-500 rounded px-2 py-1" onClick={() => { navigate('/help'); setIsOpen(false); }}>
              <p className="font-bold">Help Centre</p>
            </div>
            <div className="border-b py-3 hover:text-blue-500 cursor-pointer  rounded px-2 " onClick={() => { navigate('/list'); setIsOpen(false); }}>
              <p className="font-semibold">List a Property</p>
              <p className="text-gray-500 text-xs">It's easy to start hosting and earn extra income.</p>
            </div>
            <div className="py-3 border-b px-2">
              <p className="cursor-pointer hover:underline">Refer a host</p>
              <p className="cursor-pointer hover:underline">Find a co-host</p>
            </div>
            <div className="pt-3 px-2 cursor-pointer hover:text-blue-500  rounded py-1" onClick={() => { navigate('/login'); setIsOpen(false); }}>
              <p>Log in or sign up</p>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className={`transition-transform duration-300 fixed top-20 w-full z-40 bg-white shadow-sm ${showSearch ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex justify-center py-3">
          <div className="flex items-center rounded-full border shadow-sm w-[95%] max-w-5xl bg-white">

            {/* Where */}
            <div ref={destRef} className="relative flex-1 px-4 py-2 cursor-pointer" onClick={() => {setShowSuggestions(true)}}>
              <p className="text-[10px] font-semibold">Where</p>
              <input
                type="text"
                placeholder="Search destinations"
                className="text-sm w-full focus:outline-none"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && (
                <div className="absolute top-[65px] left-0 w-full bg-white border rounded-xl shadow-lg z-50 p-3">
                  <p className="text-gray-500 text-sm font-semibold mb-2">Suggested destinations</p>
                  {destinations.map((item, i) => (
                    <div
                      key={i}
                      className="p-2  rounded-md cursor-pointer hover:text-blue-500"
                      onClick={() => {
                        setShowSuggestions(false);
                        setDestination(item.title);
                      }}
                    >
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Check-in */}
            <div className="px-4 py-2 border-l cursor-pointer ">
              <p className="text-[10px] font-semibold">Check in</p>
              <input 
                type="date" 
                className="text-sm w-full focus:outline-none" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            {/* Check-out */}
            <div className="px-4 py-2 border-l cursor-pointer ">
              <p className="text-[10px] font-semibold">Check out</p>
              <input 
                type="date" 
                className="text-sm w-full focus:outline-none" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            {/* Guests */}
            <div ref={guestRef} className="relative px-4 py-2 border-l cursor-pointer ">
                <div onClick={() => setShowGuests(!showGuests)}>
                <p className="text-[10px] font-semibold">Who</p>
                <p className="text-sm">{guests} guest{guests > 1 ? 's' : ''}</p>
                </div>
              {showGuests && (
                <div className="absolute top-[65px] right-0 bg-white border rounded-xl shadow-lg z-50 p-4">
                  <p className="text-sm font-semibold mb-2">Guests</p>
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1 border rounded-full" onClick={() => setGuests(Math.max(1, guests - 1))}>-</button>
                    <span>{guests}</span>
                    <button className="px-3 py-1 border rounded-full" onClick={() => setGuests(guests + 1)}>+</button>
                  </div>
                </div>
              )}
            </div>

            {/* Search button */}
            <div 
              className={`px-5 py-4 flex items-center justify-center rounded-[100%] h-15 cursor-pointer transition-colors ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'hover:bg-blue-500 hover:text-white'
              }`}
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FaSearch className="text-sm" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}