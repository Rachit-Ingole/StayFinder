const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking'); // Adjust path as needed
const HomeListing = require('../models/HomeListing'); // Adjust path as needed
const User = require('../models/User'); // Adjust path as needed

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userId:",userId)
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    let query = { userId };

    // Add status filter if provided
    if (status) {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      switch (status) {
        case 'upcoming':
          query.checkInDate = { $gt: todayString };
          break;
        case 'active':
          query.checkInDate = { $lte: todayString };
          query.checkOutDate = { $gte: todayString };
          break;
        case 'completed':
          query.checkOutDate = { $lt: todayString };
          break;
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate({
        path: 'listingId',
        select: 'title description location pricing images rating host home.propertyType home.guests home.bedrooms home.bathrooms home.amenities'
      })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limitNum)
      .lean(); 

    const totalBookings = await Booking.countDocuments(query);

    const totalPages = Math.ceil(totalBookings / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    const bookingsWithStatus = bookings.map(booking => {
      const today = new Date();
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);

      let computedStatus;
      if (today < checkIn) {
        computedStatus = 'upcoming';
      } else if (today >= checkIn && today <= checkOut) {
        computedStatus = 'active';
      } else {
        computedStatus = 'completed';
      }

      return {
        ...booking,
        computedStatus
      };
    });

    res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: {
        bookings: bookingsWithStatus,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalBookings,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({ _id: id, userId })
      .populate({
        path: 'listingId',
        select: 'title description location pricing images rating host home reviews timeAsHost'
      })
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or you do not have permission to view it'
      });
    }

    const today = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    let computedStatus;
    if (today < checkIn) {
      computedStatus = 'upcoming';
    } else if (today >= checkIn && today <= checkOut) {
      computedStatus = 'active';
    } else {
      computedStatus = 'completed';
    }

    res.status(200).json({
      success: true,
      message: 'Booking details fetched successfully',
      data: {
        booking: {
          ...booking,
          computedStatus
        }
      }
    });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching booking details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const stats = await Booking.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$amount' },
          upcomingBookings: {
            $sum: {
              $cond: [{ $gt: ['$checkInDate', today] }, 1, 0]
            }
          },
          activeBookings: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$checkInDate', today] },
                    { $gte: ['$checkOutDate', today] }
                  ]
                },
                1,
                0
              ]
            }
          },
          completedBookings: {
            $sum: {
              $cond: [{ $lt: ['$checkOutDate', today] }, 1, 0]
            }
          }
        }
      }
    ]);

    const userStats = stats[0] || {
      totalBookings: 0,
      totalSpent: 0,
      upcomingBookings: 0,
      activeBookings: 0,
      completedBookings: 0
    };

    res.status(200).json({
      success: true,
      message: 'Booking statistics fetched successfully',
      data: {
        stats: userStats
      }
    });

  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching booking statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;