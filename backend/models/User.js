const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    select: false
  },
  tokenExpires: {
    type: Date,
    select: false
  },
  verifiedAt: {
    type: Date
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  profilePicture: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ verificationToken: 1 });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isVerified: this.isVerified,
    profilePicture: this.profilePicture,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
});

// Method to check if verification token is expired
userSchema.methods.isVerificationTokenExpired = function() {
  return this.tokenExpires && this.tokenExpires < new Date();
};

// Method to check if reset token is expired
userSchema.methods.isResetTokenExpired = function() {
  return this.resetPasswordExpires && this.resetPasswordExpires < new Date();
};

// Clean up expired tokens before saving
userSchema.pre('save', function(next) {
  // Clean up expired verification token
  if (this.tokenExpires && this.tokenExpires < new Date()) {
    this.verificationToken = undefined;
    this.tokenExpires = undefined;
  }
  
  // Clean up expired reset token
  if (this.resetPasswordExpires && this.resetPasswordExpires < new Date()) {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
  }
  
  next();
});

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.tokenExpires;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);