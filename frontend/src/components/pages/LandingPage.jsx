import React, { useState, useEffect, useRef } from "react";
import { MapPin, ChevronLeft } from "lucide-react";
import Navbar from "../Navbar";
import ListingCard from "../ListingCard";
import MapComponent from "../MapComponent";

export default function LandingPage(props) {
  const { user, setUser } = props;
  const [listings, setListings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(null);
  const [hoveredHotel, setHoveredHotel] = useState(null);

  const cities = ["Mumbai", "New Delhi", "Goa", "Lonavala"];
  
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const listingsData = {};
      await Promise.all(
        cities.map(async (city) => {
          try {
            const response = await fetch(`/api/v1/listings/get-homes?city=${encodeURIComponent(city)}&limit=4`);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch listings for ${city}: ${response.status}`);
            }
            
            const data = await response.json();
            listingsData[city] = data.data.homes;
            
          } catch (cityError) {
            console.error(`Error fetching listings for ${city}:`, cityError);
            listingsData[city] = []; // Set empty array for failed cities
          }
        })
      );
      
      setListings(listingsData);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);
  

  const handleRetry = () => {
    fetchListings();
  };
  console.log(listings)
  // If search results exist, show search layout
  if (search && Array.isArray(search)) {
    return (
      <>
        <Navbar setUser={setUser} user={user} setSearch={setSearch} search={search} page="homes" />
        
        <div className="flex h-screen bg-gray-50 ">
          {/* Left side - Search results */}
          <div className="flex-1 overflow-y-auto pt-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {search.length} stays found
                  </h1>
                  <p className="text-gray-600">Great places to stay</p>
                </div>
                <button
                  onClick={() => setSearch(null)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to browse
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {search.map((hotel) => (
                  <ListingCard
                    key={hotel._id}
                    listing={hotel}
                    />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right side - Map */}
          <div className="w-1/2 h-full pt-40">
            <div className="h-full p-6 pl-0">
                <MapComponent hotels={search} hoveredHotel={hoveredHotel} setHoveredHotel={setHoveredHotel} />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Original landing page layout when no search
  return (
    <>
      <Navbar setUser={setUser} user={user} setSearch={setSearch} search={search} page="homes" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Find your next stay
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover unique places to stay with StayFinder!
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading amazing stays...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Listings by Location */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {Object.entries(listings).map(([city, cityListings]) => (
            <div key={city} className="mb-16">
              {/* City Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{city}</h2>
                  <p className="text-gray-600 mt-1">
                    {cityListings.length} amazing stays
                  </p>
                </div>
                {cityListings.length > 0 && (
                  <button className="text-blue-500 hover:text-blue-600 font-semibold text-lg transition-colors">
                    View all →
                  </button>
                )}
              </div>

              {/* Listings Grid */}
              {cityListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cityListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No listings available for {city} at the moment.</p>
                </div>
              )}
            </div>
          ))}
          
          {/* Show message if no listings found for any city */}
          {Object.keys(listings).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No listings available at the moment.</p>
              <button 
                onClick={handleRetry}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-500">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-500">Safety information</a></li>
                <li><a href="#" className="hover:text-blue-500">Cancellation options</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-500">Diversity & Belonging</a></li>
                <li><a href="#" className="hover:text-blue-500">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/list" className="hover:text-blue-500">List your home</a></li>
                <li><a href="/list" className="hover:text-blue-500">Host an Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">© 2024 StayFinder, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}