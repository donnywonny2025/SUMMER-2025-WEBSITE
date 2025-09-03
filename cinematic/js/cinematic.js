// Cinematic Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Enhanced video loading with fallback handling
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (iframe) {
                if (entry.isIntersecting) {
                    // Video enters viewport - trigger play with error handling
                    try {
                        iframe.contentWindow.postMessage('{"method":"play"}', '*');
                        setTimeout(() => {
                            iframe.classList.add('loaded');
                            iframe.setAttribute('data-loaded', 'true');
                        }, 500);
                    } catch (error) {
                        console.warn('Video playback error, using fallback background');
                        iframe.style.display = 'none';
                        entry.target.classList.add('video-error');
                    }
                } else {
                    // Video leaves viewport - pause
                    try {
                        iframe.contentWindow.postMessage('{"method":"pause"}', '*');
                    } catch (error) {
                        // Ignore pause errors
                    }
                }
            }
        });
    }, observerOptions);

    // Observe all video sections
    const videoSections = document.querySelectorAll('.video-section, .hero-video, .contact-section');
    videoSections.forEach(section => {
        videoObserver.observe(section);
    });

    // Professional menu toggle
    const navToggle = document.getElementById('navToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuItems = document.querySelectorAll('.menu-items a');
    
    if (navToggle && menuOverlay) {
        navToggle.addEventListener('click', function() {
            const isActive = navToggle.classList.contains('active');
            
            if (isActive) {
                // Close menu
                navToggle.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            } else {
                // Open menu
                navToggle.classList.add('active');
                menuOverlay.classList.add('active');
                document.body.classList.add('menu-open');
            }
        });
        
        // Close menu when clicking on menu items
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                navToggle.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking overlay background
        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay) {
                navToggle.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Preload videos for better performance
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe, index) => {
        iframe.addEventListener('load', function() {
            this.setAttribute('data-loaded', 'true');
            // Preload next video
            if (index < iframes.length - 1) {
                const nextIframe = iframes[index + 1];
                setTimeout(() => {
                    nextIframe.contentWindow.postMessage('{"method":"preload"}', '*');
                }, 500);
            }
        });
    });

    // Mouse movement parallax effect
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    });

    // Apply subtle parallax to hero content
    function updateParallax() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const translateX = mouseX * 10;
            const translateY = mouseY * 10;
            heroContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
        requestAnimationFrame(updateParallax);
    }

    updateParallax();

    // Add scroll progress indicator
    function updateScrollProgress() {
        const scrollProgress = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // You can use this for a progress bar if desired
        document.documentElement.style.setProperty('--scroll-progress', scrollProgress + '%');
    }

    window.addEventListener('scroll', updateScrollProgress);

    // Performance optimization: Pause videos that are far from viewport
    const performanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (iframe && !entry.isIntersecting) {
                // Only pause if very far from viewport
                const rect = entry.boundingRect;
                const viewportHeight = window.innerHeight;
                
                if (rect.bottom < -viewportHeight || rect.top > viewportHeight * 2) {
                    iframe.contentWindow.postMessage('{"method":"pause"}', '*');
                }
            }
        });
    }, {
        root: null,
        rootMargin: '100% 0px 100% 0px',
        threshold: 0
    });

    videoSections.forEach(section => {
        performanceObserver.observe(section);
    });

    // Enhanced loading animation with fallback
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Start hero video after page load with error handling
        const heroVideo = document.querySelector('.hero-video iframe');
        if (heroVideo) {
            setTimeout(() => {
                try {
                    heroVideo.contentWindow.postMessage('{"method":"play"}', '*');
                    heroVideo.classList.add('loaded');
                    heroVideo.setAttribute('data-loaded', 'true');
                } catch (error) {
                    console.warn('Hero video failed to load, using fallback background');
                    heroVideo.style.display = 'none';
                    document.querySelector('.hero-video').classList.add('video-error');
                }
            }, 300);
        }
        
        // Add sophisticated cursor following effect
        initCursorEffects();
        
        // Initialize particle system
        initParticleSystem();
    });

    // Cursor following effects
    function initCursorEffects() {
        let cursor = { x: 0, y: 0 };
        let follower = { x: 0, y: 0 };
        
        document.addEventListener('mousemove', (e) => {
            cursor.x = e.clientX;
            cursor.y = e.clientY;
        });
        
        function updateCursor() {
            const dx = cursor.x - follower.x;
            const dy = cursor.y - follower.y;
            
            follower.x += dx * 0.1;
            follower.y += dy * 0.1;
            
            // Apply subtle parallax to hero elements
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const rect = heroContent.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const moveX = (cursor.x - centerX) * 0.01;
                const moveY = (cursor.y - centerY) * 0.01;
                
                heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
            
            requestAnimationFrame(updateCursor);
        }
        
        updateCursor();
    }
    
    // Particle system for enhanced visual appeal
    function initParticleSystem() {
        const createFloatingElement = () => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(${Math.random() > 0.5 ? '139, 92, 246' : '59, 130, 246'}, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                left: ${Math.random() * window.innerWidth}px;
                top: ${window.innerHeight + 10}px;
                animation: floatUp ${Math.random() * 10 + 10}s linear infinite;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 20000);
        };
        
        // Create particles periodically
        setInterval(createFloatingElement, 2000);
    }
    
    // Add CSS for floating particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { 
                transform: translateY(0) translateX(0) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
                transform: scale(1);
            }
            90% {
                opacity: 1;
            }
            100% { 
                transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) scale(0);
                opacity: 0;
            }
        }
        
        .video-error .video-container {
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);

});

// Handle Vimeo player messages
window.addEventListener('message', function(event) {
    if (event.origin !== 'https://player.vimeo.com') return;
    
    try {
        const data = JSON.parse(event.data);
        if (data.event === 'ready') {
            // Video is ready
            const iframe = event.source.frameElement;
            if (iframe) {
                iframe.setAttribute('data-loaded', 'true');
            }
        }
    } catch (e) {
        // Ignore parsing errors
    }
});