"use client";
import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export const Spotlight = ({ className, fill }: SpotlightProps) => {
  return (
    <svg
      className={cn(
        "animate-pulse pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        ></ellipse>
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
};

export const SpotlightCard = ({
  children,
  className,
  spotlightColor = "rgba(255, 255, 255, 0.2)",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className="absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const HeroSpotlight = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative", className)}>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 opacity-30 animate-pulse"
        fill="url(#spotlight-gradient)"
      />
      <svg width="0" height="0">
        <defs>
          <linearGradient id="spotlight-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};