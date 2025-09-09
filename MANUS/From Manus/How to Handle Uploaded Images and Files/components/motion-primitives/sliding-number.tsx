'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type SlidingNumberProps = {
  value: number;
  padStart?: boolean;
  className?: string;
};

export function SlidingNumber({
  value,
  padStart = false,
  className = ''
}: SlidingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const formatNumber = (num: number) => {
    if (padStart) {
      return num.toString().padStart(2, '0');
    }
    return num.toString();
  };

  const digits = formatNumber(displayValue).split('');

  return (
    <div className={`sliding-number ${className}`}>
      <AnimatePresence mode="popLayout">
        {digits.map((digit, index) => (
          <motion.div
            key={`${digit}-${index}`}
            initial={{ y: isAnimating ? 20 : 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            style={{
              display: 'inline-block',
              fontVariantNumeric: 'tabular-nums',
              fontFeatureSettings: '"tnum"',
            }}
          >
            {digit}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}