'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ParticleAnimation from './ParticleAnimation';

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    '/hero-1.jpg',
    '/hero-2.jpg',
    '/hero-3.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Hero image ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Particle Animation Overlay */}
      <div className="absolute inset-0 bg-black/50">
        <ParticleAnimation />
      </div>

      {/* Content */}
      <div className="absolute inset-0">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white relative z-10">
            <h1 className="text-6xl font-bold mb-6">
              Welcome to Our Platform
            </h1>
            <p className="text-xl mb-8">
              Discover our innovative solutions for your business needs
            </p>
            <button className="px-6 py-3 bg-primary rounded-full hover:bg-primary/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 