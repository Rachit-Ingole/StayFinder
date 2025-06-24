const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HomeListing',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  checkInDate:{
    type:String,
    required:true
  },
  checkOutDate:{
    type:String,
    required:true
  },
  guests:{
    type:Number,
    required:true
  },
  specialRequests:{
    type:String,
  },
  stripeSessionId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
