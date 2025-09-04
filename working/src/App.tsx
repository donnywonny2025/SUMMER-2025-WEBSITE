'use client'

import { useEffect, useRef } from 'react'

export default function HomePage() {
  const workItemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Scroll-based blur effect for portfolio items
    const handleScroll = () => {
      const startTime = performance.now()

      workItemsRef.current.forEach((item) => {
        if (!item) return

        const rect = item.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const itemCenter = rect.top + rect.height / 2
        const windowCenter = windowHeight / 2

        // Calculate distance from center of screen (0 = perfect center, 1 = edge)
        const distanceFromCenter = Math.abs(itemCenter - windowCenter) / (windowHeight / 2)
        const blurAmount = Math.min(distanceFromCenter * 12, 12) // Max 12px blur for more dramatic effect

        const img = item.querySelector('.work_img') as HTMLImageElement

        if (img) {
          img.style.filter = `blur(${blurAmount}px)`
          img.style.opacity = `${Math.max(0.3, 1 - distanceFromCenter * 0.7)}` // Also fade out
        }
      })

      const endTime = performance.now()
      const scrollDuration = endTime - startTime

      console.log(`Scroll handler duration: ${scrollDuration.toFixed(2)}ms`)

      if (scrollDuration > 16.67) { // More than one frame at 60fps
        console.warn('Scroll handler performance warning: exceeded 16.67ms (60fps frame time)')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const portfolioItems = [
    {
      title: "Raytheon Defense Systems",
      client: "Raytheon",
      date: "2024",
      videoId: "641531314",
      thumbnail: "https://picsum.photos/1280/720?random=1"
    },
    {
      title: "CRN Corporate Animation", 
      client: "CRN",
      date: "2024",
      videoId: "641502508", 
      thumbnail: "https://picsum.photos/1280/720?random=2"
    },
    {
      title: "New Balance Rome Campaign",
      client: "New Balance", 
      date: "2024",
      videoId: "641527142",
      thumbnail: "https://picsum.photos/1280/720?random=3"
    },
    {
      title: "Century 21 Brand Film",
      client: "Century 21",
      date: "2024", 
      videoId: "641606856",
      thumbnail: "https://picsum.photos/1280/720?random=4"
    },
    {
      title: "Marcus Luttrell Documentary",
      client: "Personal Project",
      date: "2024",
      videoId: "641502009",
      thumbnail: "https://picsum.photos/1280/720?random=5"
    },
    {
      title: "Apollo 11: 50th Anniversary",
      client: "Documentary",
      date: "2019",
      videoId: "641599879",
      thumbnail: "https://picsum.photos/1280/720?random=6"
    }
  ]

  return (
    <div className="site">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">Jeffrey Kerr</a>
          <button className="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Main content wrapper */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Jeffrey Kerr is an AI-enhanced creative technologist pushing the boundaries of visual storytelling worldwide
          </h1>
          
          <div className="hero-info">
            <span>Get Out, Up, & Do — ↗ colour8k@mac.com</span>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="portfolio">
        {portfolioItems.map((item, index) => (
          <div 
            key={index}
            ref={(el) => {workItemsRef.current[index] = el}}
            className="work-item"
          >
            <a href={`https://vimeo.com/${item.videoId}`} target="_blank" rel="noopener noreferrer">
              <div className="work-video">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="work_img"
                  loading="lazy"
                  onError={(e) => {
                    console.error(`Failed to load thumbnail for ${item.title}:`, e.currentTarget.src)
                    // Fallback to a default placeholder image
                    e.currentTarget.src = 'https://picsum.photos/1280/720?random=fallback'
                  }}
                />
                <div className="video-overlay">
                  <button
                    className="play-button"
                    onClick={(e) => {
                      // Prevent link following for now to allow potential custom handling
                      // e.preventDefault()
                      console.log('Play button clicked for:', item.title)
                    }}
                    aria-label={`Play video for ${item.title}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </a>
            <div className="work-meta">
              <h3 className="work-title">{item.title}</h3>
              <div className="work-details">
                <span className="work-client">{item.client}</span>
                <span className="work-year">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">Jeffrey Kerr</div>
          <div className="footer-contact">colour8k@mac.com</div>
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/jefferykerrcreative" target="_blank">LinkedIn</a>
            <a href="https://www.youtube.com/@OfficialJefferyKerr" target="_blank">YouTube</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Jeffrey Kerr Studio</span>
          <span>Grand Rapids, MI</span>
        </div>
      </footer>
    </div>
  )
}
