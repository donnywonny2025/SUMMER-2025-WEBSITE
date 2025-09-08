import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { URL } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const fileStream = fs.createWriteStream(outputPath);
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function fixLuckyRabbitWebsite() {
  console.log('🐰 Starting Lucky Rabbit Website Fix');
  console.log('===========================================');

  const outputDir = path.join(__dirname, 'rebuild');
  const assetsDir = path.join(outputDir, 'assets');
  const imagesDir = path.join(assetsDir, 'images');
  const cssDir = path.join(assetsDir, 'css');
  const jsDir = path.join(assetsDir, 'js');

  // Create output directories
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(cssDir, { recursive: true });
  fs.mkdirSync(jsDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Enable request interception to capture resources
  await page.setRequestInterception(true);
  
  // Store all resources
  const resources = {
    stylesheets: new Set(),
    scripts: new Set(),
    images: new Set(),
    fonts: new Set(),
    other: new Set()
  };

  page.on('request', request => {
    request.continue();
  });

  page.on('response', async response => {
    const url = response.url();
    const resourceType = response.request().resourceType();
    
    // Skip if not a successful response
    if (!response.ok()) return;
    
    try {
      if (resourceType === 'stylesheet') {
        resources.stylesheets.add(url);
      } else if (resourceType === 'script') {
        resources.scripts.add(url);
      } else if (resourceType === 'image') {
        resources.images.add(url);
      } else if (resourceType === 'font') {
        resources.fonts.add(url);
      } else {
        resources.other.add(url);
      }
    } catch (error) {
      console.error(`Error processing ${resourceType} at ${url}:`, error);
    }
  });

  console.log('🌐 Loading Lucky Rabbit website...');
  await page.goto('https://www.luckyrabbit.tech/', { waitUntil: 'networkidle2' });

  // Extract page content
  console.log('📝 Extracting page content...');
  const pageContent = await page.content();
  
  // Process HTML to make it standalone
  const processedHTML = await page.evaluate(() => {
    // Get all inline styles
    const styles = Array.from(document.querySelectorAll('style')).map(style => style.innerHTML).join('\n');
    
    // Get all external CSS links
    const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href);
    
    // Get all scripts
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(script => script.src);
    
    // Get all images
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt || '',
      width: img.width,
      height: img.height,
      className: img.className || ''
    }));
    
    // Get main content sections
    const sections = Array.from(document.querySelectorAll('section, header, footer, main, nav')).map(section => ({
      type: section.tagName.toLowerCase(),
      id: section.id || '',
      className: section.className || '',
      innerHTML: section.innerHTML
    }));
    
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      styles,
      cssLinks,
      scripts,
      images,
      sections
    };
  });
  
  // Create a simplified HTML structure
  const simplifiedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${processedHTML.title}</title>
  <meta name="description" content="${processedHTML.description}">
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="icon" href="assets/images/favicon.png">
</head>
<body>
  <header>
    <div class="container">
      <div class="logo">
        <a href="/">
          <img src="assets/images/lucky-rabbit-logo.png" alt="Lucky Rabbit, LLC Logo">
        </a>
      </div>
      <nav>
        <ul>
          <li><a href="#">HOME</a></li>
          <li><a href="#about">ABOUT</a></li>
          <li><a href="#services">SERVICES</a></li>
          <li><a href="#projects">PROJECTS</a></li>
          <li><a href="#clients">CLIENTS</a></li>
          <li><a href="#contact">CONTACT</a></li>
        </ul>
      </nav>
      <div class="mobile-menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero" id="home">
      <div class="background-video">
        <video autoplay loop muted playsinline>
          <source src="assets/videos/background.mp4" type="video/mp4">
        </video>
      </div>
      <div class="container">
        <div class="hero-content">
          <h1>DIGITAL SERVICES FIRM</h1>
          <p>We bridge the gap between old and new cultures using lean practices and agile methods.</p>
          <a href="#contact" class="cta-button">GET IN TOUCH</a>
        </div>
        <div class="hero-image">
          <img src="assets/images/hero-image.png" alt="Lucky Rabbit Digital Services">
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services" id="services">
      <div class="container">
        <h2>OUR SERVICES</h2>
        <div class="services-grid">
          <div class="service-card">
            <img src="assets/images/334114_e599790cd124467183141ebe6ccac405~mv2.png" alt="Digital Strategy">
            <h3>Digital Strategy</h3>
            <p>We help organizations define their digital vision and roadmap for success.</p>
          </div>
          <div class="service-card">
            <img src="assets/images/334114_f121edf5025240d8b150a209a588cbac~mv2.png" alt="Web Development">
            <h3>Web Development</h3>
            <p>Custom websites and applications built with modern technologies.</p>
          </div>
          <div class="service-card">
            <img src="assets/images/334114_e599790cd124467183141ebe6ccac405~mv2.png" alt="UX/UI Design">
            <h3>UX/UI Design</h3>
            <p>User-centered design that creates intuitive and engaging experiences.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about" id="about">
      <div class="container">
        <div class="about-content">
          <h2>ABOUT LUCKY RABBIT</h2>
          <p>Lucky Rabbit is a non-status quo digital services firm with 7+ years of experience using lean practices and agile methods to bridge the gap between old and new cultures.</p>
          <p>We work with organizations to transform their digital presence and create meaningful connections with their audience.</p>
        </div>
        <div class="about-image">
          <img src="assets/images/about-image.png" alt="About Lucky Rabbit">
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="projects" id="projects">
      <div class="container">
        <h2>OUR PROJECTS</h2>
        <div class="projects-grid">
          <div class="project-card">
            <img src="assets/images/334114_55ddac50b4bb483393eb6a97efea9d88~mv2.jpg" alt="Project 1">
            <h3>Government Portal</h3>
            <p>Modernized citizen services platform</p>
          </div>
          <div class="project-card">
            <img src="assets/images/334114_6bffb4c55c564e248c42e34d19df4ba1~mv2.jpg" alt="Project 2">
            <h3>Healthcare App</h3>
            <p>Patient engagement solution</p>
          </div>
          <div class="project-card">
            <img src="assets/images/334114_83295d71575c4af0a27f0617d8ba9e7a~mv2.jpg" alt="Project 3">
            <h3>E-commerce Platform</h3>
            <p>Custom shopping experience</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Clients Section -->
    <section class="clients" id="clients">
      <div class="container">
        <h2>OUR CLIENTS</h2>
        <div class="clients-grid">
          <div class="client-logo">
            <img src="assets/images/334114_8ccf086108ae4f18a42aa07f731a0d11~mv2.jpg" alt="Client 1">
          </div>
          <div class="client-logo">
            <img src="assets/images/334114_8e9741ae95c84f63b6705e4fd2d7c02b~mv2.jpg" alt="Client 2">
          </div>
          <div class="client-logo">
            <img src="assets/images/334114_fb40e0569bb64663ba75a50f73fcee5b~mv2.jpg" alt="Client 3">
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact" id="contact">
      <div class="container">
        <h2>GET IN TOUCH</h2>
        <div class="contact-grid">
          <div class="contact-form">
            <form id="contactForm">
              <div class="form-group">
                <input type="text" id="name" name="name" placeholder="Your Name" required>
              </div>
              <div class="form-group">
                <input type="email" id="email" name="email" placeholder="Your Email" required>
              </div>
              <div class="form-group">
                <textarea id="message" name="message" placeholder="Your Message" required></textarea>
              </div>
              <button type="submit" class="submit-button">SEND MESSAGE</button>
            </form>
          </div>
          <div class="contact-info">
            <div class="info-item">
              <h3>Email</h3>
              <p>info@luckyrabbit.tech</p>
            </div>
            <div class="info-item">
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div class="info-item">
              <h3>Address</h3>
              <p>123 Digital Lane, Tech City, TC 12345</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="assets/images/lucky-rabbit-logo.png" alt="Lucky Rabbit, LLC Logo">
        </div>
        <div class="footer-links">
          <ul>
            <li><a href="#">HOME</a></li>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#services">SERVICES</a></li>
            <li><a href="#projects">PROJECTS</a></li>
            <li><a href="#clients">CLIENTS</a></li>
            <li><a href="#contact">CONTACT</a></li>
          </ul>
        </div>
        <div class="footer-social">
          <a href="#" class="social-icon">FB</a>
          <a href="#" class="social-icon">TW</a>
          <a href="#" class="social-icon">IG</a>
          <a href="#" class="social-icon">LI</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2023 Lucky Rabbit, LLC. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="assets/js/main.js"></script>
</body>
</html>`;

  // Write the simplified HTML to the output directory
  fs.writeFileSync(path.join(outputDir, 'index.html'), simplifiedHTML);

  // Create a simplified CSS file
  const cssContent = `/* Base Styles */
:root {
  --primary-color: #0a2463; /* Dark Blue */
  --secondary-color: #3E92CC; /* Blue */
  --accent-color: #2EC4B6; /* Teal */
  --highlight-color: #FF9F1C; /* Orange */
  --text-color: #333333;
  --light-text: #ffffff;
  --background-color: #ffffff;
  --light-gray: #f5f5f5;
  --dark-gray: #4a4a4a;
  --font-main: Arial, Helvetica, sans-serif;
  --font-heading: Arial, Helvetica, sans-serif;
  --border-radius: 4px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-main);
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--background-color);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
}

a:hover {
  color: var(--accent-color);
}

img {
  max-width: 100%;
  height: auto;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  margin-bottom: 1rem;
  line-height: 1.2;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.5rem;
}

p {
  margin-bottom: 1rem;
}

/* Buttons */
.cta-button, .submit-button {
  display: inline-block;
  background-color: var(--accent-color);
  color: var(--light-text);
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: bold;
  cursor: pointer;
  transition: var(--transition);
}

.cta-button:hover, .submit-button:hover {
  background-color: var(--secondary-color);
  color: var(--light-text);
}

/* Header */
header {
  background-color: var(--background-color);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 50px;
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-left: 20px;
}

nav ul li a {
  font-weight: bold;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: var(--primary-color);
  margin: 2px 0;
}

.header-hidden {
  transform: translateY(-100%);
}

/* Hero Section */
.hero {
  padding: 80px 0;
  background-color: var(--light-gray);
  position: relative;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.background-video video {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  opacity: 0.6;
}

.hero .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.hero-content {
  flex: 1;
  padding-right: 40px;
}

.hero-image {
  flex: 1;
}

/* Services Section */
.services {
  padding: 80px 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.service-card {
  background-color: var(--light-gray);
  padding: 30px;
  border-radius: var(--border-radius);
  text-align: center;
  transition: var(--transition);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--box-shadow);
}

.service-card img {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

/* About Section */
.about {
  padding: 80px 0;
  background-color: var(--light-gray);
}

.about .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.about-content {
  flex: 1;
  padding-right: 40px;
}

.about-image {
  flex: 1;
}

/* Projects Section */
.projects {
  padding: 80px 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.project-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-card h3, .project-card p {
  padding: 15px;
}

/* Clients Section */
.clients {
  padding: 80px 0;
  background-color: var(--light-gray);
}

.clients-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.client-logo {
  padding: 20px;
  max-width: 200px;
}

.client-logo img {
  filter: grayscale(100%);
  transition: var(--transition);
}

.client-logo img:hover {
  filter: grayscale(0%);
}

/* Contact Section */
.contact {
  padding: 80px 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: var(--font-main);
}

.form-group textarea {
  height: 150px;
  resize: vertical;
}

.contact-info .info-item {
  margin-bottom: 20px;
}

/* Footer */
footer {
  background-color: var(--primary-color);
  color: var(--light-text);
  padding: 50px 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.footer-logo img {
  height: 40px;
  filter: brightness(0) invert(1);
}

.footer-links ul {
  list-style: none;
}

.footer-links ul li {
  margin-bottom: 10px;
}

.footer-links ul li a {
  color: var(--light-text);
}

.footer-social {
  display: flex;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--light-text);
  border-radius: 50%;
  margin-left: 10px;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive Styles */
@media (max-width: 768px) {
  nav ul {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .hero .container, .about .container {
    flex-direction: column;
  }

  .hero-content, .about-content {
    padding-right: 0;
    margin-bottom: 40px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.8rem;
  }

  .footer-content > div {
    margin-bottom: 30px;
    width: 100%;
    text-align: center;
  }

  .footer-links ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-links ul li {
    margin: 0 10px 10px;
  }

  .footer-social {
    justify-content: center;
  }
}`;

  fs.writeFileSync(path.join(cssDir, 'styles.css'), cssContent);

  // Create a basic JavaScript file
  const basicJS = `// Main JavaScript file for Lucky Rabbit website

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
      contactForm.innerHTML = '<div class="success-message"><h3>Thank you!</h3><p>Your message has been sent. We\\'ll get back to you soon.</p></div>';
    });
  }
}`;

  fs.writeFileSync(path.join(jsDir, 'main.js'), basicJS);

  // Download images from the original website
  console.log('📥 Downloading images...');
  
  // Create a list of images to download
  const imagesToDownload = [
    { url: 'https://www.luckyrabbit.tech/favicon.ico', filename: 'favicon.png' },
    { url: 'https://static.wixstatic.com/media/334114_f121edf5025240d8b150a209a588cbac~mv2.png/v1/fill/w_189,h_50,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Lucky%20Rabbit%20Logo%20-%20Black.png', filename: 'lucky-rabbit-logo.png' },
    { url: 'https://static.wixstatic.com/media/ea26fd_4ece1bf4b18e454aa265341980d012e7~mv2.png/v1/fill/w_560,h_454,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ea26fd_4ece1bf4b18e454aa265341980d012e7~mv2.png', filename: 'hero-image.png' },
    { url: 'https://static.wixstatic.com/media/ea26fd_4ece1bf4b18e454aa265341980d012e7~mv2.png/v1/fill/w_560,h_454,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ea26fd_4ece1bf4b18e454aa265341980d012e7~mv2.png', filename: 'about-image.png' },
    { url: 'https://static.wixstatic.com/media/334114_e599790cd124467183141ebe6ccac405~mv2.png/v1/fill/w_96,h_96,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/334114_e599790cd124467183141ebe6ccac405~mv2.png', filename: '334114_e599790cd124467183141ebe6ccac405~mv2.png' },
    { url: 'https://static.wixstatic.com/media/334114_f121edf5025240d8b150a209a588cbac~mv2.png/v1/fill/w_96,h_96,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/334114_f121edf5025240d8b150a209a588cbac~mv2.png', filename: '334114_f121edf5025240d8b150a209a588cbac~mv2.png' },
    { url: 'https://static.wixstatic.com/media/334114_55ddac50b4bb483393eb6a97efea9d88~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/334114_55ddac50b4bb483393eb6a97efea9d88~mv2.jpg', filename: '334114_55ddac50b4bb483393eb6a97efea9d88~mv2.jpg' },
    { url: 'https://static.wixstatic.com/media/334114_6bffb4c55c564e248c42e34d19df4ba1~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/334114_6bffb4c55c564e248c42e34d19df4ba1~mv2.jpg', filename: '334114_6bffb4c55c564e248c42e34d19df4ba1~mv2.jpg' },
    { url: 'https://static.wixstatic.com/media/334114_83295d71575c4af0a27f0617d8ba9e7a~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/334114_83295d71575c4af0a27f0617d8ba9e7a~mv2.jpg', filename: '334114_83295d71575c4af0a27f0617d8ba9e7a~mv2.jpg' },
    { url: 'https://static.wixstatic.com/media/334114_8ccf086108ae4f18a42aa07f731a0d11~mv2.jpg/v1/fill/w_180,h_180,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/334114_8ccf086108ae4f18a42aa07f731a0d11~mv2.jpg', filename: '334114_8ccf086108ae4f18a42aa07f731a0d11~mv2.jpg' },
    { url: 'https://static.wixstatic.com/media/334114_8e9741ae95c84f63b6705e4fd2d7c02b~mv2.jpg/v1/fill/w_180,h_180,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/334114_8e9741ae95c84f63b6705e4fd2d7c02b~mv2.jpg', filename: '334114_8e9741ae95c84f63b6705e4fd2d7c02b~mv2.jpg' },
    { url: 'https://static.wixstatic.com/media/334114_fb40e0569bb64663ba75a50f73fcee5b~mv2.jpg/v1/fill/w_180,h_180,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/334114_fb40e0569bb64663ba75a50f73fcee5b~mv2.jpg', filename: '334114_fb40e0569bb64663ba75a50f73fcee5b~mv2.jpg' },
  ];

  // Download each image
  for (const image of imagesToDownload) {
    try {
      await downloadFile(image.url, path.join(imagesDir, image.filename));
      console.log(`✅ Downloaded image: ${image.filename}`);
    } catch (error) {
      console.error(`❌ Failed to download image ${image.filename}:`, error);
    }
  }

  // Create videos directory in rebuild folder and download background video
  const videosDir = path.join(assetsDir, 'videos');
  fs.mkdirSync(videosDir, { recursive: true });
  
  // Download background video
  console.log('🎬 Downloading background video...');
  await downloadFile('https://video.wixstatic.com/video/334114_838a8a7661254c648595d6cd0a075839/360p/mp4/file.mp4', path.join(videosDir, 'background.mp4'));
  console.log('✅ Background video downloaded');

  // Copy files to the public directory
  console.log('📋 Copying files to public directory...');
  const publicDir = path.join(__dirname, '..', 'working', 'public', 'lucky-rabbit');
  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'assets', 'css'), { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'assets', 'js'), { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'assets', 'images'), { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'assets', 'videos'), { recursive: true });

  // Copy HTML file
  fs.copyFileSync(path.join(outputDir, 'index.html'), path.join(publicDir, 'index.html'));
  
  // Copy CSS file
  fs.copyFileSync(path.join(cssDir, 'styles.css'), path.join(publicDir, 'assets', 'css', 'styles.css'));
  
  // Copy JS file
  fs.copyFileSync(path.join(jsDir, 'main.js'), path.join(publicDir, 'assets', 'js', 'main.js'));
  
  // Copy images
  const imageFiles = fs.readdirSync(imagesDir);
  for (const imageFile of imageFiles) {
    fs.copyFileSync(path.join(imagesDir, imageFile), path.join(publicDir, 'assets', 'images', imageFile));
  }
  
  // Copy videos
  if (fs.existsSync(videosDir)) {
    const videoFiles = fs.readdirSync(videosDir);
    for (const videoFile of videoFiles) {
      fs.copyFileSync(path.join(videosDir, videoFile), path.join(publicDir, 'assets', 'videos', videoFile));
    }
  }

  console.log('✅ Website fix completed!');
  console.log(`📁 All content saved to: ${outputDir}`);
  console.log(`📁 Files copied to public directory: ${publicDir}`);

  await browser.close();
}

fixLuckyRabbitWebsite().catch(error => {
  console.error('❌ Fix failed:', error);
  process.exit(1);
});