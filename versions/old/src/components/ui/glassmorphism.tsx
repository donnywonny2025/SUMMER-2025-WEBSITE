"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: "low" | "medium" | "high";
  border?: boolean;
  shadow?: boolean;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  blur = "md",
  opacity = "medium",
  border = true,
  shadow = true,
  hover = true,
}: GlassCardProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  const opacityClasses = {
    low: "bg-white/10",
    medium: "bg-white/20",
    high: "bg-white/30",
  };

  const baseClasses = `
    ${blurClasses[blur]}
    ${opacityClasses[opacity]}
    ${border ? "border border-white/20" : ""}
    ${shadow ? "shadow-xl shadow-black/10" : ""}
    rounded-xl
    relative
    overflow-hidden
  `;

  const Component = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        whileHover: {
          scale: 1.02,
          y: -5,
          transition: { duration: 0.2 },
        },
        whileTap: { scale: 0.98 },
      }
    : {};

  return (
    <Component
      className={`${baseClasses} ${className}`}
      {...motionProps}
    >
      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
}

interface GlassNavProps {
  children: ReactNode;
  className?: string;
  fixed?: boolean;
}

export function GlassNav({ children, className = "", fixed = true }: GlassNavProps) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        ${fixed ? "fixed top-0 left-0 right-0 z-50" : ""}
        backdrop-blur-lg bg-white/10
        border-b border-white/20
        shadow-lg shadow-black/5
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.nav>
  );
}

interface GlassButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}

export function GlassButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
}: GlassButtonProps) {
  const variantClasses = {
    primary: "bg-blue-500/20 border-blue-400/30 text-blue-100 hover:bg-blue-500/30",
    secondary: "bg-white/10 border-white/20 text-white hover:bg-white/20",
    accent: "bg-purple-500/20 border-purple-400/30 text-purple-100 hover:bg-purple-500/30",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        backdrop-blur-md
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        border rounded-lg
        font-medium
        transition-all duration-200
        relative overflow-hidden
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface GlassModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function GlassModal({ children, isOpen, onClose, className = "" }: GlassModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          backdrop-blur-xl bg-white/20
          border border-white/30
          rounded-2xl shadow-2xl
          max-w-lg w-full max-h-[90vh] overflow-auto
          relative
          ${className}
        `}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-2xl pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface GlassTooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function GlassTooltip({ 
  children, 
  content, 
  position = "top", 
  className = "" 
}: GlassTooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className={`
        absolute ${positionClasses[position]}
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
        z-50
      `}>
        <div className="
          backdrop-blur-md bg-black/80
          text-white text-sm
          px-3 py-2 rounded-lg
          border border-white/20
          shadow-lg
          whitespace-nowrap
        ">
          {content}
        </div>
      </div>
    </div>
  );
}