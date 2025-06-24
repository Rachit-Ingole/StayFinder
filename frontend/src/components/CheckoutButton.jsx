import 'react'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton({ amount, user, listingId, checkInDate, checkOutDate, specialRequests, guests }) {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/api/v1/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        email: user.email,
        userId: user.userId,
        listingId,
        checkInDate,
        checkOutDate,
        specialRequests,
        guests
      })
    });

    const data = await res.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <button onClick={handleCheckout} className="bg-blue-600 text-white px-4 py-2 rounded">
      Book Now for ₹{amount}
    </button>
  );
}
