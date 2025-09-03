// Cinematic Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for video playback
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (iframe) {
                if (entry.isIntersecting) {
                    // Video enters viewport - trigger play
                    iframe.contentWindow.postMessage('{"method":"play"}', '*');
                    iframe.setAttribute('data-loaded', 'true');
                } else {
                    // Video leaves viewport - pause
                    iframe.contentWindow.postMessage('{"method":"pause"}', '*');
                }
            }
        });
    }, observerOptions);

    // Observe all video sections
    const videoSections = document.querySelectorAll('.video-section, .hero-video, .contact-section');
    videoSections.forEach(section => {
        videoObserver.observe(section);
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
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
    iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            this.setAttribute('data-loaded', 'true');
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

    // Loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Start hero video after page load
        const heroVideo = document.querySelector('.hero-video iframe');
        if (heroVideo) {
            setTimeout(() => {
                heroVideo.contentWindow.postMessage('{"method":"play"}', '*');
                heroVideo.setAttribute('data-loaded', 'true');
            }, 300);
        }
    });

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