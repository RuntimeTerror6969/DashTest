'use client';
import { useEffect, useRef } from 'react';

export default function ProductStreakAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.75;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
      constructor() {
        // Start position can be bottom-left or left side
        const isUpwardDiagonal = Math.random() < 0.4; // 40% chance for diagonal streaks
        this.x = -20;
        this.y = isUpwardDiagonal 
          ? canvas.height + 20 // Start below canvas for upward streaks
          : Math.random() * canvas.height; // Random height for horizontal streaks

        // Adjust velocity based on streak type
        this.vx = Math.random() * 2 + 3; // Base horizontal speed
        this.vy = isUpwardDiagonal 
          ? -(Math.random() * 2 + 1) // Upward velocity for diagonal streaks
          : (Math.random() - 0.5) * 0.5; // Slight vertical drift for horizontal streaks
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
        this.pulseSpeed = 0.05;
        this.pulseAmount = Math.random() * Math.PI * 2; // Random starting phase
        this.length = Math.random() * 50 + 50; // Length of the streak

        // Enhanced color palette with multiple possible hues
        const colorPalettes = [
          { hue: 210, sat: 80, light: 65 },  // Vibrant blue
          { hue: 240, sat: 70, light: 60 },  // Purple
          { hue: 190, sat: 85, light: 60 },  // Teal
          { hue: 220, sat: 75, light: 70 },  // Light blue
          { hue: 45, sat: 90, light: 65 },   // Gold
          { hue: 330, sat: 85, light: 65 },  // Pink
          { hue: 0, sat: 80, light: 60 }     // Red
        ];
        const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        this.hue = palette.hue + Math.random() * 20;
        this.saturation = palette.sat + Math.random() * 20;
        this.brightness = palette.light + Math.random() * 15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Reset particle when it goes off screen
        if (this.x > canvas.width + this.length) {
          this.reset();
        }

        // Subtle vertical bouncing
        if (this.y < 0 || this.y > canvas.height) {
          this.vy *= -1;
        }

        // Pulse effect
        this.pulseAmount += this.pulseSpeed;
      }

      reset() {
        const isUpwardDiagonal = Math.random() < 0.4;
        this.x = -this.length;
        this.y = isUpwardDiagonal
          ? canvas.height + 20
          : Math.random() * canvas.height;
        this.vx = Math.random() * 2 + 3;
        this.vy = isUpwardDiagonal
          ? -(Math.random() * 2 + 1)
          : (Math.random() - 0.5) * 0.5;
      }

      draw() {
        ctx.beginPath();
        
        const gradient = ctx.createLinearGradient(
          this.x, this.y,
          this.x - this.length, this.y
        );

        // Increased base opacity for more vibrant appearance
        const opacity = 0.4 + Math.sin(this.pulseAmount) * 0.3;

        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.radius * (1 + Math.sin(this.pulseAmount) * 0.3);
        
        // Draw the streak
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y);
        ctx.stroke();
      }
    }

    // Create particles
    const createParticles = () => {
      const particleCount = 50; // Fewer particles for cleaner look
      for (let i = 0; i < particleCount; i++) {
        const particle = new Particle();
        // Distribute initial x positions
        particle.x = Math.random() * canvas.width;
        particles.push(particle);
      }
    };

    // Animation loop
    const animate = () => {
      // Semi-transparent clear for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-transparent"
    />
  );
} 