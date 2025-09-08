# Lucky Rabbit Website Scraper and Rebuild Guide

This guide provides step-by-step instructions on how to use the scraper to extract content from the Lucky Rabbit website and then rebuild it.

## Scraping the Website

### Step 1: Setup

First, set up the project by running the setup script:

```bash
./setup.sh
```

This will install the necessary dependencies and create the required directories.

### Step 2: Run the Scraper

Run the scraper to extract content from the Lucky Rabbit website:

```bash
npm run scrape
```

The scraper will:

1. Launch a browser and navigate to the Lucky Rabbit website
2. Capture screenshots of the site in desktop and mobile views
3. Extract HTML, CSS, JavaScript, and images
4. Analyze design elements (colors, typography, layout)
5. Save all content to the `scraped-content` directory

### Step 3: Review Scraped Content

After the scraper completes, review the extracted content in the `scraped-content` directory:

- `index.html`: The original HTML content
- `metadata.json`: Page metadata (title, description, OG tags)
- `design-analysis.json`: Analysis of design elements
- `resources.json`: List of all resources found on the site
- `text-content.txt`: Extracted text content
- `images.json`: Catalog of all images
- `assets/`: Downloaded assets (CSS, JavaScript, images)

## Rebuilding the Website

### Step 1: Plan the Rebuild

Based on the scraped content, plan the rebuild of the website. Consider:

- What elements to keep from the original design
- What improvements to make
- What new features to add

### Step 2: Implement the Design

A basic structure for the rebuild has been created in the `rebuild` directory:

- `index.html`: Basic HTML template
- `assets/css/styles.css`: Basic CSS styles
- `assets/js/main.js`: Basic JavaScript functionality

Modify these files to implement your design based on the scraped content.

### Step 3: Add Content

Add content from the scraped website to the rebuild. Use the extracted text and images to populate the new design.

### Step 4: Test and Refine

Test the rebuilt website in different browsers and devices. Refine the design and functionality as needed.

## Additional Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Web Design Best Practices](https://www.smashingmagazine.com/category/design-patterns/)
- [Web Performance Optimization](https://web.dev/performance-optimizing-content-efficiency/)

## Troubleshooting

### Common Issues

#### Scraper fails to launch browser

Ensure you have the latest version of Node.js installed. If using a headless environment, you may need to install additional dependencies:

```bash
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

#### Missing assets in scraped content

Some assets may be loaded dynamically or from external domains. Check the `resources.json` file to see what resources were detected but not downloaded.

#### CSS or JavaScript not working in rebuild

Ensure paths to assets are correct. Check the browser console for errors.