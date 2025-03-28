'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Send } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const PaymentAcknowledgmentModal = ({ orderID, item, currency, amount, merchantDetails, paymentProvider }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(100);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Handle redirection effect separately from countdown
  useEffect(() => {
    if (shouldRedirect && merchantDetails?.homepageUrl) {
      router.push(merchantDetails.homepageUrl);
    }
  }, [shouldRedirect, merchantDetails?.homepageUrl, router]);

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
          // Set redirect flag instead of redirecting directly
          setShouldRedirect(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl">
          <div className="text-center">
            {/* Title with Icon */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Thank You for Your Order!
              </h2>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-4 max-w-xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Order Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{orderID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Item:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currency === 'INR' ? '₹' : '$'} {amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Telegram Instructions */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-4 max-w-xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center flex items-center justify-center">
                <Send className="w-6 h-6 mr-2" />
                Next Steps
              </h3>
              <div className="space-y-3 mb-6 text-left">
                {paymentProvider !== 'UPI' && (
                  <p className="text-gray-600 dark:text-gray-300">
                    1. Complete your payment in the newly opened {paymentProvider} tab
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-300">
                  {paymentProvider === 'UPI' ? '1' : '2'}. Take a screenshot of your payment confirmation from your <strong>{paymentProvider}</strong> app
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {paymentProvider === 'UPI' ? '2' : '3'}. Scan the QR code below to send us the screenshot on Telegram
                </p>
              </div>
              
              {/* Telegram QR Code */}
              <div className="flex justify-center items-center mb-4">
                <div className="relative w-[400px] h-[400px]">
                  <Image
                    src={merchantDetails?.contactPreference?.qrCode || ''}
                    alt="Telegram QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Or click{' '}
                <a
                  href={`https://${merchantDetails?.contactPreference?.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium hover:text-gray-700 dark:hover:text-gray-300"
                >
                  here
                </a>
                {' '}to open Telegram directly
              </p>
            </div>

            {/* Support Message */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We will process your order as soon as we receive your payment confirmation.
            </p>

            {/* Auto-redirect Message with Countdown - At the bottom */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  Redirecting to home page in:
                </p>
                <div className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAcknowledgmentModal; 