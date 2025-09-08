// Main JavaScript file for Summer 2025 Website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Summer 2025 Website loaded successfully!');
    
    // Mobile navigation toggle functionality
    const setupMobileNav = () => {
        const nav = document.querySelector('nav ul');
        const header = document.querySelector('header');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.display = 'none';
        
        // Insert before nav parent (which is the nav element)
        const navElement = nav.parentElement;
        header.insertBefore(mobileMenuBtn, navElement);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        // Handle responsive behavior
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
                nav.classList.remove('active');
            } else {
                mobileMenuBtn.style.display = 'none';
                nav.classList.remove('active');
            }
        };
        
        // Initial check and event listener
        handleResize();
        window.addEventListener('resize', handleResize);
    };
    
    // Initialize features
    const initFeatures = () => {
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    // Call initialization functions
    setupMobileNav();
    initFeatures();
});