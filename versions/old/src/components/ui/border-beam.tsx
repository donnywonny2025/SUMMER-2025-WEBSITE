"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export default function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={{
        "--duration": `${duration}s`,
        "--delay": `${delay}s`,
      } as React.CSSProperties}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        "before:absolute before:inset-0 before:rounded-[inherit] before:p-[2px]",
        "before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500",
        "before:animate-border-beam before:[animation-delay:var(--delay)]",
        "before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
        "before:[mask-composite:xor]",
        className,
      )}
    />
  );
}

// Enhanced Card with Border Beam
export function BorderBeamCard({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg border border-gray-200 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 dark:border-gray-700 dark:bg-black/20",
        className
      )}
      {...props}
    >
      <BorderBeam size={250} duration={12} delay={9} />
      {children}
    </div>
  );
}

// Project Card with Border Beam
export function ProjectBeamCard({ 
  title, 
  description, 
  tech, 
  className 
}: { 
  title: string;
  description: string;
  tech: string[];
  className?: string;
}) {
  return (
    <BorderBeamCard className={cn("group cursor-pointer", className)}>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tech.map((item, index) => (
            <span 
              key={index}
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </BorderBeamCard>
  );
}