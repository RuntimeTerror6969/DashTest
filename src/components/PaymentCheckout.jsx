'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, CreditCard, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import BillingDetails from './BillingDetails';
import PaymentAcknowledgmentModal from './PaymentAcknowledgmentModal';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import UPIPayment from './UPIPayment';

// Configuration for payment providers with their display settings and requirements
const getPaymentProviders = (merchantDetails, currency) => {
  const providers = {
    upi: {
      name: 'UPI',
      asset: '/assets/upi.svg',
      assetDark: '/assets/upi_dark.svg',
      upi: true
    },
    wise: {
      name: 'Wise',
      asset: '/assets/wise.svg',
      assetDark: '/assets/wise_dark.svg',
      upi: false
    },
    paypal: {
      name: 'PayPal',
      asset: '/assets/paypal.svg',
      assetDark: '/assets/paypal_dark.svg',
      upi: false
    }
  };

  // Get preferred providers for the current currency
  const preferredProviders = merchantDetails.preferred_payment_providers?.[currency] || [];
  
  // Map preferred providers to their configurations
  return preferredProviders
    .map(provider => providers[provider.toLowerCase()])
    .filter(Boolean);
};

// Theme toggle component for light/dark mode switching
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
};

// Individual payment option component for radio button selection
const PaymentOption = ({ provider, isSelected, onSelect, theme }) => {
  const [imageError, setImageError] = useState(false);
  const [darkImageError, setDarkImageError] = useState(false);

  return (
    <div
      className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-300 dark:border-gray-600'
        }`}>
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
        <div className="flex-1 flex items-center justify-center">
          {!imageError && !darkImageError ? (
            <Image
              src={theme === 'dark' ? provider.assetDark : provider.asset}
              alt={provider.name}
              width={100}
              height={40}
              className="h-8 w-auto object-contain"
              onError={() => {
                if (theme === 'dark') {
                  setDarkImageError(true);
                } else {
                  setImageError(true);
                }
              }}
            />
          ) : (
            <span className="text-gray-500 dark:text-gray-400 text-sm">{provider.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// UPI Modal component
const UPIModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-end p-3">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Order summary component to display transaction details
const OrderSummary = ({ orderData, merchantDetails, handleChangeFinalAmount }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [finalAmount, setFinalAmount] = useState(orderData.totalAmount);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Function to handle discount code application
  const applyDiscountCode = async (code) => {
    if (!code.trim()) {
      return;
    }

    setIsValidating(true);
    setDiscountError('');

    try {
      // Call the API to validate discount code
      const response = await fetch('/api/validate-discount-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discountCode: code }),
      });

      const data = await response.json();
      
      if (data.valid) {
        // Check if the discount applies to the current product and currency
        if (data.product === orderData.item && data.currency === orderData.currency) {
          let newAmount = orderData.totalAmount;
          
          // Calculate new amount based on discount type
          if (data.value.startsWith('-')) {
            // Subtract fixed amount
            const deduction = parseFloat(data.value.substring(1));
            newAmount = orderData.totalAmount - deduction;
            // Ensure amount doesn't go below zero
            if (newAmount < 0) newAmount = 0;
            setFinalAmount(newAmount);
            setAppliedDiscount(`-${deduction}`);
          } else if (data.value.startsWith('*')) {
            // Apply percentage discount
            const multiplier = parseFloat(data.value.substring(1));
            newAmount = orderData.totalAmount - (orderData.totalAmount * multiplier);
            setFinalAmount(newAmount);
            setAppliedDiscount(`${(multiplier * 100)}%`);
          }
        } else {
          setDiscountError('This discount code is not applicable to this product or currency');
        }
      } else {
        // Invalid discount code
        setFinalAmount(orderData.totalAmount);
        setAppliedDiscount(null);
        setDiscountError(data.message || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      setDiscountError('Error processing discount code. Please try again.');
      setFinalAmount(orderData.totalAmount);
      setAppliedDiscount(null);
    } finally {
      setIsValidating(false);
    }
  };

  // Effect to reset final amount when order data changes
  useEffect(() => {
    setFinalAmount(orderData.totalAmount);
    setDiscountCode('');
    setAppliedDiscount(null);
  }, [orderData.totalAmount]);

  useEffect(() => {
    if (handleChangeFinalAmount) {
      handleChangeFinalAmount(finalAmount);
    }
  }, [finalAmount, handleChangeFinalAmount]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
      <div className="flex items-center justify-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Order Summary
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center rounded-lg">
          <span className="text-gray-600 dark:text-gray-300">Order ID</span>
          <span className="font-medium text-gray-900 dark:text-white">{orderData.orderID}</span>
        </div>
        
        <div className="flex justify-between items-center rounded-lg">
          <span className="text-gray-600 dark:text-gray-300">Item</span>
          <span className="font-medium text-gray-900 dark:text-white">{orderData.item}</span>
        </div>

        {/* Discount Code Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                  setDiscountError(''); // Clear error when input changes
                }}
                placeholder="Enter discount code"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {discountError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {discountError}
                </p>
              )}
            </div>
            <button
              onClick={() => applyDiscountCode(discountCode)}
              disabled={!discountCode.trim() || isValidating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? 'Checking...' : 'Apply'}
            </button>
          </div>
        </div>

        {/* Amount Display */}
        <div className="flex justify-between items-center rounded-lg">
          <span className="text-gray-600 dark:text-gray-300">Amount</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {orderData.currency === 'INR' ? '₹' : '$'} {orderData.totalAmount.toLocaleString()}
          </span>
        </div>

        {/* Applied Discount Display */}
        {appliedDiscount && (
          <div className="flex justify-between items-center rounded-lg text-green-600 dark:text-green-400">
            <span>Discount Applied</span>
            <span className="font-medium">
              {appliedDiscount.includes('%') 
                ? appliedDiscount 
                : `${orderData.currency === 'INR' ? '- ₹' : '- $'} ${Math.abs(parseFloat(appliedDiscount))}`}
            </span>
          </div>
        )}

        {/* Final Amount Display */}
        <div className="flex justify-between items-center rounded-lg border-t pt-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Final Amount</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {orderData.currency === 'INR' ? '₹' : '$'} {finalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main payment checkout content component
const PaymentCheckoutContent = ({ orderData, merchantDetails }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [finalAmount, setFinalAmount] = useState(orderData.totalAmount);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [billingData, setBillingData] = useState(null);
  const [showUPIPage, setShowUPIPage] = useState(false);
  const billingDetailsRef = useRef(null);
  const { theme } = useTheme();

  // Get available payment providers for the current currency
  const availableProviders = getPaymentProviders(merchantDetails, orderData.currency);

  // Auto-select provider if there's only one option
  useEffect(() => {
    if (availableProviders.length === 1) {
      setSelectedProvider(availableProviders[0].name);
    }
  }, [availableProviders]);

  const handleChangeFinalAmount = (finAmount) => {
    setFinalAmount(finAmount);
  };

  const handleProviderChange = (providerName) => {
    setSelectedProvider(providerName);
  };

  useEffect(() => {
    const handleFormValidityChange = (event) => {
      setIsFormValid(event.detail);
    };

    window.addEventListener('formValidityChanged', handleFormValidityChange);
    return () => {
      window.removeEventListener('formValidityChanged', handleFormValidityChange);
    };
  }, []);

  const renderLogo = () => {
    if (!merchantDetails?.logo) return null;

    const logoUrl = theme === 'dark' ? merchantDetails.logo.dark : merchantDetails.logo.light;

    return (
      <div className="flex justify-center mb-8">
        <Image
          src={logoUrl}
          alt="Merchant Logo"
          width={150}
          height={150}
          className="object-contain"
          priority
        />
      </div>
    );
  };

  const handlePaymentSubmit = async (billingDetails) => {
    try {
      setBillingData(billingDetails);
      await saveBillingDetails(billingDetails);
      
      if (selectedProvider === 'Wise') {
        const wiseUrl = `https://wise.com/pay/business/diliprajkumar1?amount=${finalAmount}&currency=${orderData.currency}&description=${encodeURIComponent(orderData.orderID)}`;
        window.open(wiseUrl, '_blank', 'noopener,noreferrer');
        setShowAcknowledgment(true);
      } else if (selectedProvider === 'UPI') {
        setShowUPIPage(true);
      }
      
      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('An error occurred while processing your payment. Please try again.');
      return false;
    }
  };

  const saveBillingDetails = async (billingData) => {
    try {
      // Save billing details
      const saveBillingResponse = await fetch('/api/save-billing-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: orderData.orderID,
          billingDetails: {
            ...billingData,
            amount: finalAmount,
            currency: orderData.currency,
            item: orderData.item
          },
          paymentProvider: selectedProvider,
          finalAmount,
          currency: orderData.currency,
          item: orderData.item
        })
      });

      if (!saveBillingResponse.ok) {
        const errorData = await saveBillingResponse.json();
        throw new Error(errorData.error || 'Failed to save billing details');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving billing details:', error);
      throw error;
    }
  };

  const handleBillingSubmit = async (billingData) => {
    if (!selectedProvider) {
      alert('Please select a payment provider');
      return;
    }

    if (!isFormValid) {
      alert('Please fill in all required fields');
      return;
    }

    // Early return for PayPal as it has its own flow
    if (selectedProvider === 'PayPal') {
      return;
    }

    try {
      const success = await handlePaymentSubmit(billingData);
      if (!success) {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Billing submission error:', error);
      alert(error.message || 'Payment initiation failed. Please try again.');
    }
  };

  const handleUPIPaymentComplete = () => {
    setShowUPIPage(false);
    setShowAcknowledgment(true);
  };

  const handleBackFromUPI = () => {
    setShowUPIPage(false);
  };

  const renderPayPalButtons = () => {
    console.log('PayPal render conditions:', {
      selectedProvider,
      isFormValid,
      shouldShow: selectedProvider === 'PayPal' && isFormValid
    });

    if (selectedProvider !== 'PayPal') return null;

    // Use the form validity state from our component
    if (!isFormValid) {
      return (
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please fill in all required billing details to proceed with PayPal payment
          </p>
        </div>
      );
    }

    return (
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: orderData.currency,
          intent: "capture",
          components: "buttons",
          disableFunding: "card"
        }}
      >
        <div className="mt-6 flex justify-center">
          <div style={{ width: '300px', colorScheme: 'none' }}>
            <PayPalButtons
              style={{
                layout: "vertical",
                shape: "pill",
                color: "gold",
                label: "pay",
                height: 45
              }}
              createOrder={async () => {
                try {
                  const billingData = billingDetailsRef.current?.getFormData();
                  if (!billingData) {
                    throw new Error('Please fill in all required billing details');
                  }
                  
                  // Save billing details first
                  await saveBillingDetails(billingData);

                  // Create PayPal order
                  console.log('Creating PayPal order with data:', {
                    amount: finalAmount,
                    currency: orderData.currency,
                    orderID: orderData.orderID
                  });

                  const response = await fetch('/api/paypal/create-order', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      amount: finalAmount,
                      currency: orderData.currency,
                      orderID: orderData.orderID,
                      billingDetails: billingData
                    }),
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    console.error('PayPal order creation failed:', {
                      status: response.status,
                      statusText: response.statusText,
                      error: errorData
                    });
                    throw new Error(errorData.error || 'Failed to create PayPal order');
                  }

                  const data = await response.json();
                  console.log('PayPal order created successfully:', data);
                  return data.data.orderID;
                } catch (error) {
                  console.error('PayPal order creation error:', error);
                  alert(error.message || 'Failed to create PayPal order');
                  throw error;
                }
              }}
              onApprove={async (data) => {
                try {
                  const response = await fetch('/api/paypal/capture-payment', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      orderID: orderData.orderID
                    }),
                  });

                  const responseData = await response.json();
                  
                  if (!responseData.success) {
                    throw new Error(responseData.error || 'Failed to capture PayPal payment');
                  }
                  
                  // Redirect to response page with status
                  window.location.href = `/paypal-response?orderId=${orderData.orderID}&status=${responseData.data.status}`;
                } catch (error) {
                  console.error('PayPal capture error:', error);
                  alert(error.message || 'Failed to complete payment');
                  // Redirect to error page
                  window.location.href = `/paypal-response?orderId=${orderData.orderID}&status=ERROR`;
                }
              }}
              onError={(err) => {
                console.error('PayPal error:', err);
                alert('PayPal payment failed. Please try again.');
                // Redirect to error page
                window.location.href = `/paypal-response?orderId=${orderData.orderID}&status=ERROR`;
              }}
              onCancel={() => {
                console.log('Payment cancelled by user');
                window.location.href = `/paypal-response?orderId=${orderData.orderID}&status=CANCELLED`;
              }}
            />
          </div>
        </div>
      </PayPalScriptProvider>
    );
  };

  // Render UPI payment page
  if (showUPIPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <UPIPayment
            orderData={{
              ...orderData,
              totalAmount: finalAmount
            }}
            merchantDetails={{
              ...merchantDetails,
              merchantVPA: process.env.NEXT_PUBLIC_MERCHANT_VPA || merchantDetails.upiId || '',
              payeeName: process.env.NEXT_PUBLIC_MERCHANT_UPI_NAME || merchantDetails.name || ''
            }}
            billingDetails={billingData}
            onPaymentComplete={handleUPIPaymentComplete}
            theme={theme}
            onBackClick={handleBackFromUPI}
            themeToggle={<ThemeToggle />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {showAcknowledgment ? (
        <PaymentAcknowledgmentModal
          orderID={orderData.orderID}
          item={orderData.item}
          currency={orderData.currency}
          amount={finalAmount}
          merchantDetails={merchantDetails}
          paymentProvider={selectedProvider}
        />
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          {/* Header with Logo, Title and Theme Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div className="w-1/3">
              {merchantDetails?.logo && (
                <Image
                  src={theme === 'dark' ? merchantDetails.logo.dark : merchantDetails.logo.light}
                  alt="Merchant Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                  priority
                />
              )}
            </div>
            <div className="w-1/3 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Complete Payment
              </h1>
            </div>
            <div className="w-1/3 flex justify-end">
              <ThemeToggle />
            </div>
          </div>

          {/* Order Summary */}
          <OrderSummary 
            orderData={orderData} 
            merchantDetails={merchantDetails}
            handleChangeFinalAmount={handleChangeFinalAmount}
          />

          {/* Payment Provider Selection - Only show if multiple providers */}
          {availableProviders.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Payment Method
              </h2>
              <div className="flex gap-4">
                {availableProviders.map((provider) => (
                  <PaymentOption
                    key={provider.name}
                    provider={provider}
                    isSelected={selectedProvider === provider.name}
                    onSelect={() => handleProviderChange(provider.name)}
                    theme={theme}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Billing Details Form */}
          <BillingDetails
            ref={billingDetailsRef}
            onSubmit={handleBillingSubmit}
            provider={selectedProvider}
            merchantDetails={merchantDetails}
          />

          {/* PayPal Buttons */}
          {renderPayPalButtons()}
        </div>
      )}
    </div>
  );
};

// Main PaymentCheckout component with PayPal script provider
const PaymentCheckout = (props) => {
  return (
    <PaymentCheckoutContent {...props} />
  );
};

export default PaymentCheckout; 