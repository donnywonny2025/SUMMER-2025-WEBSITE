# Lucky Rabbit Website Scraper and Rebuild

This project is designed to scrape the [Lucky Rabbit website](https://www.luckyrabbit.tech/) and rebuild it with a new design and functionality.

## Project Structure

```
Lucky Rabbit/
├── scraped-content/       # Contains all scraped content from the original site
│   ├── assets/           # Downloaded assets from the original site
│   │   ├── css/         # CSS files
│   │   ├── js/          # JavaScript files
│   │   └── images/      # Image files
│   ├── index.html       # Original HTML content
│   ├── metadata.json    # Page metadata (title, description, OG tags)
│   ├── design-analysis.json # Analysis of design elements
│   ├── resources.json   # List of all resources found on the site
│   ├── text-content.txt # Extracted text content
│   ├── images.json      # Catalog of all images
│   └── screenshots      # Full-page screenshots
└── rebuild/             # The new rebuilt website
    ├── assets/          # New assets for the rebuilt site
    ├── index.html       # New HTML content
    └── ...              # Other rebuilt files
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

### Usage

1. Run the scraper to extract content from the Lucky Rabbit website:

```bash
npm run scrape
```

This will:
- Launch a browser and navigate to the Lucky Rabbit website
- Capture screenshots of the site in desktop and mobile views
- Extract HTML, CSS, JavaScript, and images
- Analyze design elements (colors, typography, layout)
- Save all content to the `scraped-content` directory

2. After scraping, you can begin rebuilding the site using the extracted content as reference.

## Scraping Process

The scraping script performs the following actions:

1. Creates necessary directories for storing scraped content
2. Launches a browser and navigates to the Lucky Rabbit website
3. Captures full-page screenshots in desktop and mobile views
4. Extracts HTML content and saves it to `index.html`
5. Analyzes and extracts design elements (colors, typography, layout)
6. Downloads CSS, JavaScript, and image files
7. Extracts text content and metadata
8. Catalogs all images on the site

## Rebuilding Process

After scraping, the rebuilding process will involve:

1. Creating a new design based on the extracted design elements
2. Implementing the new design with modern web technologies
3. Optimizing assets for performance
4. Adding new functionality as needed

## License

This project is for internal use only.