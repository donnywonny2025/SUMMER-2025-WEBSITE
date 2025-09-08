'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import WorkVideo from './components/WorkVideo'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePage() {
  const workItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Professional GSAP animations matching Sam Kolder's style
    if (typeof window === 'undefined') return



    const ctx = gsap.context(() => {
      // Smooth page entrance sequence
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('.nav',
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo('.hero-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.6, ease: 'power3.out' },
        '-=0.8'
      )
      .fromTo('.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        '-=1.2'
      )
      .fromTo('.hero-info',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=1'
      )
      .fromTo('.showreel-button',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.8)' },
        '-=0.8'
      )
      .fromTo('.work-item',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out'
        },
        '-=0.6'
      )

      // Subtle parallax effects (Sam Kolder style)
      gsap.to('.background-elements', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      })

      // Smooth scroll reveal animations
      gsap.utils.toArray('.work-item').forEach((item: any) => {
        gsap.fromTo(item,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom-=100',
              end: 'top center',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })


      // ===== SCROLL INDICATOR SYSTEM =====
      const scrollIndicator = document.createElement('div')
      scrollIndicator.className = 'scroll-indicator'
      const scrollLine = document.createElement('div')
      scrollLine.className = 'scroll-line'
      const scrollProgress = document.createElement('div')
      scrollProgress.className = 'scroll-progress'
      const scrollDot = document.createElement('div')
      scrollDot.className = 'scroll-dot'

      scrollLine.appendChild(scrollProgress)
      scrollLine.appendChild(scrollDot)
      scrollIndicator.appendChild(scrollLine)
      document.body.appendChild(scrollIndicator)

      function updateScrollProgress() {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrolled = (scrollTop / docHeight) * 100
        scrollProgress.style.height = scrolled + '%'
        // Debug: Add visual confirmation
        if (scrolled > 10) {
          scrollDot.style.animation = scrolled > 50 ? 'pulse 1s infinite' : 'bounce 0.5s'
        }
      }

      window.addEventListener('scroll', updateScrollProgress)
      updateScrollProgress()


      // Footer reveal
      gsap.fromTo('.footer',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%'
          }
        }
      )

      // Hero video fade on scroll
      gsap.to('.hero-video', {
        opacity: 0,
        filter: 'blur(5px)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.hero',
          start: 'bottom top',
          end: 'bottom 20%',
          scrub: true
        }
      })
    })

    // ===== SUBTLE HOVER EFFECTS =====
    const workItems = document.querySelectorAll('.work-item')
    workItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.02, // Subtle scale for visual interest
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)', // Gentle shadow
          duration: 0.6,
          ease: 'power1.out'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1, // Return to normal
          boxShadow: '0 0 0 rgba(0,0,0,0)', // Return to normal shadow
          duration: 0.6,
          ease: 'power1.out'
        })
      })
    })

    return () => ctx.revert()
  }, [])

  const portfolioItems = [
    {
      title: "Reel",
      client: "Portfolio Reel",
      date: "2024",
      videoId: "919597870", // Reel
      thumbnail: `https://vumbnail.com/${919597870}.jpg`
    },
    {
      title: "New Balance Rome",
      client: "New Balance",
      date: "2024",
      videoId: "641527142", // New Balance Rome
      thumbnail: `https://vumbnail.com/${641527142}.jpg`
    },
    {
      title: "Cancer Research",
      client: "Cancer Center",
      date: "2024",
      videoId: "641502508", // Cancer research
      thumbnail: `https://vumbnail.com/${641502508}.jpg`
    },
    {
      title: "Marcus Luttrell Lone Survivor Tour",
      client: "Lone Survivor Tour",
      date: "2024",
      videoId: "641502009", // Marcus Luttrell Lone Survivor Tour
      thumbnail: `https://vumbnail.com/${641502009}.jpg`
    },
    {
      title: "Century 21 Super Bowl Teaser",
      client: "Century 21",
      date: "2024",
      videoId: "641606856", // Century 21 teaser trailer
      thumbnail: `https://vumbnail.com/${641606856}.jpg`
    },
    {
      title: "Additional Work",
      client: "Various Clients",
      date: "2024",
      videoId: "919597870", // Placeholder with reel again
      thumbnail: "https://picsum.photos/800/450?additional"
    }
  ]

  // Note: For real videos, replace "76979871" with actual Vimeo video IDs
  // To get Vimeo thumbnails, you can use: https://vumbnail.com/{VIDEO_ID}.jpg

  return (
    <div className="site">
      {/* Animated background elements */}
      <div className="background-elements">
        {/* Horizontal lines */}
        <svg className="bg-line bg-line-1" viewBox="0 0 1920 1">
          <line x1="0" y1="0.5" x2="1920" y2="0.5" stroke="#333" strokeWidth="0.5"/>
        </svg>
        <svg className="bg-line bg-line-2" viewBox="0 0 1920 1">
          <line x1="0" y1="0.5" x2="1920" y2="0.5" stroke="#333" strokeWidth="0.3"/>
        </svg>
        <svg className="bg-line bg-line-3" viewBox="0 0 1920 1">
          <line x1="0" y1="0.5" x2="1920" y2="0.5" stroke="#222" strokeWidth="0.2"/>
        </svg>

        {/* Vertical geometric elements */}
        <svg className="geometric-element-left" viewBox="0 0 2 100">
          <rect x="0" y="0" width="0.1" height="100" fill="#666"/>
          <rect x="1.9" y="0" width="0.1" height="100" fill="#666"/>
        </svg>

        <svg className="geometric-element-right" viewBox="0 0 2 100">
          <rect x="0" y="0" width="0.1" height="100" fill="#666"/>
          <rect x="1.9" y="0" width="0.1" height="100" fill="#666"/>
        </svg>

        {/* Diagonal accent elements */}
        <svg className="diagonal-accent top-left" viewBox="0 0 80 80">
          <path d="M0 80 L80 0" stroke="#555" strokeWidth="0.5" opacity="0.3"/>
        </svg>
        <svg className="diagonal-accent bottom-right" viewBox="0 0 80 80">
          <path d="M0 0 L80 80" stroke="#555" strokeWidth="0.5" opacity="0.3"/>
        </svg>
      </div>
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
          <a href="/" className="logo">kerr</a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {menuOpen && <div className="mobile-menu">
          <ul>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/lucky-rabbit" onClick={() => setMenuOpen(false)}>Lucky Rabbit</Link></li>
            <li><a href="mailto:colour8k@mac.com" onClick={() => setMenuOpen(false)}>Contact</a></li>
            <li><a href="https://www.linkedin.com/in/jefferykerrcreative" target="_blank" onClick={() => setMenuOpen(false)}>LinkedIn</a></li>
            <li><a href="https://www.youtube.com/@OfficialJefferyKerr" target="_blank" onClick={() => setMenuOpen(false)}>YouTube</a></li>
          </ul>
        </div>}
      </nav>

      {/* Main content wrapper */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="hero">
          {/* Hero video container */}
          <div className="hero-video-container">
            <iframe
              className="hero-video"
              src={`https://player.vimeo.com/video/919597870?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0&scale_to_fill=1`}
              frameBorder="0"
              allow="autoplay; fullscreen"
              title="Hero Video"
            />
          </div>
          <div className="hero-content">
            <div className="text-block">
              <h1>Jeffrey Kerr is a world-renowned filmmaker that inspired a generation of content creators from all around the world</h1>
              
              <div className="contact-info">
                <span className="location">Grand Rapids, MI / World</span>
                <span className="email">colour8k@mac.com</span>
              </div>
            </div>

            <div className="showreel-button" onClick={() => window.open('https://vimeo.com/919597870', '_blank')}>
              <div className="showreel-ring">
                <svg viewBox="0 0 100 100">
                  <path id="curve" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                  <text>
                    <textPath href="#curve">
                      showreel • showreel • showreel •
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="showreel-play">
                <svg viewBox="0 0 24 24">
                  <polygon points="8,5 19,12 8,19" fill="currentColor"/>
                </svg>
              </div>
            </div>
            
          </div>
        </section>

      {/* Selected Work */}
      <section className="portfolio">
        <div className="theme-heading">
          <h2>Selected Work</h2>
        </div>

        <div className="work-grid">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="work-item"
            >
              <WorkVideo
                videoId={item.videoId}
                thumbnail={item.thumbnail}
                title={item.title}
              />
              <div className="work-meta">
                <div className="work-client">{item.client}</div>
                <div className="work-title">{item.title}</div>
                <div className="work-year">{item.date}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="work-cta">
          <p>View all projects</p>
          <span>↗</span>
        </div>
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
