import { useState, useEffect } from "react";
import { 
  Heart, Star, MapPin, Users, Bed, Bath, Wifi, Car, 
  Coffee, Wind, Shield, ChevronLeft, ChevronRight,
  Calendar, CreditCard, User, Mail, Phone, Check,
  ArrowLeft, Share, Flag
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CheckoutButton from "../CheckoutButton";

export default function ListingDetail({user,setUser}) {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // New state for total amount
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  const navigate = useNavigate()
  useEffect(() => {
    const fetchListing = async () => {
        try {
        const response = await fetch(`/api/v1/listings/get-home/${listingId}`);
        const data = await response.json();

        if(!data.success){
        navigate("/404")          
        }
        setListing(data.data);
        setLoading(false);
        } catch (error) {
        navigate("/404")
        console.error("Error fetching listing:", error);
        setLoading(false);
        }
    };

    fetchListing();
  }, [listingId]);

  // Update total amount whenever dates change
  useEffect(() => {
    if (checkInDate && checkOutDate && listing) {
      const total = calculateTotal();
      setTotalAmount(total);
    }
  }, [checkInDate, checkOutDate, listing]);

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    if (nights > 0 && listing) {
      const baseTotal = nights * listing.pricing.basePrice;
      const cleaningFee = listing.home.fees.cleaningFee;
      const serviceFee = listing.home.fees.serviceFee;
      return baseTotal + cleaningFee + serviceFee;
    }
    return 0;
  };

  const handleBooking = async () => {
  if (!checkInDate || !checkOutDate) {
    alert("Please select check-in and check-out dates");
    return;
  }

  try {
    const authToken = localStorage.getItem('authToken');
    const res = await fetch('/api/v1/check-login', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log(data);
    
    if (data.success) {
      setUser(data.user);
      setShowBookingForm(true); // Only show booking form after successful login check
    } else {
      alert("Login in to reserve!");
      navigate("/login");
    }
  } catch (error) {
    console.error("Error checking login:", error);
    alert("Login in to reserve!");
    navigate("/login");
  }
};

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const submitBooking = () => {
    alert("Booking request submitted successfully!");
    setShowBookingForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Listing not found</h2>
          <p className="text-gray-600">The listing you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  console.log(listing)
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={()=>{navigate(-1)}} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              <button onClick={handleShare}  className="flex items-center text-gray-600 hover:text-gray-900">
                <Share className="w-5 h-5 mr-1" />
                Share
              </button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Heart className={`w-5 h-5 mr-1 ${isLiked ? 'fill-blue-500 text-blue-500' : ''}`} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Location */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex items-center text-gray-600">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium mr-2">{listing.rating}</span>
            <span className="mr-2">·</span>
            <MapPin className="w-4 h-4 mr-1" />
            <span>{listing.location?.city}, {listing.location?.state}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden mb-8">
              <div className="aspect-w-16 aspect-h-10 h-96">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {listing.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {listing.home.placeType} hosted by Owner
                </h2>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{listing.home.guests} guests</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2" />
                    <span>{listing.home.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-2" />
                    <span>{listing.home.bathrooms} bathrooms</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8">
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Amenities */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-4">
                  {listing.home.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 inline mr-2" />
                    {listing.rating} · {listing.reviews.length} reviews
                  </h3>
                </div>
                
                
                {/* Individual Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listing.reviews.slice(0, 6).map((review, index) => {
                    const [name, reviewText] = review.split(':');
                    const initials = name.split(' ').map(n => n[0]).join('');
                    const reviewDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">{initials}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{name}</h4>
                            <p className="text-sm text-gray-600">
                              {reviewDate.toLocaleDateString('en-US', { 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        {/* <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                            />
                          ))}
                        </div> */}
                        <p className="text-gray-700 text-sm leading-relaxed">{reviewText}</p>
                      </div>
                    );
                  })}
                </div>

                {listing.reviews.length > 6 && (
                  <div className="mt-6">
                    <button className="border border-gray-900 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      Show all {listing.reviews.length} reviews
                    </button>
                  </div>
                )}
              </div>

              {/* Location Section */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-4">Where you'll be</h3>
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-4">
                  <div className="text-center text-gray-600">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">{listing.location.city}, {listing.location.state}</p>
                    <p className="text-sm">{listing.location.address}</p>
                  </div>
                </div>
              </div>

              {/* Host Information */}
              <div className="border-t pt-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">AH</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Hosted by {listing.host}</h3>
                    <p className="text-gray-600">Verified Host · {listing.timeAsHost}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold">{listing.reviews.length}</p>
                    <p className="text-sm text-gray-600">Reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{listing.rating}</p>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{listing.timeAsHost}</p>
                    <p className="text-sm text-gray-600">Years hosting</p>
                  </div>
                </div>
                <button className="mt-4 border border-gray-900 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
                  Contact host
                </button>
              </div>

              {/* Things to Know */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-6">Things to know</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-medium mb-3">House rules</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Check-in: {listing.home.houseRules.checkIn}</p>
                      <p>Check-out: {listing.home.houseRules.checkOut}</p>
                      <p>{listing.home.guests} guests maximum</p>
                      <p>Pets: {listing.home.houseRules.pets}</p>
                      <p>Smoking: {listing.home.houseRules.smoking}</p>
                      <p>Additional Rules: {listing.home.houseRules.additionalRules}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Cancellation policy</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>{listing.home.cancellationPolicy}</p>
                      <p>Review the full policy for details</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold">₹{listing.pricing.basePrice.toLocaleString()}</span>
                    <span className="text-gray-600"> night</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{listing.rating}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[...Array(listing.home.guests)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1} guest{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Breakdown */}
                  {checkInDate && checkOutDate && (
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>₹{listing.pricing.basePrice.toLocaleString()} × {calculateNights()} nights</span>
                        <span>₹{(listing.pricing.basePrice * calculateNights()).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>₹{listing.home.fees.cleaningFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>₹{listing.home.fees.serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBooking}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Reserve
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Complete your booking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              
              {/* Booking Summary */}
              <div className="border-t pt-4 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{checkInDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{checkOutDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <CheckoutButton
                  amount={totalAmount}
                  user={user}
                  listingId={listing._id}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  guests={guests}
                  specialRequests={bookingData.specialRequests}
                  onSuccess={() => {
                    setShowBookingForm(false);
                    alert("Booking confirmed successfully!");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}