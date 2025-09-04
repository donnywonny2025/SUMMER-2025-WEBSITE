"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  identifier?: string;
}

export const GlowCard = ({
  children,
  className,
  glowColor = "rgba(59, 130, 246, 0.5)",
  identifier,
}: GlowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-200/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-slate-200/40 hover:bg-white/10",
        className
      )}
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${glowColor}, transparent 40%)`,
        }}
      />
      
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
};

export const SkillCard = ({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <GlowCard className={cn("h-full", className)} glowColor="rgba(139, 92, 246, 0.3)">
      <div className="flex flex-col h-full">
        {icon && (
          <div className="mb-4 text-purple-400 group-hover:text-purple-300 transition-colors">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-500 transition-colors">
          {description}
        </p>
      </div>
    </GlowCard>
  );
};

export const ProjectCard = ({
  title,
  description,
  image,
  tags,
  className,
}: {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  className?: string;
}) => {
  return (
    <GlowCard className={cn("h-full", className)} glowColor="rgba(6, 182, 212, 0.3)">
      <div className="flex flex-col h-full">
        {image && (
          <div className="mb-4 aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow group-hover:text-slate-500 transition-colors">
          {description}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md group-hover:bg-slate-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </GlowCard>
  );
};