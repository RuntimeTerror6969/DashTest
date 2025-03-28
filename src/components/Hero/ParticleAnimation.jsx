'use client';
import { useEffect, useRef } from 'react';

export default function ParticleAnimation() {
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
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() * 3 - 1.5) * 0.8;
        this.vy = (Math.random() * 3 - 1.5) * 0.8;
        this.radius = Math.random() * 3 + 1;
        this.baseRadius = this.radius;
        this.pulseSpeed = 0.05;
        this.pulseAmount = 0;
        // Add color properties
        this.hue = Math.random() * 60 - 30; // This will give us colors around blue
        this.colorOffset = Math.random() * 20; // For slight color variation
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges with slight randomization
        if (this.x < 0 || this.x > canvas.width) {
          this.vx *= -1;
          this.vx += (Math.random() - 0.5) * 0.2;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.vy *= -1;
          this.vy += (Math.random() - 0.5) * 0.2;
        }

        // Pulse effect
        this.pulseAmount += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulseAmount) * 0.5;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // Dynamic color based on position and time
        const baseHue = (this.hue + this.pulseAmount * 10) % 360;
        const saturation = 70 + Math.sin(this.pulseAmount) * 20;
        const lightness = 60 + Math.sin(this.pulseAmount) * 10;
        ctx.fillStyle = `hsla(${baseHue}, ${saturation}%, ${lightness}%, ${0.6 + Math.sin(this.pulseAmount) * 0.2})`;
        ctx.fill();
      }
    }

    // Create particles
    const createParticles = () => {
      // Increased particle count
      const particleCount = 150;
      for (let i = 0; i < particleCount; i++) {
        particles.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          )
        );
      }
    };

    // Draw lines between particles
    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            // Create gradient for connection lines
            const gradient = ctx.createLinearGradient(
              particles[i].x, 
              particles[i].y, 
              particles[j].x, 
              particles[j].y
            );
            
            // Get colors from both particles
            const hue1 = (particles[i].hue + particles[i].pulseAmount * 10) % 360;
            const hue2 = (particles[j].hue + particles[j].pulseAmount * 10) % 360;
            
            gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, ${0.3 * (1 - distance / 150)})`);
            gradient.addColorStop(1, `hsla(${hue2}, 70%, 60%, ${0.3 * (1 - distance / 150)})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      // Darker background clear for better contrast
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      drawLines();
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