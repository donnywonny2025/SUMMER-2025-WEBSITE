# Lucky Rabbit Website Integration Guide

## Overview

This guide explains how to integrate the Lucky Rabbit website into the main SUMMER 2025 WEBSITE. The Lucky Rabbit site has been successfully rebuilt and can be embedded within our main React application.

## Current Status

- ✅ The Lucky Rabbit site has been completely rebuilt with all original sections
- ✅ All necessary HTML, CSS, and JavaScript files are in place
- ✅ All images have been copied from the scraped content
- ✅ The site is fully functional and matches the original design

## Integration Method

We've created a React component (`LuckyRabbitEmbed.tsx`) that embeds the Lucky Rabbit site in an iframe. This allows us to:

1. Display the Lucky Rabbit site within our main application
2. Maintain separation between the codebases
3. Easily update either site independently

## Deployment Steps

### 1. Copy the Lucky Rabbit site to the public folder

```bash
mkdir -p /Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE/working/public/lucky-rabbit
cp -R /Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE/Lucky\ Rabbit/rebuild/* /Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE/working/public/lucky-rabbit/
```

### 2. Add the LuckyRabbitEmbed component to your routes

The component has been created at:
- `/Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE/working/src/components/LuckyRabbitEmbed.tsx`

A sample page has been created at:
- `/Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE/working/src/pages/LuckyRabbitPage.tsx`

### 3. Update your routing configuration

Add the Lucky Rabbit page to your routing configuration (depends on your router implementation).

## Testing

After deployment, you can access the Lucky Rabbit site at:

```
http://your-main-website-url/lucky-rabbit
```

Or through the React application route that uses the `LuckyRabbitEmbed` component.

## Troubleshooting

- If images don't load, check that all image paths in the Lucky Rabbit HTML are relative
- If styles are missing, ensure all CSS files were copied correctly
- If the iframe doesn't display, check your Content Security Policy settings

## Future Improvements

- Consider implementing a more seamless integration using a shared header/footer
- Add analytics tracking across both sites
- Implement a shared design system for consistent branding