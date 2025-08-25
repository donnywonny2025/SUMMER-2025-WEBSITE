"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

interface VideoBackgroundProps {
  className?: string;
  videoUrl?: string;
  videoType?: "youtube" | "vimeo" | "direct";
  overlay?: boolean;
  overlayOpacity?: number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  fallbackImage?: string;
}

export default function VideoBackground({
  className,
  videoUrl,
  videoType = "youtube",
  overlay = true,
  overlayOpacity = 0.6,
  autoPlay = true,
  muted = true,
  loop = true,
  fallbackImage,
}: VideoBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Extract video ID from URL
  const getVideoId = (url: string, type: string) => {
    if (!url) return null;
    
    switch (type) {
      case "youtube":
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeMatch ? youtubeMatch[1] : null;
      case "vimeo":
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        return vimeoMatch ? vimeoMatch[1] : null;
      default:
        return url;
    }
  };

  const videoId = getVideoId(videoUrl || "", videoType);

  // Generate embed URL
  const getEmbedUrl = () => {
    if (!videoId) return null;
    
    const params = new URLSearchParams({
      autoplay: autoPlay ? "1" : "0",
      mute: muted ? "1" : "0",
      loop: loop ? "1" : "0",
      controls: "0",
      showinfo: "0",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });

    switch (videoType) {
      case "youtube":
        params.append("playlist", videoId); // Required for looping
        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      case "vimeo":
        const vimeoParams = new URLSearchParams({
          autoplay: autoPlay ? "1" : "0",
          muted: muted ? "1" : "0",
          loop: loop ? "1" : "0",
          background: "1",
          controls: "0",
          title: "0",
          byline: "0",
          portrait: "0",
        });
        return `https://player.vimeo.com/video/${videoId}?${vimeoParams.toString()}`;
      default:
        return videoId;
    }
  };

  const embedUrl = getEmbedUrl();

  useEffect(() => {
    if (embedUrl) {
      const timer = setTimeout(() => setIsLoaded(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [embedUrl]);

  if (!embedUrl && !fallbackImage) {
    return (
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900",
        className
      )} />
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Video or Fallback */}
      {embedUrl && !hasError ? (
        <>
          {/* Loading placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 animate-pulse" />
          )}
          
          {/* Video iframe */}
          <iframe
            src={embedUrl}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{
              width: "100vw",
              height: "56.25vw", // 16:9 aspect ratio
              minHeight: "100vh",
              minWidth: "177.78vh", // 16:9 aspect ratio
              transform: "translate(-50%, -50%)",
              top: "50%",
              left: "50%",
            }}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </>
      ) : (
        /* Fallback image or gradient */
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: fallbackImage ? `url(${fallbackImage})` : undefined,
            backgroundColor: !fallbackImage ? "#1e293b" : undefined,
          }}
        />
      )}
      
      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-1000"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

// Preset configurations for common use cases
export function HeroVideoBackground({ 
  videoUrl, 
  className 
}: { 
  videoUrl?: string; 
  className?: string; 
}) {
  return (
    <VideoBackground
      videoUrl={videoUrl}
      videoType="youtube"
      overlay={true}
      overlayOpacity={0.7}
      autoPlay={true}
      muted={true}
      loop={true}
      className={className}
      fallbackImage="/api/placeholder/1920/1080"
    />
  );
}

export function SubtleVideoBackground({ 
  videoUrl, 
  className 
}: { 
  videoUrl?: string; 
  className?: string; 
}) {
  return (
    <VideoBackground
      videoUrl={videoUrl}
      videoType="youtube"
      overlay={true}
      overlayOpacity={0.85}
      autoPlay={true}
      muted={true}
      loop={true}
      className={className}
    />
  );
}