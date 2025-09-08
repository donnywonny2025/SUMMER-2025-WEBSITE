// Main JavaScript file for Lucky Rabbit website

document.addEventListener('DOMContentLoaded', () => {
  console.log('Lucky Rabbit website loaded');
  
  // Initialize components
  initNavigation();
  initAnimations();
  initContactForm();
});

/**
 * Initialize responsive navigation
 */
function initNavigation() {
  // Add mobile navigation toggle functionality here
  const header = document.querySelector('header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav ul');
  
  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
  
  // Simple scroll-based header hide/show
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Show/hide header based on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    
    lastScrollY = currentScrollY;
  });
}

/**
 * Initialize animations
 */
function initAnimations() {
  // Add scroll-based animations
  const animatedElements = document.querySelectorAll('.service-card, .hero h1, .hero p, .cta-button');
  
  // Simple animation on page load
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('animated');
    }, 100 * index);
  });
  
  // Add scroll-based animations using Intersection Observer if supported
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .project-card, .about-content, .contact-form').forEach(element => {
      observer.observe(element);
    });
  }
}

/**
 * Initialize contact form
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Here you would normally send the form data to a server
      // For now, we'll just log it and show a success message
      console.log('Form submitted:', { name, email, message });
      
      // Show success message
      contactForm.innerHTML = '<div class="success-message"><h3>Thank you!</h3><p>Your message has been sent. We\'ll get back to you soon.</p></div>';
    });
  }
}