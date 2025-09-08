"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export function ParticleSystem({
  className,
  particleCount = 50,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
  interactive = true
}: {
  className?: string;
  particleCount?: number;
  colors?: string[];
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: Math.random() * 100,
          maxLife: 100
        });
      }
    };
    initParticles();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.1;
            particle.vy += (dy / distance) * force * 0.1;
          }
        }

        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Update opacity based on life
        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = Math.max(0, 0.7 - lifeRatio * 0.5);

        // Reset particle if it's too old
        if (particle.life > particle.maxLife) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * 2;
          particle.vy = (Math.random() - 0.5) * 2;
          particle.life = 0;
          particle.color = colors[Math.floor(Math.random() * colors.length)];
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.restore();
      });

      // Draw connections between nearby particles
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.save();
            ctx.globalAlpha = (120 - distance) / 120 * 0.2;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation when component becomes visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          animate();
        } else if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
    };
  }, [particleCount, colors, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'absolute inset-0 pointer-events-none opacity-60',
        interactive && 'pointer-events-auto',
        className
      )}
      style={{ zIndex: 1 }}
    />
  );
}

// Floating geometric shapes
export function FloatingShapes({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Triangle */}
      <div 
        className="absolute top-20 left-1/4 w-0 h-0 opacity-20"
        style={{
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '25px solid #3b82f6',
          animation: 'float-gentle 8s ease-in-out infinite'
        }}
      />
      
      {/* Circle */}
      <div 
        className="absolute top-1/3 right-1/4 w-8 h-8 bg-purple-500 rounded-full opacity-20"
        style={{
          animation: 'float-gentle 6s ease-in-out infinite reverse'
        }}
      />
      
      {/* Square */}
      <div 
        className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-cyan-500 opacity-20"
        style={{
          animation: 'float-gentle 10s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
      
      {/* Hexagon */}
      <div 
        className="absolute top-1/2 right-1/3 opacity-20"
        style={{
          width: '20px',
          height: '11.55px',
          backgroundColor: '#10b981',
          position: 'relative',
          animation: 'float-gentle 7s ease-in-out infinite',
          animationDelay: '1s'
        }}
      >
        <div
          style={{
            content: '',
            position: 'absolute',
            top: '-5.77px',
            left: '0',
            width: '0',
            height: '0',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '5.77px solid #10b981'
          }}
        />
        <div
          style={{
            content: '',
            position: 'absolute',
            bottom: '-5.77px',
            left: '0',
            width: '0',
            height: '0',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '5.77px solid #10b981'
          }}
        />
      </div>
    </div>
  );
}

// Morphing blob background
export function MorphingBlob({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div 
        className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          animation: 'morphing-gradient 15s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
          animation: 'morphing-gradient 20s ease-in-out infinite reverse'
        }}
      />
    </div>
  );
}