"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Gradient text with morphing colors
export function MorphingText({ 
  children, 
  className,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
  duration = 4000
}: {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animationName = `morphing-text-${Math.random().toString(36).substr(2, 9)}`;
    
    const keyframes = `
      @keyframes ${animationName} {
        ${colors.map((color, index) => {
          const percentage = (index / (colors.length - 1)) * 100;
          return `${percentage}% { 
            background: linear-gradient(45deg, ${color}, ${colors[(index + 1) % colors.length]});
            -webkit-background-clip: text;
            background-clip: text;
          }`;
        }).join('\n')}
      }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    element.style.background = `linear-gradient(45deg, ${colors.join(', ')})`;
    (element.style as any).webkitBackgroundClip = 'text';
    (element.style as any).backgroundClip = 'text';
    (element.style as any).webkitTextFillColor = 'transparent';
    element.style.animation = `${animationName} ${duration}ms ease-in-out infinite`;

    return () => {
      document.head.removeChild(style);
    };
  }, [colors, duration]);

  return (
    <span ref={ref} className={cn('inline-block font-bold', className)}>
      {children}
    </span>
  );
}

// Glitch text effect
export function GlitchText({ 
  children, 
  className,
  intensity = 'medium'
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}) {
  const intensityValues = {
    low: { offset: '2px', duration: '3s' },
    medium: { offset: '4px', duration: '2s' },
    high: { offset: '6px', duration: '1s' }
  };

  const config = intensityValues[intensity];

  return (
    <span 
      className={cn('relative inline-block', className)}
      style={{
        animation: `glitch-${intensity} ${config.duration} infinite linear alternate-reverse`
      }}
    >
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute top-0 left-0 w-full h-full text-red-500 opacity-80"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          transform: `translateX(-${config.offset})`,
          animation: `glitch-${intensity}-1 ${config.duration} infinite linear alternate-reverse`
        }}
      >
        {children}
      </span>
      <span 
        className="absolute top-0 left-0 w-full h-full text-cyan-500 opacity-80"
        style={{
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          transform: `translateX(${config.offset})`,
          animation: `glitch-${intensity}-2 ${config.duration} infinite linear alternate-reverse`
        }}
      >
        {children}
      </span>
    </span>
  );
}

// Neon glow text
export function NeonText({ 
  children, 
  className,
  color = '#3b82f6',
  glowIntensity = 'medium'
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
}) {
  const glowValues = {
    low: '10px',
    medium: '20px',
    high: '30px'
  };

  const glow = glowValues[glowIntensity];

  return (
    <span 
      className={cn('inline-block font-bold', className)}
      style={{
        color: color,
        textShadow: `
          0 0 5px ${color},
          0 0 ${glow} ${color},
          0 0 ${parseInt(glow) * 1.5}px ${color},
          0 0 ${parseInt(glow) * 2}px ${color}
        `,
        animation: 'neon-flicker 2s infinite alternate'
      }}
    >
      {children}
    </span>
  );
}

// Liquid text effect
export function LiquidText({ 
  children, 
  className,
  colors = ['#3b82f6', '#8b5cf6']
}: {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
}) {
  return (
    <span 
      className={cn('inline-block font-bold relative', className)}
      style={{
        background: `linear-gradient(45deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'liquid-flow 4s ease-in-out infinite'
      }}
    >
      {children}
    </span>
  );
}

// Typewriter with cursor
export function TypewriterWithCursor({ 
  text, 
  className,
  speed = 100,
  delay = 0,
  showCursor = true
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
}) {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsComplete(true);
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay]);

  return (
    <span className={cn('inline-block', className)}>
      {displayText}
      {showCursor && (
        <span 
          className={cn(
            'inline-block w-0.5 h-1em bg-current ml-1',
            isComplete ? 'animate-pulse' : 'animate-pulse'
          )}
          style={{
            animation: 'cursor-blink 1s infinite'
          }}
        />
      )}
    </span>
  );
}

// Shimmering text
export function ShimmerText({ 
  children, 
  className,
  duration = 2000
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <span 
      className={cn('inline-block relative overflow-hidden', className)}
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        animation: `shimmer ${duration}ms ease-in-out infinite`
      }}
    >
      {children}
    </span>
  );
}

// 3D text effect
export function Text3D({ 
  children, 
  className,
  depth = 3,
  color = '#3b82f6'
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  color?: string;
}) {
  const shadows = Array.from({ length: depth }, (_, i) => 
    `${i + 1}px ${i + 1}px 0 ${color}`
  ).join(', ');

  return (
    <span 
      className={cn('inline-block font-bold', className)}
      style={{
        textShadow: shadows,
        transform: 'perspective(500px) rotateX(15deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </span>
  );
}