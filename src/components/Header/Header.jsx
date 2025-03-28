'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';

// Define default navigation items outside the component
const defaultNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/#products' },
  { label: 'About Us', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header({ navItems = defaultNavItems, showDashboardButton = false, rightContent }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Change to use logo.svg
  const logoSrc = '/logo.svg';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 
      bg-white/95 
      dark:bg-[#101827]/95 
      backdrop-blur 
      supports-[backdrop-filter]:bg-white/75 
      supports-[backdrop-filter]:dark:bg-[#101827]/90"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src={logoSrc}
            alt="Logo" 
            width={64} 
            height={64}
            priority
            className="w-16 h-16"
          />
          <h2 className="text-lg font-mokoto text-gray-900 dark:text-white">Quant Trader Tools</h2>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-base font-medium text-gray-700 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {rightContent}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 