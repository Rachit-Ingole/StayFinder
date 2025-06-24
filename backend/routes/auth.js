const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  getProfile,
  forgotPassword
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 email requests per hour
  message: {
    success: false,
    message: 'Too many email requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', emailLimiter, resendVerification);
router.post('/forgot-password', emailLimiter, forgotPassword);
router.get('/profile', protect, getProfile);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;