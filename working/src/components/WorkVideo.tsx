import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

interface WorkVideoProps {
  videoId: string
  thumbnail: string
  title: string
}

export default function WorkVideo({ videoId, thumbnail, title }: WorkVideoProps) {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !showEmbed) {
          console.log('✨ Video scrolled into view:', title)
          setShowEmbed(true)

          // Animate from dark/blurry to clear ON SCROLL REVEAL
          gsap.fromTo('.video-reveal',
            { opacity: 0.3, filter: 'blur(8px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
          )
        }
      },
      { threshold: 0.5 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [showEmbed, title])

  const handleVideoClick = () => {
    navigate(`/video/${videoId}`)
  }

  const vimeoSrc = `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0&muted=1&background=1&scale_to_fill=1`

  return (
    <div ref={containerRef} className="work-video">
      {!showEmbed ? (
        <>
          <img
            src={thumbnail}
            alt={title}
            className="work-thumbnail"
            loading="lazy"
            style={{ filter: isLoaded ? 'none' : 'blur(5px)', transition: 'filter 0.3s ease' }}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              console.error(`Failed to load thumbnail for ${title}:`, e.currentTarget.src)
              e.currentTarget.src = 'https://picsum.photos/1280/720?random=fallback'
            }}
          />
          <div className="video-play-overlay">
            <div className="play-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                <polygon points="8,5 19,12 8,19" />
              </svg>
            </div>
          </div>

          <button
            className="view-button"
            onClick={handleVideoClick}
            aria-label={`Play video for ${title}`}
          >
            Watch Video
          </button>
        </>
      ) : (
        <div className="video-player video-reveal" style={{ opacity: 0.3, filter: 'blur(8px)' }}>
          <iframe
            src={vimeoSrc}
            className="work-iframe"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
            onLoad={() => console.log('🎥 Vimeo iframe loaded successfully for:', title)}
            onError={() => console.error('❌ Vimeo iframe failed to load for:', title)}
          />
        </div>
      )}
    </div>
  )
}