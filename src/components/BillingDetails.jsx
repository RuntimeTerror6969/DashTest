'use client';

import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useTheme } from 'next-themes';

// Add custom styles for phone input
const phoneInputCustomStyles = `
  .PhoneInput {
    display: flex;
    align-items: center;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.5rem;
    background-color: white;
  }

  .dark .PhoneInput {
    background-color: #374151;
    border-color: #4B5563;
  }

  .PhoneInputInput {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: #111827;
    padding-left: 0.5rem;
  }

  .dark .PhoneInputInput {
    color: white;
  }

  .PhoneInputCountry {
    margin-right: 0.5rem;
  }

  .dark .PhoneInputCountrySelect {
    color: white;
    background-color: #374151;
  }

  .dark .PhoneInputCountrySelectArrow {
    color: white;
  }
`;

const BillingDetails = forwardRef(({ onSubmit, provider, merchantDetails }, ref) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailID: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    getFormData: () => {
      if (formRef.current?.checkValidity()) {
        return formData;
      }
      formRef.current?.reportValidity();
      return null;
    },
    validateForm: () => {
      return formRef.current?.checkValidity() || false;
    }
  }));

  // Check form validity whenever form data changes
  useEffect(() => {
    const isValid = Object.entries(formData).every(([key, value]) => {
      // Check if all required fields have values
      if (['firstName', 'lastName', 'emailID', 'phoneNumber', 'city', 'state', 'country'].includes(key)) {
        return value && value.trim() !== '';
      }
      return true;
    });
    setIsFormValid(isValid);
    
    // Always dispatch the event
    const event = new CustomEvent('formValidityChanged', { detail: isValid });
    window.dispatchEvent(event);
  }, [formData]);

  useEffect(() => {
    // Add custom styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = phoneInputCustomStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper function to get payment button path
  const getPaymentButtonPath = (providerName) => {
    if (!providerName) return null;
    
    const normalizedProvider = providerName.toLowerCase().replace(/\s+/g, '');
    const buttonPath = `/assets/paymentButtons/pay_with_${normalizedProvider}.svg`;
    
    // Check if the button exists
    return buttonPath;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Billing Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Please enter your KYC details for us to send the invoice once the transaction is complete.
        </p>
      </div>
      {/* Billing Details */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="emailID"
              required
              value={formData.emailID}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your email address"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Telegram Mobile Number <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={formData.phoneNumber}
              onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
              className="phone-input-wrapper"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                     text-gray-900 dark:text-white"
            placeholder="Enter your street address"
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your city"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your state"
            />
          </div>
        </div>

        {/* Country and PIN Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your country"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              PIN / ZIP Code
            </label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your PIN/ZIP code"
            />
          </div>
        </div>

        {/* Submit Button - Show SVG button for non-PayPal providers */}
        {provider && provider !== 'PayPal' && (
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`relative w-full max-w-md h-14 rounded-lg overflow-hidden transition-opacity ${
                !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              <Image
                src={getPaymentButtonPath(provider)}
                alt={`Pay with ${provider}`}
                fill
                className="object-contain"
                priority
              />
            </button>
          </div>
        )}
      </form>
    </div>
  );
});

BillingDetails.displayName = 'BillingDetails';

export default BillingDetails; 