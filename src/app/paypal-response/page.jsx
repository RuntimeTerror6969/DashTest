'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import merchantConfig from '../../config/merchantConfig.json';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Head from 'next/head';

function PaypalResponseContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const { theme } = useTheme();

  // Add countdown timer for successful and failed payments
  useEffect(() => {
    if (paymentStatus?.status === 'COMPLETED' || status === 'COMPLETED' || error) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = merchantConfig.homepageUrl || '/';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStatus?.status, status, error]);

  useEffect(() => {
    const checkPaymentStatus = async (orderId) => {
      try {
        const response = await fetch('/api/paypal/check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.success) {
          setPaymentStatus(data.data);
        } else {
          throw new Error(data.error || 'Failed to verify payment status');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Payment verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    const handlePayment = async () => {
      if (!orderId) {
        setError('Invalid payment response');
        setIsLoading(false);
        return;
      }

      if (status === 'CANCELLED') {
        setError('Payment was cancelled');
        setIsLoading(false);
        return;
      }

      if (status === 'ERROR') {
        setError('Payment failed due to technical issues with Paypal');
        setIsLoading(false);
        return;
      }

      if (status === 'COMPLETED') {
        setIsLoading(false);
        checkPaymentStatus(orderId);
        return;
      }

      checkPaymentStatus(orderId);
    };

    handlePayment();
  }, [orderId, status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 font-sans">
              Processing Your Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-center">
              Please wait while we verify your payment status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
        <div className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center font-sans">
              Payment Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">
              {error}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center font-sans">
              Order Details
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</p>
                <p className="text-gray-900 dark:text-white font-medium">{orderId || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Redirecting back in {timeLeft} seconds...
            </p>
            <button
              onClick={() => window.location.href = merchantConfig.homepageUrl || '/'}
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success page - with either status from query or from API
  const isCompleted = paymentStatus?.status === 'COMPLETED' || status === 'COMPLETED';
  
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 px-4">
        <div className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 border border-gray-100 dark:border-gray-700">
          {/* Status Header */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full mb-6 shadow-md">
              <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4 font-sans">
              Payment Successful!
            </h1>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-24 h-6 relative">
                <Image
                  src={theme === 'dark' ? '/assets/paypal_dark.svg' : '/assets/paypal.svg'}
                  alt="PayPal"
                  width={96}
                  height={24}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Transaction verified and completed
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 mb-8 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center font-sans">
              Order Details
            </h2>
            <div className="grid grid-cols-[1fr,2fr] gap-y-4">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Order ID</p>
              <p className="text-gray-500 dark:text-gray-400">{orderId || 'N/A'}</p>

              {paymentStatus?.amount && (
                <>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Amount</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xl">
                    {paymentStatus.currency === 'INR' ? '₹' : '$'} {paymentStatus.amount} {paymentStatus.currency}
                  </p>
                </>
              )}

              {paymentStatus?.item && (
                <>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Product</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {paymentStatus.item}
                  </p>
                </>
              )}

              {paymentStatus?.timestamp && (
                <>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Date</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {new Date(paymentStatus.timestamp).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Customer Details */}
          {(paymentStatus?.customerName || paymentStatus?.customerEmail) && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 mb-8 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center font-sans">
                Customer Details
              </h2>
              <div className="grid grid-cols-[1fr,2fr] gap-y-4">
                {paymentStatus.customerName && (
                  <>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Name</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {paymentStatus.customerName}
                    </p>
                  </>
                )}
                {paymentStatus.customerEmail && (
                  <>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Email</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {paymentStatus.customerEmail}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Return to Home with Timer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-5">
              Redirecting to homepage in {timeLeft} seconds...
            </p>
            <button
              onClick={() => window.location.href = merchantConfig.homepageUrl || '/'}
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default state - should never reach here
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            Processing Payment
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3">
            Please wait while we verify your payment status...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PayPalResponse() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 font-sans">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    }>
      <PaypalResponseContent />
    </Suspense>
  );
} 