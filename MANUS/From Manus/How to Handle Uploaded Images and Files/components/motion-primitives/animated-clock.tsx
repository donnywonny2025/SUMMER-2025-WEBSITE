'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export type AnimatedClockProps = {
  size?: number;
  showDigital?: boolean;
  className?: string;
  timezone?: string;
};

export function AnimatedClock({
  size = 200,
  showDigital = true,
  className = '',
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
}: AnimatedClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate rotation angles
  const hourAngle = (hours * 30) + (minutes * 0.5); // 30° per hour + 0.5° per minute
  const minuteAngle = minutes * 6; // 6° per minute
  const secondAngle = seconds * 6; // 6° per second

  const center = size / 2;
  const hourLength = size * 0.25;
  const minuteLength = size * 0.35;
  const secondLength = size * 0.4;

  return (
    <div className={`animated-clock ${className}`} style={{ width: size, height: size }}>
      {/* Clock Face */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="clock-face"
      >
        {/* Outer ring */}
        <circle
          cx={center}
          cy={center}
          r={center - 2}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />

        {/* Inner ring */}
        <circle
          cx={center}
          cy={center}
          r={center - 8}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />

        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x1 = center + Math.cos(angle) * (center - 15);
          const y1 = center + Math.sin(angle) * (center - 15);
          const x2 = center + Math.cos(angle) * (center - 25);
          const y2 = center + Math.sin(angle) * (center - 25);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Minute markers */}
        {Array.from({ length: 60 }, (_, i) => {
          if (i % 5 === 0) return null; // Skip hour markers
          const angle = (i * 6) * (Math.PI / 180);
          const x1 = center + Math.cos(angle) * (center - 12);
          const y1 = center + Math.sin(angle) * (center - 12);
          const x2 = center + Math.cos(angle) * (center - 18);
          const y2 = center + Math.sin(angle) * (center - 18);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Hour Hand */}
        <motion.line
          x1={center}
          y1={center}
          x2={center + Math.sin(hourAngle * Math.PI / 180) * hourLength}
          y2={center - Math.cos(hourAngle * Math.PI / 180) * hourLength}
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ rotate: hourAngle }}
          animate={{ rotate: hourAngle }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Minute Hand */}
        <motion.line
          x1={center}
          y1={center}
          x2={center + Math.sin(minuteAngle * Math.PI / 180) * minuteLength}
          y2={center - Math.cos(minuteAngle * Math.PI / 180) * minuteLength}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ rotate: minuteAngle }}
          animate={{ rotate: minuteAngle }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Second Hand */}
        <motion.line
          x1={center}
          y1={center}
          x2={center + Math.sin(secondAngle * Math.PI / 180) * secondLength}
          y2={center - Math.cos(secondAngle * Math.PI / 180) * secondLength}
          stroke="#00ff88"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ rotate: secondAngle }}
          animate={{ rotate: secondAngle }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="6"
          fill="rgba(255,255,255,0.9)"
        />
        <circle
          cx={center}
          cy={center}
          r="3"
          fill="#00ff88"
        />
      </svg>

      {/* Digital Time Display */}
      {showDigital && (
        <motion.div
          className="digital-time"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '10px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)'
          }}
        >
          <div style={{ fontSize: '18px', color: '#00ff88', marginBottom: '2px' }}>
            {time.toLocaleTimeString('en-US', {
              hour12: true,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
            {timezone.replace('_', ' ')}
          </div>
        </motion.div>
      )}
    </div>
  );
}