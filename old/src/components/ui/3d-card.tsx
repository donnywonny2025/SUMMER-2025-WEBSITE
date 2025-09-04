"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  rotationFactor?: number;
  scaleFactor?: number;
}

export function Card3D({ 
  children, 
  className = "", 
  rotationFactor = 15, 
  scaleFactor = 1.05 
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [rotationFactor, -rotationFactor]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [-rotationFactor, rotationFactor]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      animate={{
        scale: isHovered ? scaleFactor : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={`relative transform-gpu ${className}`}
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  frequency?: number;
  delay?: number;
}

export function FloatingElement({ 
  children, 
  className = "", 
  amplitude = 10, 
  frequency = 2, 
  delay = 0 
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
        rotateY: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration: frequency,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  speed?: number;
}

export function ParallaxLayer({ 
  children, 
  className = "", 
  depth = 1, 
  speed = 0.5 
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useState(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const yPos = -(scrollY * speed);
  const scale = 1 + (scrollY * 0.0001 * depth);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(0, ${yPos}px, ${depth * 10}px) scale(${scale})`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}

interface CubeProps {
  size?: number;
  className?: string;
  rotationSpeed?: number;
}

export function AnimatedCube({ 
  size = 100, 
  className = "", 
  rotationSpeed = 10 
}: CubeProps) {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1000px" }}>
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: rotationSpeed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Cube faces */}
        <div
          className="absolute bg-gradient-to-br from-blue-500 to-purple-600 opacity-80"
          style={{
            width: size,
            height: size,
            transform: `translateZ(${size / 2}px)`,
          }}
        />
        <div
          className="absolute bg-gradient-to-br from-purple-500 to-pink-600 opacity-80"
          style={{
            width: size,
            height: size,
            transform: `rotateY(90deg) translateZ(${size / 2}px)`,
          }}
        />
        <div
          className="absolute bg-gradient-to-br from-pink-500 to-red-600 opacity-80"
          style={{
            width: size,
            height: size,
            transform: `rotateY(180deg) translateZ(${size / 2}px)`,
          }}
        />
        <div
          className="absolute bg-gradient-to-br from-red-500 to-orange-600 opacity-80"
          style={{
            width: size,
            height: size,
            transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
          }}
        />
        <div
          className="absolute bg-gradient-to-br from-orange-500 to-yellow-600 opacity-80"
          style={{
            width: size,
            height: size,
            transform: `rotateX(90deg) translateZ(${size / 2}px)`,
          }}
        />
        <div
          className="absolute bg-gradient-to-br from-yellow-500 to-green-600 opacity-80"
          style={{
            width: size,
            height: size,
            transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
          }}
        />
      </motion.div>
    </div>
  );
}