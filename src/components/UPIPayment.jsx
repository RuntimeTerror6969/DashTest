'use client';

import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import Image from 'next/image';
import upiqr from 'upiqr';

// UPI provider options with logos
const UPI_PROVIDERS = [
  { name: 'Google Pay', asset: '/assets/gpay.svg', assetDark: '/assets/gpay_dark.svg' },
  { name: 'PhonePe', asset: '/assets/phonepe.svg', assetDark: '/assets/phonepe_dark.svg' },
  { name: 'Paytm', asset: '/assets/paytm.svg', assetDark: '/assets/paytm_dark.svg' },
  { name: 'BHIM', asset: '/assets/bhim.svg', assetDark: '/assets/bhim_dark.svg' }
];

const UPIPayment = ({ 
  orderData, 
  merchantDetails, 
  billingDetails, 
  onPaymentComplete, 
  theme,
  onBackClick,
  themeToggle
}) => {
  const [qrCode, setQrCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate QR code on component mount
  useEffect(() => {
    if (orderData?.orderID && merchantDetails?.merchantVPA) {
      generateQRCode();
    }
  }, [orderData, merchantDetails]);

  // Function to generate QR code using upiqr library
  const generateQRCode = async () => {
    try {
      setErrorMessage('');
      
      if (!merchantDetails.merchantVPA) {
        setErrorMessage('Merchant UPI ID is missing. Payment cannot be processed.');
        return;
      }
      
      if (!orderData.totalAmount || orderData.totalAmount <= 0) {
        setErrorMessage('Invalid payment amount. Please try again.');
        return;
      }

      const qrData = {
        payeeVPA: merchantDetails.merchantVPA,
        payeeName: merchantDetails.payeeName || merchantDetails.name || 'Merchant',
        amount: orderData.totalAmount.toString(),
        transactionNote: `Payment for ${orderData.item} (${orderData.orderID})`
      };
      
      console.log('Generating UPI QR with data:', qrData);
      
      const { qr } = await upiqr(qrData);
      setQrCode(qr);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setErrorMessage('Unable to generate QR code. Please try again or contact support.');
    }
  };

  // Handle completion of payment
  const handlePaymentComplete = async () => {
    try {
      setIsProcessing(true);
      
      // Record UPI payment details
      const paymentData = {
        orderID: orderData.orderID,
        paymentMethod: 'UPI',
        amount: orderData.totalAmount,
        currency: orderData.currency,
        customerName: `${billingDetails.firstName} ${billingDetails.lastName}`,
        customerEmail: billingDetails.emailID,
        customerPhone: billingDetails.mobileNumber,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED'
      };
      
      // You can make an API call here to record the payment
      try {
        await fetch('/api/record-upi-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        });
      } catch (error) {
        console.error('Error recording UPI payment:', error);
        // Continue with acknowledgment even if recording fails
      }
      
      // Call the parent component's completion handler
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    } catch (error) {
      console.error('Error processing UPI payment:', error);
      setErrorMessage('Error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-8 px-4 md:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Order Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {/* Back to Checkout button and theme toggle */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={onBackClick}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to checkout
            </button>
            
            <div className="flex items-center">
              {themeToggle}
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-6">
            Order Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Details */}
            <div>
              <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">Product Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Product:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{orderData.item}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {orderData.currency === 'INR' ? '₹' : '$'} {orderData.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Customer Details */}
            {billingDetails && (
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">Customer Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {billingDetails.firstName} {billingDetails.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{billingDetails.emailID}</span>
                  </div>
                  {billingDetails.mobileNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Mobile:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{billingDetails.mobileNumber}</span>
                    </div>
                  )}
                  {billingDetails.city && billingDetails.state && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {billingDetails.city}, {billingDetails.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* UPI Payment Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-6">
            UPI Payment
          </h2>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Scan QR Code below in any UPI app to Pay
          </p>
          
          {/* UPI Apps Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {UPI_PROVIDERS.map((app) => (
              <div key={app.name} className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center p-2">
                  <Image
                    src={theme === 'dark' ? app.assetDark : app.asset} 
                    alt={app.name} 
                    width={100}
                    height={40}
                    className="object-contain h-8 w-20"
                    style={{ maxHeight: '32px', maxWidth: '80px' }}
                    priority={true}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement?.querySelector('.fallback-text');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                </div>
                <span className="fallback-text hidden text-sm font-medium text-gray-700 dark:text-gray-200">
                  {app.name}
                </span>
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-red-600 dark:text-red-400 mb-4 text-base">
              {errorMessage}
            </div>
          )}

          {qrCode ? (
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white p-3 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                <Image
                  src={qrCode} 
                  alt="UPI QR Code"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  UPI ID: <span className="font-bold">{merchantDetails?.merchantVPA}</span>
                </p>
              </div>
            </div>
          ) : !errorMessage && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-left mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4" />
              Payment Instructions:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Verify payee name appears as <span className="font-semibold text-gray-800 dark:text-gray-200">
                {merchantDetails?.payeeName || merchantDetails?.name || 'Merchant'}
              </span></li>
              <li>Complete the payment using your preferred UPI app</li>
              <li>Click the button below after payment is done</li>
            </ol>
          </div>

          <button 
            onClick={handlePaymentComplete}
            disabled={isProcessing || !qrCode}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium
                     flex items-center justify-center gap-2
                     ${isProcessing || !qrCode
                       ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                       : 'bg-green-500 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600'}`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>Payment Completed</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UPIPayment; 