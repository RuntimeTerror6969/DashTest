'use client'
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const CURRENCIES = {
    USD: {
        symbol: '$',
        flag: '🇺🇸',
        label: 'USD ($)'
    },
    INR: {
        symbol: '₹',
        flag: '🇮🇳',
        label: 'INR (₹)'
    }
}

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';
const FALLBACK_RATE = 83; // Default USDINR rate if API fails

const ProductCurrencySelector = ({ onCurrencyChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCurrency, setSelectedCurrency] = useState('USD')
    const [exchangeRate, setExchangeRate] = useState(FALLBACK_RATE)
    
    // Fetch exchange rate
    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch(EXCHANGE_RATE_API);
                if (!response.ok) throw new Error('Failed to fetch exchange rate');
                
                const data = await response.json();
                const rate = data.rates.INR;
                
                if (rate) {
                    setExchangeRate(rate);
                    // If currency is already INR, update with new rate
                    if (selectedCurrency === 'INR') {
                        onCurrencyChange('INR', rate);
                    }
                }
            } catch (error) {
                console.error('Error fetching exchange rate:', error);
                // Use fallback rate
                setExchangeRate(FALLBACK_RATE);
            }
        };

        fetchExchangeRate();
        // Set up periodic refresh (every hour)
        const intervalId = setInterval(fetchExchangeRate, 3600000);
        
        return () => clearInterval(intervalId);
    }, [onCurrencyChange]);
    
    // Auto-detect currency based on user's location
    useEffect(() => {
        const detectCurrency = async () => {
            try {
                // Check localStorage first
                const savedCurrency = localStorage.getItem('preferredProductCurrency');
                if (savedCurrency && CURRENCIES[savedCurrency]) {
                    setSelectedCurrency(savedCurrency);
                    onCurrencyChange(savedCurrency, exchangeRate);
                    return;
                }

                // If no saved preference, detect based on location
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch('https://ipapi.co/json/', {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'StarLightTrader/1.0'
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) throw new Error('Failed to fetch location data');

                const data = await response.json();
                const detectedCurrency = data.country === 'IN' ? 'INR' : 'USD';
                setSelectedCurrency(detectedCurrency);
                localStorage.setItem('preferredProductCurrency', detectedCurrency);
                onCurrencyChange(detectedCurrency, exchangeRate);

            } catch (error) {
                console.error('Error detecting currency:', error);
                setSelectedCurrency('USD');
                localStorage.setItem('preferredProductCurrency', 'USD');
                onCurrencyChange('USD', exchangeRate);
            }
        };

        detectCurrency();
    }, [onCurrencyChange, exchangeRate]);

    const handleCurrencyChange = (code) => {
        setSelectedCurrency(code);
        localStorage.setItem('preferredProductCurrency', code);
        onCurrencyChange(code, exchangeRate);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{CURRENCIES[selectedCurrency].flag}</span>
                <span>{CURRENCIES[selectedCurrency].label}</span>
                <ChevronDown className="h-4 w-4" />
            </button>
            
            <div className={`${isOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50`}>
                <div className="py-1">
                    {Object.entries(CURRENCIES).map(([code, { flag, label }]) => (
                        <button 
                            key={code}
                            onClick={() => handleCurrencyChange(code)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span>{flag}</span>
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductCurrencySelector 