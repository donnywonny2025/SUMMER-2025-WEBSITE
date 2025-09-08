"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: any;
}

export default function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

// Skill Card for Marquee
export function SkillMarqueeCard({ skill, icon }: { skill: string; icon: string }) {
  return (
    <div className="relative mx-2 flex h-16 w-32 items-center justify-center rounded-lg border border-gray-200 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-white/20 dark:border-gray-700 dark:bg-black/20">
      <div className="flex items-center space-x-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{skill}</span>
      </div>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
    </div>
  );
}

// Technology Marquee Component
export function TechMarquee() {
  const technologies = [
    { skill: "React", icon: "⚛️" },
    { skill: "Next.js", icon: "▲" },
    { skill: "TypeScript", icon: "📘" },
    { skill: "Node.js", icon: "🟢" },
    { skill: "Python", icon: "🐍" },
    { skill: "AI/ML", icon: "🤖" },
    { skill: "Video Editing", icon: "🎬" },
    { skill: "3D Animation", icon: "🎭" },
    { skill: "Motion Graphics", icon: "🎨" },
    { skill: "Adobe Suite", icon: "🎯" },
    { skill: "Blender", icon: "🔷" },
    { skill: "After Effects", icon: "🎪" },
  ];

  return (
    <div className="relative w-full">
      <Marquee pauseOnHover className="[--duration:30s]">
        {technologies.map((tech, index) => (
          <SkillMarqueeCard key={index} skill={tech.skill} icon={tech.icon} />
        ))}
      </Marquee>
    </div>
  );
}