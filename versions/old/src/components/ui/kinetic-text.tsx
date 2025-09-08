"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

export function KineticText({ 
  text, 
  className = "", 
  delay = 0, 
  duration = 0.8, 
  staggerDelay = 0.05 
}: KineticTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const letters = text.split("");

  return (
    <AnimatePresence>
      {isVisible && (
        <span className={className}>
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ 
                opacity: 0, 
                y: 20, 
                scale: 0.95
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1
              }}
              transition={{
                duration: duration * 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: index * staggerDelay
              }}
              className="inline-block"
              style={{
                transformOrigin: "center bottom",
                transformStyle: "preserve-3d"
              }}
              whileHover={{
                scale: 1.1,
                rotateY: 15,
                transition: { duration: 0.2 }
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </span>
      )}
    </AnimatePresence>
  );
}

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function TypewriterText({ 
  text, 
  className = "", 
  delay = 0, 
  speed = 50 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setIsStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted || currentIndex >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, isStarted]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-0.5 h-6 bg-current ml-1"
        />
      )}
    </span>
  );
}

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: number;
}

export function GlitchText({ 
  text, 
  className = "", 
  intensity = 0.1 
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < intensity) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <motion.span
      className={`${className} relative inline-block`}
      animate={isGlitching ? {
        x: [0, -2, 2, -1, 1, 0],
        textShadow: [
          "0 0 0 transparent",
          "2px 0 0 #ff0000, -2px 0 0 #00ffff",
          "-2px 0 0 #ff0000, 2px 0 0 #00ffff",
          "0 0 0 transparent"
        ]
      } : {}}
      transition={{ duration: 0.15 }}
    >
      {text}
      {isGlitching && (
        <>
          <motion.span
            className="absolute top-0 left-0 text-red-500 opacity-70"
            style={{ clipPath: "inset(0 0 50% 0)" }}
            animate={{ x: [0, 2, -2, 0] }}
            transition={{ duration: 0.1 }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 text-cyan-500 opacity-70"
            style={{ clipPath: "inset(50% 0 0 0)" }}
            animate={{ x: [0, -2, 2, 0] }}
            transition={{ duration: 0.1 }}
          >
            {text}
          </motion.span>
        </>
      )}
    </motion.span>
  );
}