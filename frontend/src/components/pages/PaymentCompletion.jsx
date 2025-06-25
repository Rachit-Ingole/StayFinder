import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentCompletion({ mode }) {
  const isSuccess = mode === 'success';
  const isCancel = mode === 'cancel';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      {isSuccess && (
        <>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-blue-500 mb-4">Payment Successful!</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thank you for your purchase</h2>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
        </>
      )}

      {isCancel && (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-blue-500 mb-4">Payment Cancelled</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your payment was not processed</h2>
          <p className="text-gray-600 mb-6">
            No charges have been made to your account. You can try again or contact support if you need help.
          </p>
        </>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Go Back Home
        </Link>
        
        {isSuccess && (
          <Link
            to="/bookings"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            View Bookings
          </Link>
        )}
      </div>
    </div>
  );
}