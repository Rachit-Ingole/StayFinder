const mongoose = require('mongoose');

const HomeListingSchema = new mongoose.Schema({
  type: { type: String, default: 'home' },
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
  home: {
    placeType: String,
    propertyType: String,
    guests: Number,
    bedrooms: Number,
    beds: Number,
    bathrooms: Number,
    amenities: [String],
    houseRules: {
      pets: String,
      smoking: String,
      checkIn: String,
      checkOut: String,
      additionalRules: String
    },
    fees: {
      cleaningFee: Number,
      serviceFee: Number
    },
    cancellationPolicy: String
  }
}, { timestamps: true });

module.exports = mongoose.model('HomeListing', HomeListingSchema);
