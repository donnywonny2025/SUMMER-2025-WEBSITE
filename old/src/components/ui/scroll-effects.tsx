"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// CSS Scroll-Driven Animation Component
export function ScrollReveal({ 
  children, 
  className,
  direction = 'up',
  delay = 0,
  duration = 1000
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'rotate';
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // CSS Scroll-driven animation using modern CSS
    const animationName = `scroll-reveal-${direction}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create keyframes dynamically
    const keyframes = {
      up: `
        @keyframes ${animationName} {
          from { 
            opacity: 0; 
            transform: translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `,
      down: `
        @keyframes ${animationName} {
          from { 
            opacity: 0; 
            transform: translateY(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `,
      left: `
        @keyframes ${animationName} {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
      `,
      right: `
        @keyframes ${animationName} {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
      `,
      scale: `
        @keyframes ${animationName} {
          from { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
      `,
      rotate: `
        @keyframes ${animationName} {
          from { 
            opacity: 0; 
            transform: rotate(-10deg) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: rotate(0deg) scale(1); 
          }
        }
      `
    };

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = keyframes[direction];
    document.head.appendChild(style);

    // Apply animation with view timeline
    element.style.animation = `${animationName} ${duration}ms ease-out both`;
    (element.style as any).animationTimeline = 'view()';
    (element.style as any).animationRange = 'entry 0% entry 100%';
    element.style.animationDelay = `${delay}ms`;

    return () => {
      document.head.removeChild(style);
    };
  }, [direction, delay, duration]);

  return (
    <div ref={ref} className={cn('scroll-reveal', className)}>
      {children}
    </div>
  );
}

// Parallax Scroll Component
export function ParallaxElement({ 
  children, 
  speed = 0.5,
  className 
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animationName = `parallax-${Math.random().toString(36).substr(2, 9)}`;
    
    const keyframes = `
      @keyframes ${animationName} {
        from { transform: translateY(${speed * 100}px); }
        to { transform: translateY(${speed * -100}px); }
      }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    element.style.animation = `${animationName} linear both`;
    (element.style as any).animationTimeline = 'scroll()';

    return () => {
      document.head.removeChild(style);
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn('parallax-element', className)}>
      {children}
    </div>
  );
}

// Scroll Progress Indicator
export function ScrollProgress({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animationName = `scroll-progress-${Math.random().toString(36).substr(2, 9)}`;
    
    const keyframes = `
      @keyframes ${animationName} {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    element.style.animation = `${animationName} linear both`;
    (element.style as any).animationTimeline = 'scroll()';
    element.style.transformOrigin = 'left';

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={cn(
        'fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50',
        className
      )}
    />
  );
}

// Morphing Background Component
export function MorphingBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Morphing gradient mesh */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.3) 0%, transparent 50%)
            `,
            animation: 'morphing-gradient 20s ease-in-out infinite'
          }}
        />
        
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'multiply'
          }}
        />
      </div>
    </div>
  );
}

// Advanced Backdrop Filter Component
export function GlassyBackdrop({ 
  children, 
  className,
  blur = 12,
  opacity = 0.8
}: {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  opacity?: number;
}) {
  return (
    <div 
      className={cn(
        'relative backdrop-blur-md border border-white/20 rounded-xl',
        className
      )}
      style={{
        backdropFilter: `blur(${blur}px) saturate(180%)`,
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.37),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
          inset 0 -1px 0 0 rgba(255, 255, 255, 0.2)
        `
      }}
    >
      {children}
    </div>
  );
}