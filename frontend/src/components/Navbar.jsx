import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineMenu } from "react-icons/hi";
import { FaUser, FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Navbar({ setUser, user, search, setSearch, page }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [serviceMinPrice, setServiceMinPrice] = useState('');
  const [serviceMaxPrice, setServiceMaxPrice] = useState('');

  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const guestRef = useRef(null);
  const destRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);
  const cityRef = useRef(null);
  const servicePriceRef = useRef(null);
  const navigate = useNavigate();

  const destinations = [
    { title: "Mumbai", desc: "Gateway of India" },
    { title: "Goa", desc: "Beach destination" },
    { title: "Lonavala", desc: "Nature retreats" },
    { title: "New Delhi", desc: "Architecture and history" },
  ];

  const cities = [
    { title: "Mumbai", desc: "Commercial capital of India" },
    { title: "Delhi", desc: "National capital territory" },
    { title: "Bangalore", desc: "Silicon Valley of India" },
    { title: "Pune", desc: "Oxford of the East" },
    { title: "Chennai", desc: "Detroit of India" },
    { title: "Hyderabad", desc: "City of Pearls" },
    { title: "Kolkata", desc: "City of Joy" },
  ];

  const serviceCategories = [
    { title: "Home Cleaning", desc: "Professional cleaning services" },
    { title: "Plumbing", desc: "Repair and installation services" },
    { title: "Gardening", desc: "Landscaping and maintenance" },
    { title: "Pest Control", desc: "Pest management services" },
    { title: "Beauty & Wellness", desc: "Personal care services" },
  ];

  useEffect(() => {
    console.log("USER:", user);
    if (user?.token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const handleSearch = async () => {
    if (!destination.trim()) {
      alert('Please select a destination');
      return;
    }

    setIsLoading(true);
    try {
      const [city, state] = destination.split(',').map(item => item.trim());
      const queryParams = new URLSearchParams();
      
      if (city && city !== 'Nearby') queryParams.append('city', city);
      if (state) queryParams.append('state', state);
      if (guests > 1) queryParams.append('guests', guests.toString());
      if (checkIn) queryParams.append('checkIn', checkIn);
      if (checkOut) queryParams.append('checkOut', checkOut);
      if (minPrice && !isNaN(minPrice)) queryParams.append('minPrice', minPrice);
      if (maxPrice && !isNaN(maxPrice)) queryParams.append('maxPrice', maxPrice);

      const response = await fetch(`${API_URL}/api/v1/listings/get-homes?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setSearch(data.data.homes);
        setShowSuggestions(false);
        setShowGuests(false);
        setShowPriceRange(false);
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

  const handleServiceSearch = async () => {
    if (!selectedCity.trim()) {
      alert('Please select a city');
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (selectedCity) queryParams.append('city', selectedCity);
      if (selectedCategory) queryParams.append('category', selectedCategory);
      if (serviceMinPrice && !isNaN(serviceMinPrice)) queryParams.append('minPrice', serviceMinPrice);
      if (serviceMaxPrice && !isNaN(serviceMaxPrice)) queryParams.append('maxPrice', serviceMaxPrice);

      const response = await fetch(`${API_URL}/api/v1/services/get-services?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setSearch(data.data.services);
        setShowCities(false);
        setShowCategories(false);
        setShowPriceRange(false);
      } else {
        console.error('Service search failed:', data.message);
        alert('Service search failed. Please try again.');
      }
    } catch (error) {
      console.error('Error searching services:', error);
      alert('An error occurred while searching services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowSearch(false);
      else setShowSearch(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (guestRef.current && !guestRef.current.contains(e.target)) setShowGuests(false);
      if (destRef.current && !destRef.current.contains(e.target)) setShowSuggestions(false);
      if (priceRef.current && !priceRef.current.contains(e.target)) setShowPriceRange(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setShowCategories(false);
      if (cityRef.current && !cityRef.current.contains(e.target)) setShowCities(false);
      if (servicePriceRef.current && !servicePriceRef.current.contains(e.target)) setShowPriceRange(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriceRangeDisplay = () => {
    if (!minPrice && !maxPrice) return 'Add price range';
    if (minPrice && !maxPrice) return `₹${minPrice}+`;
    if (!minPrice && maxPrice) return `Up to ₹${maxPrice}`;
    return `₹${minPrice} - ₹${maxPrice}`;
  };

  const getServicePriceRangeDisplay = () => {
    if (!serviceMinPrice && !serviceMaxPrice) return 'Add price range';
    if (serviceMinPrice && !serviceMaxPrice) return `₹${serviceMinPrice}+`;
    if (!serviceMinPrice && serviceMaxPrice) return `Up to ₹${serviceMaxPrice}`;
    return `₹${serviceMinPrice} - ₹${serviceMaxPrice}`;
  };

  return (
    <>
      {/* Main Navbar */}
      <div className='h-20 w-full flex justify-between items-center px-5 fixed top-0 bg-white z-50 shadow'>
        <div
          className='flex items-center cursor-pointer'
          onClick={() => navigate('/homes')}
        >
          <img className='h-12 mr-2' src="/StayFinderLogo.png" alt="StayFinder Logo" />
          <span className='text-2xl text-blue-500 font-semibold hidden md:block'>StayFinder</span>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center font-semibold space-x-8'>
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
          <div className='hidden md:block cursor-pointer hover:text-blue-500' onClick={() => navigate('/list')}>
            List Your Property/Service
          </div>
          
          {/* User Menu */}
          {isLoggedIn ? (
            <div className='relative'>
              <div 
                className='text-xl cursor-pointer hover:text-blue-500 p-2 rounded-full border border-gray-300 hover:border-blue-500' 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUser />
              </div>
              {showUserMenu && (
                <div ref={userMenuRef} className="absolute right-0 top-12 w-48 bg-white border rounded-xl shadow-lg z-50 p-4 text-sm">
                  <div className="cursor-pointer hover:text-blue-500 rounded px-2 py-2" onClick={() => { navigate('/bookings'); setShowUserMenu(false); }}>
                    <p className="font-semibold">My Bookings</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='hidden md:block cursor-pointer hover:text-blue-500' onClick={() => navigate('/login')}>
              Log In
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <div className='text-xl cursor-pointer hover:text-blue-500' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <HiOutlineMenu />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div ref={menuRef} className="absolute right-5 top-20 w-64 bg-white border rounded-xl shadow-lg z-50 p-4 text-sm ">
            <div className="border-b pb-3">
              <div
                className={page === "homes" ? 'cursor-pointer text-blue-500 py-2' : 'cursor-pointer py-2'}
                onClick={() => { navigate('/homes'); setIsMobileMenuOpen(false); }}
              >
                Homes
              </div>
              <div
                className={page === "services" ? 'cursor-pointer text-blue-500 py-2' : 'cursor-pointer py-2'}
                onClick={() => { navigate('/services'); setIsMobileMenuOpen(false); }}
              >
                Services
              </div>
            </div>
            <div className="border-b py-3 cursor-pointer hover:text-blue-500 rounded px-2" onClick={() => { navigate('/list'); setIsMobileMenuOpen(false); }}>
              <p className="font-semibold">List a Property</p>
              <p className="text-gray-500 text-xs">It's easy to start hosting and earn extra income.</p>
            </div>
            <div className="border-b pb-3 cursor-pointer hover:text-blue-500 rounded px-2 py-1" onClick={() => { navigate('/help'); setIsMobileMenuOpen(false); }}>
              <p className="font-bold">Help Centre</p>
            </div>
            <div className="py-3 px-2">
              <p className="cursor-pointer hover:underline py-1">Refer a host</p>
              <p className="cursor-pointer hover:underline py-1">Find a co-host</p>
            </div>
            {isLoggedIn ? (
              <div className="pt-3 px-2 cursor-pointer hover:text-blue-500 rounded py-1" onClick={() => { navigate('/bookings'); setIsMobileMenuOpen(false); }}>
                <p className="font-semibold">My Bookings</p>
              </div>
            ) : (
              <div className="pt-3 px-2 cursor-pointer hover:text-blue-500 rounded py-1" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
                <p>Log in or sign up</p>
              </div>
            )}
          </div>
        )}

        {/* Desktop Menu Dropdown */}
        {isOpen && (
          <div ref={menuRef} className="hidden md:block absolute right-5 top-20 w-64 bg-white border rounded-xl shadow-lg z-50 p-4 text-sm">
            <div className="border-b pb-3 cursor-pointer hover:text-blue-500 rounded px-2 py-1" onClick={() => { navigate('/help'); setIsOpen(false); }}>
              <p className="font-bold">Help Centre</p>
            </div>
            <div className="border-b py-3 hover:text-blue-500 cursor-pointer rounded px-2" onClick={() => { navigate('/list'); setIsOpen(false); }}>
              <p className="font-semibold">List a Property</p>
              <p className="text-gray-500 text-xs">It's easy to start hosting and earn extra income.</p>
            </div>
            <div className="py-3 border-b px-2">
              <p className="cursor-pointer hover:underline">Refer a host</p>
              <p className="cursor-pointer hover:underline">Find a co-host</p>
            </div>
            {isLoggedIn ? (
              <div className="pt-3 px-2 cursor-pointer hover:text-blue-500 rounded py-1" onClick={() => { navigate('/bookings'); setIsOpen(false); }}>
                <p className="font-semibold">My Bookings</p>
              </div>
            ) : (
              <div className="pt-3 px-2 cursor-pointer hover:text-blue-500 rounded py-1" onClick={() => { navigate('/login'); setIsOpen(false); }}>
                <p>Log in or sign up</p>
              </div>
            )}
          </div>
        )}
      </div>

      {page !== "services" ? (
        /* Homes Search Bar */
        <div className={`transition-transform duration-300 fixed top-20 w-full z-40 bg-white shadow-sm ${showSearch ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex justify-center py-3">
            <div className="flex items-center rounded-full border shadow-sm w-[95%] max-w-6xl bg-white flex-wrap md:flex-nowrap p-2">
              {/* Where */}
              <div ref={destRef} className="relative flex-1 px-2 py-1 cursor-pointer min-w-[120px] md:min-w-[150px]">
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
                        className="p-2 rounded-md cursor-pointer hover:text-blue-500"
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

              <div className="hidden md:block px-2 py-1 border-l cursor-pointer min-w-[150px]">
                <p className="text-[10px] font-semibold">Check in</p>
                <input 
                  type="date" 
                  className="text-sm w-full focus:outline-none" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div className="hidden md:block px-2 py-1 border-l cursor-pointer min-w-[150px]">
                <p className="text-[10px] font-semibold">Check out</p>
                <input 
                  type="date" 
                  className="text-sm w-full focus:outline-none" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div ref={priceRef} className="relative px-2 py-1 border-l cursor-pointer min-w-[120px] md:min-w-[140px]">
                <div onClick={() => setShowPriceRange(!showPriceRange)}>
                  <p className="text-[10px] font-semibold">Price</p>
                  <p className="text-sm text-gray-600">{getPriceRangeDisplay()}</p>
                </div>
                {showPriceRange && (
                  <div className="absolute top-[65px] right-0 bg-white border rounded-xl shadow-lg z-50 p-4 w-80">
                    <p className="text-sm font-semibold mb-3">Price range per night</p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Minimum</label>
                          <input
                            type="number"
                            placeholder="₹0"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Maximum</label>
                          <input
                            type="number"
                            placeholder="₹10000+"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <button 
                          className="text-sm text-gray-600 hover:text-gray-800"
                          onClick={() => {
                            setMinPrice('');
                            setMaxPrice('');
                          }}
                        >
                          Clear
                        </button>
                        <button 
                          className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600"
                          onClick={() => setShowPriceRange(false)}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guests */}
              <div ref={guestRef} className="relative px-2 py-1 border-l cursor-pointer min-w-[50px] md:min-w-[120px]">
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
              <div 
                className={`px-4 py-2 flex items-center justify-center rounded-[100%] h-12 w-12 cursor-pointer transition-colors ${
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
                  <FaSearch className="text-xl" />
                )}
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Services Search Bar */
        <div className={`transition-transform duration-300 fixed top-20 w-full z-40 bg-white shadow-sm ${showSearch ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex justify-center py-3">
            <div className="flex items-center rounded-full border shadow-sm w-[95%] max-w-4xl bg-white flex-wrap md:flex-nowrap p-2">

              {/* City */}
              <div ref={cityRef} className="relative flex-1 px-2 py-1 cursor-pointer min-w-[120px] md:min-w-[150px]" onClick={() => setShowCities(true)}>
                <p className="text-[10px] font-semibold">City</p>
                <input
                  type="text"
                  placeholder="Search cities"
                  className="text-sm w-full focus:outline-none"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  onFocus={() => setShowCities(true)}
                />
                {showCities && (
                  <div className="absolute top-[65px] left-0 w-full bg-white border rounded-xl shadow-lg z-50 p-3">
                    <p className="text-gray-500 text-sm font-semibold mb-2">Popular cities</p>
                    {cities.map((item, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-md cursor-pointer hover:text-blue-500"
                        onClick={() => {
                          setShowCities(false);
                          setSelectedCity(item.title);
                        }}
                      >
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category */}
              <div ref={categoryRef} className="relative px-2 py-1 border-l cursor-pointer min-w-[180px]">
                <div onClick={() => setShowCategories(!showCategories)}>
                  <p className="text-[10px] font-semibold">Category</p>
                  <p className="text-sm text-gray-600">{selectedCategory || 'All services'}</p>
                </div>
                {showCategories && (
                  <div className="absolute top-[65px] left-0 bg-white border rounded-xl shadow-lg z-50 p-3 w-72">
                    <p className="text-gray-500 text-sm font-semibold mb-2">Service categories</p>
                    <div 
                      className="p-2 rounded-md cursor-pointer hover:text-blue-500"
                      onClick={() => {
                        setShowCategories(false);
                        setSelectedCategory('');
                      }}
                    >
                      <p className="font-medium">All services</p>
                      <p className="text-xs text-gray-500">Browse all available services</p>
                    </div>
                    {serviceCategories.map((item, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-md cursor-pointer hover:text-blue-500"
                        onClick={() => {
                          setShowCategories(false);
                          setSelectedCategory(item.title);
                        }}
                      >
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Price Range */}
              <div ref={servicePriceRef} className="relative px-2 py-1 border-l cursor-pointer min-w-[120px] md:min-w-[140px]">
                <div onClick={() => setShowPriceRange(!showPriceRange)}>
                  <p className="text-[10px] font-semibold">Price</p>
                  <p className="text-sm text-gray-600">{getServicePriceRangeDisplay()}</p>
                </div>
                {showPriceRange && (
                  <div className="absolute top-[65px] right-0 bg-white border rounded-xl shadow-lg z-50 p-4 w-80">
                    <p className="text-sm font-semibold mb-3">Service price range</p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Minimum</label>
                          <input
                            type="number"
                            placeholder="₹0"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            value={serviceMinPrice}
                            onChange={(e) => setServiceMinPrice(e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Maximum</label>
                          <input
                            type="number"
                            placeholder="₹5000+"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            value={serviceMaxPrice}
                            onChange={(e) => setServiceMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <button 
                          className="text-sm text-gray-600 hover:text-gray-800"
                          onClick={() => {
                            setServiceMinPrice('');
                            setServiceMaxPrice('');
                          }}
                        >
                          Clear
                        </button>
                        <button 
                          className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600"
                          onClick={() => setShowPriceRange(false)}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className={`px-4 py-2 flex items-center justify-center rounded-[100%] h-12 w-12 cursor-pointer transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'hover:bg-blue-500 hover:text-white'
                }`}
                onClick={handleServiceSearch}
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
      )}
    </>
  );
}