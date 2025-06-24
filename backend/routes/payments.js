// routes/paymentRoutes.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { amount, email, listingId, userId, checkInDate, checkOutDate, specialRequests, guests } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'StayFinder Booking',
            },
            unit_amount: amount * 100, // Convert ₹500 to paise
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId,
        listingId,
        checkInDate,
        checkOutDate,
        guests,
        specialRequests: specialRequests || ''
      }
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Checkout session failed' });
  }
});

module.exports = router;
