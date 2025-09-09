'use client';
import React, { useEffect, useState } from 'react';

export type AnimatedCounterProps = {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(from + (to - from) * progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [from, to, duration]);

  return (
    <span className={className}>
      {count.toLocaleString()}
    </span>
  );
}