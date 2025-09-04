'use client'

import { useEffect, useRef } from 'react'

export default function HomePage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const ctaVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Initialize Webflow-style animations
    document.documentElement.classList.add('w-mod-js')
    
    // Preload videos with frame offset for seamless playback
    const initializeVideos = () => {
      if (heroVideoRef.current) {
        heroVideoRef.current.currentTime = 1; // Start at 1 second in
      }
      if (ctaVideoRef.current) {
        ctaVideoRef.current.currentTime = 2; // Start at 2 seconds in
      }
    }

    // Animate portfolio items on scroll
    const observePortfolioItems = () => {
      const items = document.querySelectorAll('.work_component')
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      }, { threshold: 0.2 })

      items.forEach((item) => observer.observe(item))
    }

    const timer = setTimeout(() => {
      initializeVideos()
      observePortfolioItems()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const portfolioItems = [
    {
      title: "Raytheon Showcase",
      client: "Raytheon",
      date: "2024",
      videoId: "641531314",
      image: "https://i.vimeocdn.com/video/641531314_640x360.jpg"
    },
    {
      title: "CRN Animation",
      client: "CRN",
      date: "2024", 
      videoId: "641502508",
      image: "https://i.vimeocdn.com/video/641502508_640x360.jpg"
    },
    {
      title: "New Balance Rome",
      client: "New Balance",
      date: "2024",
      videoId: "641527142", 
      image: "https://i.vimeocdn.com/video/641527142_640x360.jpg"
    },
    {
      title: "Century 21",
      client: "Century 21",
      date: "2024",
      videoId: "641606856",
      image: "https://i.vimeocdn.com/video/641606856_640x360.jpg"
    },
    {
      title: "Marcus Luttrell",
      client: "Personal",
      date: "2024",
      videoId: "641502009",
      image: "https://i.vimeocdn.com/video/641502009_640x360.jpg"
    },
    {
      title: "Apollo 11th 50th Anniversary",
      client: "Documentary",
      date: "2024",
      videoId: "641599879",
      image: "https://i.vimeocdn.com/video/641599879_640x360.jpg"
    }
  ]

  return (
    <div className="page-wrapper">
      {/* Navigation */}
      <nav className="nav_component">
        <div className="nav_padding">
          <div className="nav_container">
            <a href="/" className="nav_logo">
              Jeffrey Kerr
            </a>
            <div className="nav_right">
              <div className="nav_menu">
                <div className="nav_menu-links">
                  <a href="/" className="nav_link">Home</a>
                  <a href="/work" className="nav_link">Work</a>
                  <a href="/about" className="nav_link">About</a>
                </div>
              </div>
              <div className="nav_divider"></div>
              <div className="hide-tablet">
                <a href="/contact" className="button is-small is-invert">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-wrapper">
        {/* Hero Section */}
        <header className="section_header">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-large padding-top">
                <h1 className="hero-heading">
                  <span className="span-title-first fade-up-on-load">Jeffrey Kerr is an AI-enhanced creative</span>{' '}
                  <span className="span-title-second fade-up-delayed">technologist pushing the boundaries</span>{' '}
                  <span className="span-title-third fade-up-delayed-2">of visual storytelling worldwide</span>
                </h1>
                
                <div className="spacer-xhuge"></div>
                
                <div className="hero-links_component">
                  <div className="hero-links_div">
                    <svg className="icon-1x1-regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                      <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                    <div className="hero-links_text">Grand Rapids, MI / Worldwide</div>
                  </div>
                  <div className="hero-links_divider"></div>
                  <a href="mailto:colour8k@mac.com" className="hero-links_link">
                    <svg className="icon-1x1-regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" fill="none"/>
                      <path d="m22 6-10 7L2 6" stroke="currentColor" fill="none"/>
                    </svg>
                    <div className="hero-links_text">colour8k@mac.com</div>
                  </a>
                </div>

                <div className="spacer-xhuge"></div>

                {/* Demo Reel Video */}
                <div className="showreel_component">
                  <div className="showreel_wrap">
                    <div className="showreel_video">
                      <iframe 
                        ref={heroVideoRef}
                        src="https://player.vimeo.com/video/919597870?autoplay=1&loop=1&muted=1&controls=0&background=1"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="showreel_cta">
                      <a href="https://vimeo.com/919597870" target="_blank" className="showreel_button">
                        <svg className="showreel_img" width="120" height="120" viewBox="0 0 148 149" fill="none">
                          <circle cx="74" cy="74.5" r="74" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)"/>
                          <circle cx="74" cy="74.5" r="60" fill="rgba(255,255,255,0.05)"/>
                          <circle cx="74" cy="74.5" r="30" fill="rgba(255,255,255,0.1)"/>
                        </svg>
                        <svg className="showreel_play" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Client Logos */}
        <section>
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-huge padding-top">
                <div className="logos_component">
                  <div className="logos_list">
                    <div className="logos_item">
                      <div className="logos_logo" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Disney</div>
                      <div className="logos_divider"></div>
                    </div>
                    <div className="logos_item">
                      <div className="logos_logo" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Boeing</div>
                      <div className="logos_divider"></div>
                    </div>
                    <div className="logos_item">
                      <div className="logos_logo" style={{ fontSize: '1.2rem', fontWeight: '600' }}>DOD</div>
                      <div className="logos_divider"></div>
                    </div>
                    <div className="logos_item">
                      <div className="logos_logo" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Raytheon</div>
                      <div className="logos_divider"></div>
                    </div>
                    <div className="logos_item">
                      <div className="logos_logo" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Century 21</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section>
          <div className="padding-global">
            <div className="container-large-huge">
              <div className="padding-section-huge padding-top">
                <div className="works_component">
                  <div className="works_list">
                    {portfolioItems.map((item, index) => (
                      <div key={index} className="work_component">
                        <a href={`https://vimeo.com/${item.videoId}`} target="_blank" className="work_link">
                          <div className="work_img-wrap">
                            <iframe 
                              src={`https://player.vimeo.com/video/${item.videoId}?autoplay=1&loop=1&muted=1&controls=0&background=1`}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                opacity: 0,
                                transition: 'opacity 0.3s ease'
                              }}
                              allow="autoplay; fullscreen; picture-in-picture"
                              className="work_gif"
                            />
                            <img 
                              src={item.image}
                              alt={item.title}
                              className="work_img"
                              loading="lazy"
                            />
                          </div>
                          <div className="work_text-wrap">
                            <div className="work_tags">
                              <h2 className="work_title">{item.title}</h2>
                              <div className="horizontal-divider is-100"></div>
                              <div>{item.client}</div>
                              <div className="horizontal-divider is-100"></div>
                              <div>{item.date}</div>
                              <div className="horizontal-divider is-100"></div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-huge padding-top">
                <div className="cta_component">
                  <div className="background-video">
                    <iframe 
                      ref={ctaVideoRef}
                      src="https://player.vimeo.com/video/641531314?autoplay=1&loop=1&muted=1&controls=0&background=1"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      allow="autoplay; fullscreen; picture-in-picture"
                    />
                  </div>
                  <div className="cta_overlay"></div>
                  <div className="cta_content">
                    <div className="tag_component">
                      <div className="tag_text">Let&apos;s create</div>
                      <div className="vertical-divider"></div>
                    </div>
                    <div className="spacer-medium"></div>
                    <div className="spacer-xxlarge"></div>
                    
                    <div className="numbers_component">
                      <div className="numbers_wrap">
                        <div className="numbers_item">
                          <div className="numbers_number">15+</div>
                          <div className="numbers_descriptor">Years Experience</div>
                        </div>
                        <div className="numbers_divider"></div>
                        <div className="numbers_item">
                          <div className="numbers_number">50+</div>
                          <div className="numbers_descriptor">Projects Delivered</div>
                        </div>
                        <div className="numbers_divider"></div>
                        <div className="numbers_item">
                          <div className="numbers_number">10M+</div>
                          <div className="numbers_descriptor">Views Generated</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="spacer-xxlarge"></div>
                    <div className="align-center">
                      <a href="mailto:colour8k@mac.com" className="button is-large is-invert">
                        <div>Contact</div>
                        <svg width="42" viewBox="0 0 42 14" fill="none">
                          <path d="M40.5 7C40.5 7 23.9315 7 0.5 7M40.5 7L34.5 13M40.5 7L34.5 0.999999" stroke="currentColor" strokeLinecap="square"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section>
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-huge">
                <div className="socials_component">
                  <a href="https://www.linkedin.com/in/jefferykerrcreative" target="_blank" className="socials_link">
                    <svg className="icon-1x1-regular" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <div className="hero-links_text">LinkedIn</div>
                  </a>
                  <div className="socials_divider"></div>
                  <a href="https://www.youtube.com/@OfficialJefferyKerr" target="_blank" className="socials_link">
                    <svg className="icon-1x1-regular" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <div className="hero-links_text">YouTube</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer_component">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-section-large">
              <div className="footer_wrapper">
                <div className="footer_top">
                  <a href="/" className="footer_logo">
                    Jeffrey Kerr
                  </a>
                  <div className="footer_divider"></div>
                  <a href="mailto:colour8k@mac.com" className="footer_email">
                    <svg className="icon-1x1-regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" fill="none"/>
                      <path d="m22 6-10 7L2 6" stroke="currentColor" fill="none"/>
                    </svg>
                    <div>colour8k@mac.com</div>
                  </a>
                  <div className="footer_top_right">
                    <a href="/" className="footer_link">Home</a>
                    <a href="/work" className="footer_link">Work</a>
                    <a href="/contact" className="footer_link">Contact</a>
                  </div>
                </div>
                <div className="footer_bot">
                  <div className="footer_copyright">Copyright © 2025 Jeffrey Kerr.</div>
                  <div className="footer_socials">
                    <a href="https://www.linkedin.com/in/jefferykerrcreative" target="_blank" className="footer_social-link">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="https://www.youtube.com/@OfficialJefferyKerr" target="_blank" className="footer_social-link">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}