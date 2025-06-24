const mongoose = require('mongoose');

const ServiceListingSchema = new mongoose.Schema({
  type: { type: String, default: 'service' },
  title: String,
  description: String,
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: String,
      lng: String
    }
  },
  pricing: {
    basePrice: Number,
    currency: { type: String, default: 'INR' }
  },
  images: [String],
  rating:String,
  reviews:[String],
  service: {
    serviceType: String,
    category: String,
    duration: String,
    groupSize: String,
    includes: [String],
    requirements: String,
    availability: {
      days: [String],
      timeSlots: [String]
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceListing', ServiceListingSchema);
