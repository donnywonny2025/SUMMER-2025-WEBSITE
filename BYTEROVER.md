# BYTEROVER HANDBOOK

## Layer 1: System Overview

### Purpose
A modern, responsive personal portfolio website for Jeffrey Kerr, showcasing professional skills, projects, and experience. The website features a clean design with smooth animations, portfolio showcase, and contact functionality.

### Tech Stack
- **Frontend Framework**: Next.js 15.5.0 (main project) / React 19.1.0 + Vite (working directory)
- **Styling**: Tailwind CSS 4.x with custom components
- **Animation**: Framer Motion, GSAP for scroll animations
- **UI Components**: Radix UI component library
- **Build Tools**: Turbopack (main), Vite (working directory)
- **Type Safety**: TypeScript
- **Deployment**: Netlify (inferred from README)

### Architecture
The project follows a modern React-based architecture with two main development environments:

1. **Main Project**: Next.js-based portfolio site with server components
2. **Working Directory**: Vite-based development environment for prototyping and testing

The architecture includes:
- Component-based UI structure
- Client-side animations and interactions
- Responsive design system
- Visual testing and screenshot comparison tools

### Key Technical Decisions
- Use of Next.js for main site with Turbopack for improved build performance
- Separate Vite-based working directory for faster development and prototyping
- Integration of Lottie animations via Git submodule
- Implementation of visual testing and design validation tools
- Use of Radix UI primitives for accessible component development

## Layer 2: Module Map

### Core Modules

#### Main Project (Next.js)
- **Pages/Routes**: Main application routes and page components
- **Components**: Reusable UI components and layouts
- **Styles**: Tailwind CSS configuration and custom styles
- **Public**: Static assets and resources
- **Scripts**: Utility scripts for testing and validation

#### Working Directory (Vite)
- **src/components**: UI components including WorkVideo and UI primitives
- **src/hooks**: Custom React hooks (e.g., use-mobile.ts)
- **src/lib**: Utility functions and helpers
- **src/backend**: API integration and backend services

### Data Layer
- **Content**: Static content and portfolio data
- **Assets**: Images, videos, and other media resources
- **API Integration**: Potential integration with external services

### Utilities
- **scripts/screenshot.js**: Automated screenshot capture for visual testing
- **scripts/visual-analysis.js**: Visual analysis and comparison tools
- **scripts/design-validator.js**: Design validation and consistency checking
- **scripts/dev-workflow.js**: Development workflow automation

## Layer 3: Integration Guide

### Configuration Files
- **package.json**: Project dependencies and scripts
- **next.config.ts**: Next.js configuration
- **postcss.config.mjs**: PostCSS configuration for Tailwind
- **eslint.config.mjs**: ESLint configuration
- **vite.config.ts**: Vite configuration for working directory

### External Dependencies
- **Lottie-Animation-Ecosystem**: Git submodule for Lottie animation integration
- **Radix UI**: Component primitives for building accessible UI
- **GSAP**: Animation library for scroll effects and transitions
- **Puppeteer**: Used for automated screenshot capture and testing

### Build and Deployment
- **Main Build Process**: `npm run build` using Next.js with Turbopack
- **Working Directory Build**: `npm run build` in working directory using Vite
- **Deployment**: Likely using Netlify (based on README)

### Testing and Validation
- **Visual Testing**: `npm run visual-test` for screenshot comparison
- **Design Validation**: `npm run validate-design` for design consistency checks
- **Analysis**: `npm run analyze` for visual analysis

## Layer 4: Extension Points

### Design Patterns
- **Component Composition**: Building complex UIs from smaller components
- **Custom Hooks**: Encapsulating reusable logic (e.g., use-mobile.ts)
- **Utility-First CSS**: Using Tailwind for styling with composition
- **Animation Patterns**: GSAP for scroll-triggered animations

### Customization Areas
- **Theme Configuration**: Tailwind theme customization
- **Component Styling**: Using class-variance-authority for component variants
- **Animation Parameters**: GSAP animation configuration
- **Content Management**: Portfolio content and project showcase

### Extension Mechanisms
- **Component Library**: Extending with new UI components
- **Animation System**: Adding new animation effects and transitions
- **Visual Testing**: Extending screenshot and comparison capabilities
- **Build Process**: Customizing build and deployment workflows

### Recent Changes and Development Focus
- Integration of Lottie animations for enhanced visual effects
- Development of visual testing and comparison tools
- Exploration of video integration and performance optimization
- Responsive design improvements and mobile experience enhancement

---

## Development Workflow

### Getting Started
1. Clone the repository
2. Install dependencies with `npm install`
3. Initialize submodules with `git submodule update --init --recursive`
4. Run development server with `npm run dev`

### Working with the Project
- Main development: Work in the root directory with Next.js
- Prototyping: Use the working directory with Vite for faster iteration
- Visual testing: Use the screenshot and analysis tools for validation

### Git Workflow
- The project uses Git submodules for the Lottie Animation Ecosystem
- The working directory appears to be a separate development environment
- Ensure proper submodule initialization when cloning the repository