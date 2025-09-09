'use client';
import React, { useEffect, useState } from 'react';
import { SlidingNumber } from './sliding-number';

export function DigitalClock() {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
      setTimeString(timeString);
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parse the time string to get individual components
  const [time, period] = timeString.split(' ');
  const [hours, minutes, seconds] = time ? time.split(':') : ['', '', ''];

  if (!timeString) {
    return <div className='flex items-center gap-0.5 font-mono text-zinc-400'>--:--:--</div>;
  }

  return (
    <div
      className='flex items-center gap-0.5 font-mono text-zinc-400 hover:text-white transition-colors duration-300 cursor-pointer'
      style={{
        fontSize: '14px',
        fontWeight: '300'
      }}
    >
      <SlidingNumber value={parseInt(hours) || 0} padStart={true} />
      <span className='text-zinc-500 hover:text-zinc-300 transition-colors duration-300'>:</span>
      <SlidingNumber value={parseInt(minutes) || 0} padStart={true} />
      <span className='text-zinc-500 hover:text-zinc-300 transition-colors duration-300'>:</span>
      <SlidingNumber
        value={parseInt(seconds) || 0}
        padStart={true}
      />
      <span className='text-zinc-400 text-sm ml-2 hover:text-zinc-200 transition-colors duration-300'>{period}</span>
    </div>
  );
}