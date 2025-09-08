#!/bin/bash

# Setup script for Lucky Rabbit website scraper and rebuild

echo "🐰 Setting up Lucky Rabbit website scraper and rebuild"
echo "====================================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p scraped-content/assets/css scraped-content/assets/js scraped-content/assets/images

echo "✅ Setup complete!"
echo "To run the scraper, use: npm run scrape"