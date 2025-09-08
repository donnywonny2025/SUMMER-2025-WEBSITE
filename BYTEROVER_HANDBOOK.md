# BYTEROVER HANDBOOK: Lucky Rabbit Website

## Layer 1: System Overview

### Purpose
The Lucky Rabbit website serves as a corporate website for Lucky Rabbit, LLC, showcasing their services, values, projects, and providing contact information. The website emphasizes innovation and bridges the gap between old and new cultures using lean practices and agile methods.

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with variables for consistent branding
- **Media**: Video backgrounds, responsive images
- **Deployment**: Static site hosting

### Architecture
The website follows a simple static site architecture with the following structure:
- `rebuild/` - Main website directory
  - `assets/` - Contains all static assets
    - `css/` - Stylesheet files
    - `images/` - Image assets including logo and icons
    - `js/` - JavaScript functionality
    - `videos/` - Video assets for background
  - `index.html` - Main entry point
  - `test.html` - Testing page

### Key Technical Decisions
- Use of vanilla JavaScript without frameworks for simplicity
- Responsive design using CSS variables for consistent theming
- Video backgrounds for visual impact
- Mobile-first approach with responsive navigation

## Layer 2: Module Map

### Core Modules

#### Navigation Module
- **Purpose**: Handles website navigation and mobile menu functionality
- **Key Files**: 
  - `assets/js/main.js` (initNavigation function)
  - Header section in `index.html`
- **Responsibilities**: 
  - Toggle mobile menu
  - Handle scroll-based header visibility
  - Manage navigation links

#### Animation Module
- **Purpose**: Manages scroll-based animations and visual effects
- **Key Files**: 
  - `assets/js/main.js` (initAnimations function)
  - `assets/css/styles.css` (animation keyframes)
- **Responsibilities**: 
  - Apply animations to elements as they enter viewport
  - Handle transition effects

#### Contact Form Module
- **Purpose**: Manages the contact form functionality
- **Key Files**: 
  - `assets/js/main.js` (initContactForm function)
  - Contact section in `index.html`
- **Responsibilities**: 
  - Form validation
  - Submission handling

#### Media Module
- **Purpose**: Handles video and image assets
- **Key Files**: 
  - Video elements in `index.html`
  - `assets/videos/background.mp4`
  - Various image assets
- **Responsibilities**: 
  - Video playback
  - Responsive image loading

### Data Layer
The website primarily uses static content without a dedicated data layer. Content is embedded directly in the HTML structure.

### Utilities
- **CSS Variables**: Defined in `:root` selector in `styles.css` for consistent theming
- **Animation Keyframes**: Defined in `styles.css` for reusable animations

## Layer 3: Integration Guide

### External APIs
No external APIs are currently integrated into the website.

### Configuration
- **Styling Configuration**: CSS variables in `styles.css` control the site's appearance
  - Brand colors (primary: #8BC34A, secondary: #689F38, accent: #4CAF50)
  - Typography settings
  - Spacing and layout variables

### Build Process
The website is a static site without a build process. Files are served directly.

### Deployment
The site is deployed as static files to a web server.

## Layer 4: Extension Points

### Design Patterns
- **Module Pattern**: JavaScript functionality is organized into discrete functions
- **Event Delegation**: Used for handling user interactions
- **CSS Variables**: Used for theming and consistent styling

### Customization Areas

#### Theming
The website's appearance can be customized by modifying the CSS variables in `styles.css`. Key customization points:
- Color scheme (primary, secondary, accent colors)
- Typography (font families, sizes)
- Spacing and layout parameters

#### Content Sections
The website is organized into distinct sections that can be modified independently:
- Hero section
- About section
- Services section
- Stats section
- Biotech section
- Projects section
- Values section
- Clients section
- Contact section

#### Media Assets
Replace or modify:
- Logo image (`lucky-rabbit-logo.png`)
- Background video (`background.mp4`)
- Section images and icons

### Recent Changes
- Logo implementation (PNG format)
- Styling with brand colors (green palette)

## Maintenance Notes

### Brand Guidelines
- Primary color: #8BC34A (Green)
- Secondary color: #689F38 (Darker Green)
- Accent color: #4CAF50 (Medium Green)
- Highlight color: #CDDC39 (Lime)
- Font: Avenir with Arial fallback

### Known Issues
- None documented

### Future Improvements
- Potential for adding more interactive elements
- Possible integration with a CMS for easier content updates