import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './fonts.css';

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
          // Hint the browser for smoother animation
          gsap.set(video, { willChange: "transform, filter, opacity" });
          gsap.fromTo(
            video,
            {
              opacity: 0.25,
              filter: "blur(10px)",
              y: 40,
              scale: 0.985
            },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: video,
                start: "top 92%",
                end: "top 40%",
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
      title: 'Showreel',
      client: 'Sam Kolder',
      date: '2024',
      thumbnail: 'https://i.vimeocdn.com/video/1533245716-2407602f7c843369825ea353a2532bcea0960a118a9572c3a89a485344b7064e-d_640x360.jpg',
      embedUrl: 'https://player.vimeo.com/video/919597870',
      description: 'A comprehensive showcase of Sam Kolder\'s filmmaking work, featuring stunning visuals and innovative storytelling.',
      credits: ['Sam Kolder - Director, Cinematographer', 'Various Clients - Production']
    },
    {
      id: 'insta360',
      title: 'Insta360',
      client: 'Insta360',
      date: '2023',
      thumbnail: 'https://vumbnail.com/641527142.jpg',
      embedUrl: 'https://player.vimeo.com/video/641527142',
      description: 'Capturing the world in 360 degrees with Insta360 technology, showcasing immersive filmmaking techniques.',
      credits: ['Sam Kolder - Director', 'Insta360 - Client']
    },
    {
      id: 'commercial-project',
      title: 'Commercial Project',
      client: 'Various',
      date: '2023',
      thumbnail: 'https://vumbnail.com/641502508.jpg',
      embedUrl: 'https://player.vimeo.com/video/641502508',
      description: 'High-end commercial work demonstrating Sam\'s expertise in brand storytelling and visual excellence.',
      credits: ['Sam Kolder - Director, Editor', 'Client - Production']
    },
    {
      id: 'documentary-work',
      title: 'Documentary Work',
      client: 'Documentary',
      date: '2022',
      thumbnail: 'https://vumbnail.com/641502009.jpg',
      embedUrl: 'https://player.vimeo.com/video/641502009',
      description: 'Compelling documentary filmmaking that captures real stories with cinematic quality.',
      credits: ['Sam Kolder - Director, Cinematographer', 'Production Team - Support']
    },
    {
      id: 'brand-collaboration',
      title: 'Brand Collaboration',
      client: 'Multiple Brands',
      date: '2022',
      thumbnail: 'https://vumbnail.com/641606856.jpg',
      embedUrl: 'https://player.vimeo.com/video/641606856',
      description: 'Collaborative projects with leading brands, showcasing Sam\'s versatility in commercial filmmaking.',
      credits: ['Sam Kolder - Creative Director', 'Brands - Clients']
    },
    {
      id: 'experimental-work',
      title: 'Experimental Work',
      client: 'Personal',
      date: '2021-2023',
      thumbnail: 'https://vumbnail.com/919597870.jpg',
      embedUrl: 'https://player.vimeo.com/video/919597870',
      description: 'Innovative experimental projects pushing the boundaries of visual storytelling and technique.',
      credits: ['Sam Kolder - Director, Editor', 'Personal Projects']
    }
  ];

  if (currentPage === 'video' && currentVideo) {
    return (
      <div className="App">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <a href="#" onClick={goHome} className="logo">køld</a>
            <nav className="desktop-nav">
              <a href="#" onClick={goHome}>Home</a>
              <a href="#">Work</a>
              <a href="#">About</a>
              <a href="#" className="nav-contact">Contact</a>
            </nav>
          </div>
        </header>

        {/* Menu Overlay */}
        <div className={`menu-overlay ${menuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <a href="#" onClick={() => { toggleMenu(); goHome(); }}>Home</a>
            <a href="#" onClick={toggleMenu}>Work</a>
            <a href="#" onClick={toggleMenu}>About</a>
            <a href="#" onClick={toggleMenu} className="nav-contact">Contact</a>
            <div className="mobile-email">
              <a href="mailto:luke@samkolder.com">luke@samkolder.com</a>
            </div>
          </nav>
        </div>

        {/* Video Page Content */}
        <main className="video-page">
          <div className="video-page-content">
            <h1>{currentVideo.title}</h1>
            <div className="video-meta">
              <span className="video-client">{currentVideo.client}</span>
            <span className="video-date">{currentVideo.date}</span>
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
              <a href="mailto:luke@samkolder.com" className="contact-button">Get in touch</a>
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
          <a href="#" className="logo">køld</a>
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
            <a href="mailto:luke@samkolder.com">luke@samkolder.com</a>
          </div>
        </nav>
      </div>

      {/* Showreel Modal */}
      {showModal && currentVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <div className="video-embed">
              <iframe
                src={currentVideo.embedUrl}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Sam Kolder is a world-renowned filmmaker that inspired a generation of content creators from all around the world</h1>
          <div className="hero-meta">
            <div className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Cape Town, SA / World</span>
            </div>
            <div className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <a href="mailto:luke@samkolder.com">luke@samkolder.com</a>
            </div>
          </div>
        </div>
        <div className="hero-video" role="button" aria-label="Play showreel" onClick={() => handleVideoClick(videos[0])}>
          <img
            src={videos[0].thumbnail}
            alt={videos[0].title}
            className="hero-video-thumbnail"
          />
          <div className="play-button">
            <div className="play-circle">
              <svg className="rotating-text" viewBox="0 0 100 100">
                <path id="circlePath" fill="none" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"></path>
                <text>
                  <textPath href="#circlePath">
                    SHOWREEL • SHOWREEL • SHOWREEL •
                  </textPath>
                </text>
              </svg>
            </div>
            <span className="play-icon">▶</span>
          </div>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="video-grid-section">
        <div className="section-divider">
          <div className="divider-content">
            <div className="divider-line"></div>
            <h2 className="divider-text">Featured Work</h2>
            <div className="divider-line"></div>
          </div>
          <p>Explore a selection of Sam Kolder's most impactful projects, showcasing his unique visual style and storytelling approach.</p>
        </div>
        
        <div className="video-grid">
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              className="video-card"
              onClick={() => handleVideoClick(video)}
              ref={el => videoRefs.current[index] = el}
            >
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                  <span className="video-client">{video.client}</span>
                  <span className="video-date">{video.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="brand-showcase">
        <div className="brand-logos">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1024px-Spotify_logo_with_text.svg.png" alt="Spotify" className="brand-logo" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1000px-Google_2015_logo.svg.png" alt="Google" className="brand-logo" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" alt="Amazon" className="brand-logo" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png" alt="Netflix" className="brand-logo" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png" alt="Nike" className="brand-logo" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-contact">
            <h3>Let's create something amazing</h3>
            <a href="mailto:luke@samkolder.com" className="contact-button">Get in touch</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

