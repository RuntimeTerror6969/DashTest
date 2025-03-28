'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Change the logo source to use logo.svg
  const logoSrc = '/logo.svg';  // Remove the theme-based logic since we're using a specific footer logo

  return (
    <footer className="bg-white dark:bg-black border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Image 
                src={logoSrc}
                alt="Company Logo" 
                width={80} 
                height={80}
                priority
                className="w-20 h-20"
              />
              <h2 className="text-lg font-mokoto text-gray-900 dark:text-white">Quant Trader Tools</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Providing innovative SaaS solutions in communications and financial automation at cost effective prices.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://telegram.me/diliprk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
              >
                <img 
                  src="/telegramLogo.svg" 
                  alt="Telegram" 
                  className="w-5 h-5" 
                />
              </a>
              <a 
                href="https://www.youtube.com/@QuantCopier" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
              >
                <img 
                  src="/youtubeLogo.svg" 
                  alt="YouTube" 
                  className="w-8 h-8 -mt-1.5"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">Home</Link></li>
              <li><Link href="#products" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">Products</Link></li>
              <li><Link href="#about" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">About Us</Link></li>
              <li><Link href="#contact" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/legal/privacy" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/legal/refund" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                quantcopier(a)gmail.com
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                +91-7708385885
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-gray-700 dark:text-gray-300">
            © {currentYear} QuantTradeTools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 