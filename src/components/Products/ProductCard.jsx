'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ProductCard({ title, description, images, slug }) {
  const [mousePosition, setMousePosition] = useState(100);
  const imageContainerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    setMousePosition(percentage);
  };

  const handleMouseLeave = () => {
    setMousePosition(100);
  };

  return (
    <Link href={`/${slug}`}>
      <div className="rounded-lg overflow-hidden border border-border/40 bg-white dark:bg-black hover:shadow-lg transition-shadow">
        <div 
          ref={imageContainerRef}
          className="relative h-48 cursor-pointer overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Primary Image */}
          <Image
            src={images.primary}
            alt={`${title} - Primary`}
            fill
            className="object-cover"
            priority
          />
          {/* Secondary Image with Reveal Effect */}
          <div 
            className="absolute top-0 left-0 h-full transition-transform duration-0 ease-linear"
            style={{ 
              width: '100%',
              transform: `translateX(-${mousePosition}%)`,
            }}
          >
            <Image
              src={images.secondary}
              alt={`${title} - Secondary`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2 text-center text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">{description}</p>
          <span className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            Learn More
          </span>
        </div>
      </div>
    </Link>
  );
} 