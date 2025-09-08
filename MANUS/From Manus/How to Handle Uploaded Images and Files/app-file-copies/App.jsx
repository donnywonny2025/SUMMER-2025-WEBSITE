import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    // GSAP scroll animations for video cards
    if (currentPage === 'home') {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          gsap.fromTo(video, 
            {
              opacity: 0.3,
              filter: 'blur(8px)',
              scale: 0.95
            },
            {
              opacity: 1,
              filter: 'blur(0px)',
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: video,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play reverse play reverse"
              }
            }
          );
        }
      });

      // Rotating text animation
      gsap.to(".rotating-text", {
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [currentPage]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleVideoClick = (video) => {
    if (video.id === 'showreel') {
      // Show modal for showreel
      const overlay = document.createElement('div');
      
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at bottom left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%);
        backdrop-filter: blur(20px);
        z-index: 9999;
        clip-path: circle(0% at bottom left);
        transition: clip-path 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `;
      
      document.body.appendChild(overlay);
      
      setTimeout(() => {
        overlay.style.clipPath = 'circle(150% at bottom left)';
      }, 50);
      
      setTimeout(() => {
        setShowModal(true);
        setCurrentVideo(video);
        document.body.removeChild(overlay);
      }, 800);
    } else {
      // Navigate to individual video page
      const overlay = document.createElement('div');
      
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at bottom left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%);
        backdrop-filter: blur(20px);
        z-index: 9999;
        clip-path: circle(0% at bottom left);
        transition: clip-path 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `;
      
      document.body.appendChild(overlay);
      
      setTimeout(() => {
        overlay.style.clipPath = 'circle(150% at bottom left)';
      }, 50);
      
      setTimeout(() => {
        setCurrentPage('video');
        setCurrentVideo(video);
        window.scrollTo(0, 0);
        
        setTimeout(() => {
          overlay.style.clipPath = 'circle(0% at top right)';
          overlay.style.background = 'radial-gradient(circle at top right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%)';
          
          setTimeout(() => {
            document.body.removeChild(overlay);
          }, 800);
        }, 100);
      }, 800);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVideo(null);
  };

  const goHome = () => {
    const overlay = document.createElement('div');
    
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%);
      backdrop-filter: blur(20px);
      z-index: 9999;
      clip-path: circle(0% at center);
      transition: clip-path 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.style.clipPath = 'circle(150% at center)';
    }, 50);
    
    setTimeout(() => {
      setCurrentPage('home');
      setCurrentVideo(null);
      window.scrollTo(0, 0);
      
      setTimeout(() => {
        overlay.style.clipPath = 'circle(0% at center)';
        
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 800);
      }, 100);
    }, 800);
  };

  const videos = [
    {
      id: 'showreel',
      title: 'Portfolio Reel',
      client: 'Jeffrey Kerr',
      date: '2024',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'A comprehensive showcase of creative work spanning commercial projects, documentaries, and experimental storytelling techniques.',
      credits: ['Jeffrey Kerr - Director, Editor', 'Various Clients - Production Support']
    },
    {
      id: 'new-balance',
      title: 'New Balance Commercial',
      client: 'New Balance',
      date: '2023',
      thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=450&fit=crop',
      embedUrl: 'https://player.vimeo.com/video/123456789',
      description: 'A dynamic commercial showcasing New Balance\'s latest athletic wear through innovative cinematography and cutting-edge post-production techniques.',
      credits: ['Jeffrey Kerr - Director, Editor', 'New Balance - Client', 'Production Team - Various Roles']
    },
    {
      id: 'cancer-research',
      title: 'Cancer Research Documentary',
      client: 'Cancer Center',
      date: '2023',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop',
      embedUrl: 'https://player.vimeo.com/video/123456790',
      description: 'An intimate documentary exploring breakthrough cancer research and the human stories behind medical innovation.',
      credits: ['Jeffrey Kerr - Director, Editor', 'Cancer Center - Client', 'Research Team - Participants']
    },
    {
      id: 'lone-survivor',
      title: 'Lone Survivor Tour',
      client: 'Documentary',
      date: '2022',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
      embedUrl: 'https://player.vimeo.com/video/123456791',
      description: 'Following the journey of a lone survivor through challenging terrain, capturing resilience and human determination.',
      credits: ['Jeffrey Kerr - Director, Cinematographer', 'Documentary Team - Production']
    },
    {
      id: 'century-21',
      title: 'Century 21 Teaser',
      client: 'Century 21',
      date: '2022',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=450&fit=crop',
      embedUrl: 'https://player.vimeo.com/video/123456792',
      description: 'A compelling teaser campaign for Century 21, blending real estate storytelling with cinematic visuals.',
      credits: ['Jeffrey Kerr - Creative Director', 'Century 21 - Client', 'Marketing Team - Strategy']
    },
    {
      id: 'various-projects',
      title: 'Various Projects',
      client: 'Multiple',
      date: '2021-2023',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
      embedUrl: 'https://player.vimeo.com/video/123456793',
      description: 'A collection of experimental and client work showcasing diverse storytelling approaches and technical innovation.',
      credits: ['Jeffrey Kerr - Various Roles', 'Multiple Clients - Collaboration']
    }
  ];

  if (currentPage === 'video' && currentVideo) {
    return (
      <div className="App">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <a href="#" onClick={goHome} className="logo">kerr</a>
            <button 
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>

        {/* Menu Overlay */}
        <div className={`menu-overlay ${menuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <a href="#" onClick={() => { toggleMenu(); goHome(); }}>Home</a>
            <a href="#" onClick={toggleMenu}>Work</a>
            <a href="#" onClick={toggleMenu}>About</a>
            <a href="#" onClick={toggleMenu}>Contact</a>
            <div className="mobile-email">
              <a href="mailto:colour8k@mac.com">colour8k@mac.com</a>
            </div>
          </nav>
        </div>

        {/* Video Page Content */}
        <main className="video-page">
          <div className="video-page-content">
            <h1>{currentVideo.title}</h1>
            <div className="video-meta">
              <span className="client">{currentVideo.client}</span>
              <span className="date">{currentVideo.date}</span>
            </div>
            
            <div className="video-player">
              <iframe
                src={currentVideo.embedUrl}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={currentVideo.title}
              ></iframe>
            </div>
            
            <div className="video-description">
              <p>{currentVideo.description}</p>
            </div>
            
            <div className="video-credits">
              <h3>Credits</h3>
              <ul>
                {currentVideo.credits.map((credit, index) => (
                  <li key={index}>{credit}</li>
                ))}
              </ul>
            </div>
            
            <div className="more-work">
              <h3>More Work</h3>
              <div className="related-videos">
                {videos.filter(v => v.id !== currentVideo.id).slice(0, 3).map(video => (
                  <div key={video.id} className="related-video" onClick={() => handleVideoClick(video)}>
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="related-info">
                      <h4>{video.title}</h4>
                      <span>{video.client}</span>
                      <span>{video.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-contact">
              <h3>Let's create something amazing</h3>
              <a href="mailto:colour8k@mac.com" className="contact-button">Get in touch</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="#" className="logo">kerr</a>
          <button 
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#" onClick={toggleMenu}>Home</a>
          <a href="#" onClick={toggleMenu}>Work</a>
          <a href="#" onClick={toggleMenu}>About</a>
          <a href="#" onClick={toggleMenu}>Contact</a>
          <div className="mobile-email">
            <a href="mailto:colour8k@mac.com">colour8k@mac.com</a>
          </div>
        </nav>
      </div>

      {/* Showreel Modal */}
      {showModal && currentVideo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <iframe
              src={currentVideo.embedUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={currentVideo.title}
            ></iframe>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Jeffrey Kerr is a creative technologist blending AI with storytelling</h1>
          <div className="hero-info">
            <div className="location">
              <span className="location-icon">📍</span>
              <span>Grand Rapids, MI / World</span>
            </div>
            <div className="email-badge">
              <a href="mailto:colour8k@mac.com">colour8k@mac.com</a>
            </div>
          </div>
        </div>
        
        {/* Hero Video */}
        <div className="hero-video" onClick={() => handleVideoClick(videos[0])}>
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop" 
            alt="Portfolio Reel" 
            className="hero-video-thumbnail"
          />
          <div className="play-button">
            <div className="play-circle">
              <div className="rotating-text">
                <svg viewBox="0 0 140 140">
                  <path
                    id="circle"
                    d="M 70, 70 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                    fill="none"
                  />
                  <text fontSize="12" fontWeight="300" letterSpacing="4">
                    <textPath href="#circle">
                      SHOWREEL • SHOWREEL • SHOWREEL •
                    </textPath>
                  </text>
                </svg>
              </div>
              <span className="play-icon">▶</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="brands">
        <div className="brand-logos">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Canon_logo.svg" alt="Canon" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" />
          <img src="https://upload.wikimedia.org/wikipedia/en/d/d2/DJI_logo.svg" alt="DJI" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg" alt="Adobe" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Vimeo_Logo.svg" alt="Vimeo" />
        </div>
      </section>

      {/* Section Divider */}
      <section className="section-divider">
        <div className="divider-content">
          <div className="divider-line"></div>
          <div className="divider-text">
            <h3>Selected Work</h3>
            <p>A curated collection of commercial and documentary projects showcasing the intersection of technology and human storytelling.</p>
          </div>
          <div className="divider-line"></div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="video-grid-section">
        <div className="video-grid">
          {videos.slice(1).map((video, index) => (
            <React.Fragment key={video.id}>
              <div 
                className="video-card"
                ref={el => videoRefs.current[index] = el}
                onClick={() => handleVideoClick(video)}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <div className="video-meta">
                    <span className="client">{video.client}</span>
                    <span className="date">{video.date}</span>
                  </div>
                </div>
              </div>
              
              {/* Section dividers between videos */}
              {index === 1 && (
                <div className="section-divider">
                  <div className="divider-content">
                    <div className="divider-line"></div>
                    <div className="divider-text">
                      <h3>Documentary Work</h3>
                      <p>Exploring human stories through the lens of emerging technology and authentic narrative.</p>
                    </div>
                    <div className="divider-line"></div>
                  </div>
                </div>
              )}
              
              {index === 3 && (
                <div className="section-divider">
                  <div className="divider-content">
                    <div className="divider-line"></div>
                    <div className="divider-text">
                      <h3>Creative Projects</h3>
                      <p>Experimental work pushing the boundaries of visual storytelling and technical innovation.</p>
                    </div>
                    <div className="divider-line"></div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-stats">
            <div className="stat">
              <span className="stat-number">2.1M</span>
              <span className="stat-label">Views</span>
            </div>
            <div className="stat">
              <span className="stat-number">150K</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>
          
          <div className="footer-contact">
            <h3>Let's create something amazing</h3>
            <a href="mailto:colour8k@mac.com" className="contact-button">Get in touch</a>
          </div>
          
          <div className="footer-social">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="YouTube">YouTube</a>
            <a href="#" aria-label="Vimeo">Vimeo</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

