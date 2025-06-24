import React, { useEffect, useState } from 'react';
import { Upload, Home, Briefcase, MapPin, DollarSign, Users, Bed, Bath, Wifi, Car, Camera, Clock, Shield, FileText } from 'lucide-react';
import { useNavigate} from 'react-router-dom';

const ListingPage = ({user,setUser}) => {
  const [listingType, setListingType] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      coordinates: { lat: '', lng: '' }
    },
    pricing: {
      basePrice: '',
      currency: 'USD'
    },
    images: [],
    
    home: {
      placeType: '', 
      propertyType: '', 
      guests: '',
      bedrooms: '',
      beds: '',
      bathrooms: '',
      amenities: [],
      houseRules: {
        pets: '',
        smoking: '',
        checkIn: '',
        checkOut: '',
        additionalRules: ''
      },
      fees: {
        cleaningFee: '',
        serviceFee: ''
      },
      cancellationPolicy: ''
    },
    
    service: {
      serviceType: '',
      category: '',
      duration: '',
      groupSize: '',
      includes: [],
      requirements: '',
      availability: {
        days: [],
        timeSlots: []
      }
    }
  });

  const homeSteps = [
    'Listing Type',
    'Place Type',
    'Property Details',
    'Location',
    'Amenities',
    'House Rules',
    'Pricing',
    'Photos & Title',
    'Review & Submit'
  ];

  const serviceSteps = [
    'Listing Type',
    'Service Type',
    'Service Details',
    'Location',
    'Pricing',
    'Availability',
    'Photos & Title',
    'Review & Submit'
  ];

  const steps = listingType === 'home' ? homeSteps : serviceSteps;

  const amenitiesList = [
    'Wi-Fi', 'Kitchen', 'Parking', 'Pool', 'Hot tub', 'Gym', 'Washer', 'Dryer',
    'Air conditioning', 'Heating', 'TV', 'Workspace', 'Fireplace', 'Balcony'
  ];

  const serviceTypes = [
    { value: 'tour', label: 'Tour Guide' },
    { value: 'personal-service', label: 'Personal Service' },
    { value: 'experience', label: 'Experience' },
    { value: 'workshop', label: 'Workshop/Class' },
    { value: 'other', label: 'Other' }
  ];

  const personalServices = [
    'Haircut/Styling', 'Massage', 'Personal Chef', 'Cleaning', 'Pet Sitting',
    'Photography', 'Tutoring', 'Fitness Training', 'Beauty Services', 'Other'
  ];

  useEffect(() => {
    const checkLogin = async ()=>{
      const authToken = localStorage.getItem('authToken');
      const res = await fetch('/api/v1/check-login', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.success) {
        setUser({...req.user,...authToken})
      }else{
        alert("Login in to view this page!")
        navigate("/login")
      }
    }

    checkLogin()
  },[])

  const updateFormData = (path, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    try {
        const response = await fetch(`${API_URL}/api/v1/upload`, {
        method: 'POST',
        body: formData,
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const urls = data.uploaded.map(img => img.url);
        updateFormData('images', urls);
    } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload images");
    }
  };



  const handleSubmit = async () => {
    try {
      formData["host"]= user["name"]
      formData["timeAsHost"] = "New" 
      const endpoint = listingType === 'home' 
        ? '/api/v1/listings/list-home'
        : '/api/v1/listings/list-service';
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Listing created successfully!');
      } else {
        alert('Error creating listing. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting listing. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: 
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What would you like to list?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setListingType('home');
                  updateFormData('type', 'home');
                }}
                className={`p-8 border-2 rounded-lg transition-all ${
                  listingType === 'home' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Home className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Home</h3>
                <p className="text-gray-600">List your property for guests to stay</p>
              </button>
              
              <button
                onClick={() => {
                  setListingType('service');
                  updateFormData('type', 'service');
                }}
                className={`p-8 border-2 rounded-lg transition-all ${
                  listingType === 'service' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Service</h3>
                <p className="text-gray-600">Offer tours, experiences, or personal services</p>
              </button>
            </div>
          </div>
        );

      case 1: // Place Type (Home) or Service Type (Service)
        if (listingType === 'home') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What type of place are you listing?</h2>
              <div className="space-y-4">
                {[
                  { value: 'entire-home', label: 'Entire home', desc: 'Guests have the whole place to themselves' },
                  { value: 'private-room', label: 'Private room', desc: 'Guests have their own room in a shared home' },
                  { value: 'shared-room', label: 'Shared room', desc: 'Guests share a room with others' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('home.placeType', option.value)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      formData.home.placeType === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold">{option.label}</h3>
                    <p className="text-gray-600 text-sm">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What type of service do you offer?</h2>
              <div className="space-y-4">
                {serviceTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => updateFormData('service.serviceType', type.value)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      formData.service.serviceType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold">{type.label}</h3>
                  </button>
                ))}
              </div>
              
              {formData.service.serviceType === 'personal-service' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Specific Service Category</label>
                  <select
                    value={formData.service.category}
                    onChange={(e) => updateFormData('service.category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a category</option>
                    {personalServices.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        }

      case 2: // Property Details (Home) or Service Details (Service)
        if (listingType === 'home') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Property Details</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select
                  value={formData.home.propertyType}
                  onChange={(e) => updateFormData('home.propertyType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="cottage">Cottage</option>
                  <option value="condo">Condo</option>
                  <option value="villa">Villa</option>
                  <option value="unique">Unique Space (Treehouse, Boat, etc.)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Guests
                  </label>
                  <input
                    type="number"
                    value={formData.home.guests}
                    onChange={(e) => updateFormData('home.guests', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.home.bedrooms}
                    onChange={(e) => updateFormData('home.bedrooms', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Bed className="w-4 h-4 inline mr-1" />
                    Beds
                  </label>
                  <input
                    type="number"
                    value={formData.home.beds}
                    onChange={(e) => updateFormData('home.beds', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Bath className="w-4 h-4 inline mr-1" />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.home.bathrooms}
                    onChange={(e) => updateFormData('home.bathrooms', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="0.5"
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Service Details</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Service Duration</label>
                <select
                  value={formData.service.duration}
                  onChange={(e) => updateFormData('service.duration', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select duration</option>
                  <option value="30min">30 minutes</option>
                  <option value="1hr">1 hour</option>
                  <option value="2hr">2 hours</option>
                  <option value="3hr">3 hours</option>
                  <option value="half-day">Half day (4-6 hours)</option>
                  <option value="full-day">Full day (8+ hours)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maximum Group Size</label>
                <input
                  type="number"
                  value={formData.service.groupSize}
                  onChange={(e) => updateFormData('service.groupSize', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What's Included</label>
                <textarea
                  value={formData.service.includes.join('\n')}
                  onChange={(e) => updateFormData('service.includes', e.target.value.split('\n').filter(item => item.trim()))}
                  placeholder="List what's included in your service (one per line)"
                  className="w-full p-3 border border-gray-300 rounded-lg h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Requirements or Restrictions</label>
                <textarea
                  value={formData.service.requirements}
                  onChange={(e) => updateFormData('service.requirements', e.target.value)}
                  placeholder="Any age restrictions, fitness requirements, or other important information"
                  className="w-full p-3 border border-gray-300 rounded-lg h-24"
                />
              </div>
            </div>
          );
        }

      case 3: // Location
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              <MapPin className="w-6 h-6 inline mr-2" />
              Location
            </h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Full Address</label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => updateFormData('location.address', e.target.value)}
                placeholder="Street address"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => updateFormData('location.city', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">State/Province</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => updateFormData('location.state', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
                <input
                  type="text"
                  value={formData.location.zipCode}
                  onChange={(e) => updateFormData('location.zipCode', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => updateFormData('location.country', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Amenities (Home) or Pricing (Service)
        if (listingType === 'home') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What amenities do you offer?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => {
                      const current = formData.home.amenities;
                      const updated = current.includes(amenity)
                        ? current.filter(a => a !== amenity)
                        : [...current, amenity];
                      updateFormData('home.amenities', updated);
                    }}
                    className={`p-4 text-left border-2 rounded-lg transition-all ${
                      formData.home.amenities.includes(amenity)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      {amenity === 'Wi-Fi' && <Wifi className="w-5 h-5 mr-2" />}
                      {amenity === 'Parking' && <Car className="w-5 h-5 mr-2" />}
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                <DollarSign className="w-6 h-6 inline mr-2" />
                Pricing
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Base Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.pricing.basePrice}
                    onChange={(e) => updateFormData('pricing.basePrice', e.target.value)}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">Price per person or per session</p>
              </div>
            </div>
          );
        }

      case 5: // House Rules (Home) or Availability (Service)
        if (listingType === 'home') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">House Rules & Policies</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Pets Allowed?</label>
                  <select
                    value={formData.home.houseRules.pets}
                    onChange={(e) => updateFormData('home.houseRules.pets', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="negotiable">Case by case</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Smoking Allowed?</label>
                  <select
                    value={formData.home.houseRules.smoking}
                    onChange={(e) => updateFormData('home.houseRules.smoking', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="no">No smoking</option>
                    <option value="outside">Outside only</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Time</label>
                  <input
                    type="time"
                    value={formData.home.houseRules.checkIn}
                    onChange={(e) => updateFormData('home.houseRules.checkIn', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Time</label>
                  <input
                    type="time"
                    value={formData.home.houseRules.checkOut}
                    onChange={(e) => updateFormData('home.houseRules.checkOut', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cancellation Policy</label>
                <select
                  value={formData.home.cancellationPolicy}
                  onChange={(e) => updateFormData('home.cancellationPolicy', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select policy</option>
                  <option value="flexible">Flexible</option>
                  <option value="moderate">Moderate</option>
                  <option value="strict">Strict</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional House Rules</label>
                <textarea
                  value={formData.home.houseRules.additionalRules}
                  onChange={(e) => updateFormData('home.houseRules.additionalRules', e.target.value)}
                  placeholder="Any other important rules or information for guests"
                  className="w-full p-3 border border-gray-300 rounded-lg h-24"
                />
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                <Clock className="w-6 h-6 inline mr-2" />
                Availability
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Days Available</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <button
                      key={day}
                      onClick={() => {
                        const current = formData.service.availability.days;
                        const updated = current.includes(day)
                          ? current.filter(d => d !== day)
                          : [...current, day];
                        updateFormData('service.availability.days', updated);
                      }}
                      className={`p-2 text-sm border-2 rounded-lg transition-all ${
                        formData.service.availability.days.includes(day)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Time Slots</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Morning (6-12)', 'Afternoon (12-18)', 'Evening (18-22)', 'Night (22-6)'].map(slot => (
                    <button
                      key={slot}
                      onClick={() => {
                        const current = formData.service.availability.timeSlots;
                        const updated = current.includes(slot)
                          ? current.filter(s => s !== slot)
                          : [...current, slot];
                        updateFormData('service.availability.timeSlots', updated);
                      }}
                      className={`p-3 text-sm border-2 rounded-lg transition-all ${
                        formData.service.availability.timeSlots.includes(slot)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        }

      case 6: // Pricing (Home) or Photos & Title (Service)
        if (listingType === 'home') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                <DollarSign className="w-6 h-6 inline mr-2" />
                Pricing & Fees
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Base Price per Night</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.pricing.basePrice}
                    onChange={(e) => updateFormData('pricing.basePrice', e.target.value)}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cleaning Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.home.fees.cleaningFee}
                      onChange={(e) => updateFormData('home.fees.cleaningFee', e.target.value)}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Service Fee (typically 3%)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.home.fees.serviceFee}
                      onChange={(e) => updateFormData('home.fees.serviceFee', e.target.value)}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                <Camera className="w-6 h-6 inline mr-2" />
                Photos & Title
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Listing Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Create an attention-grabbing title for your service"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe your service in detail. What makes it special?"
                  className="w-full p-3 border border-gray-300 rounded-lg h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">Drag and drop photos here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      updateFormData('images', files);
                    }}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    Choose Photos
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.images.length} photo(s) selected
                  </p>
                )}
              </div>
            </div>
          );
        }

      case 7: // Photos & Title (Home) or Review & Submit (Service)
        if (listingType === 'home') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                <Camera className="w-6 h-6 inline mr-2" />
                Photos & Title
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Listing Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Create an attention-grabbing title for your property"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe your property and what makes it special"
                  className="w-full p-3 border border-gray-300 rounded-lg h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">Drag and drop photos here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      handleImageUpload(e);
                    }}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    Choose Photos
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.images.length} photo(s) selected
                  </p>
                )}
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                <Shield className="w-6 h-6 inline mr-2" />
                Review & Submit
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Service Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Type:</strong> {formData.service.serviceType}</p>
                  <p><strong>Category:</strong> {formData.service.category}</p>
                  <p><strong>Duration:</strong> {formData.service.duration}</p>
                  <p><strong>Group Size:</strong> {formData.service.groupSize}</p>
                  <p><strong>Price:</strong> ${formData.pricing.basePrice}</p>
                  <p><strong>Location:</strong> {formData.location.city}, {formData.location.state}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and privacy policy
                </label>
              </div>
            </div>
          );
        }

      case 8: // Review & Submit (Home only)
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              <Shield className="w-6 h-6 inline mr-2" />
              Review & Submit
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Property Summary</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Type:</strong> {formData.home.placeType}</p>
                <p><strong>Property:</strong> {formData.home.propertyType}</p>
                <p><strong>Guests:</strong> {formData.home.guests}</p>
                <p><strong>Bedrooms:</strong> {formData.home.bedrooms}</p>
                <p><strong>Bathrooms:</strong> {formData.home.bathrooms}</p>
                <p><strong>Price:</strong> ${formData.pricing.basePrice}/night</p>
                <p><strong>Location:</strong> {formData.location.city}, {formData.location.state}</p>
                <p><strong>Amenities:</strong> {formData.home.amenities.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions and privacy policy
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Create Your Listing</h1>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`text-xs ${
                  index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Back
          </button>
          
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Submit Listing
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!listingType && currentStep === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;