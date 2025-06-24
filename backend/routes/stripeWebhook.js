require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const bodyParser = require('body-parser');

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const existing = await Booking.findOne({ stripeSessionId: session.id });
      if (existing) return res.status(200).json({ received: true }); // Avoid duplicate
        console.log("INSIDE WEBHOOK")
      const booking = new Booking({
        userId: session.metadata.userId,
        userEmail: session.customer_email,
        listingId: session.metadata.listingId,
        amount: session.amount_total / 100,
        stripeSessionId: session.id,
        checkInDate: session.metadata.checkInDate,
        checkOutDate: session.metadata.checkOutDate,
        guests:session.metadata.guests,
        specialRequests: session.metadata.specialRequests || ''
      });

      await booking.save();
      console.log('✅ Booking saved via webhook');
    } catch (err) {
      console.error('❌ Failed to save booking:', err.message);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
