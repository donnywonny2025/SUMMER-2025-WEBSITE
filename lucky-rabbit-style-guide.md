# Lucky Rabbit Website Style Guide

## Color Scheme

### Original Site Colors
- Primary Color: `#8BC34A` (Green)
- Secondary Color: `#689F38` (Darker Green)
- Accent Color: `#4CAF50` (Medium Green)
- Highlight Color: `#CDDC39` (Lime)
- Text Color: `#333333`
- Light Text: `#ffffff`
- Background Color: `#ffffff`
- Light Gray: `#f5f5f5`
- Dark Gray: `#4a4a4a`

### Local Development Colors (Need to Update)
- Primary Color: `#0a2463` (Dark Blue) → Change to `#8BC34A`
- Secondary Color: `#3E92CC` (Blue) → Change to `#689F38`
- Accent Color: `#2EC4B6` (Teal) → Change to `#4CAF50`
- Highlight Color: `#FF9F1C` (Orange) → Change to `#CDDC39`

## Typography

### Original Site Fonts
- Main Font: 'Avenir', Arial, Helvetica, sans-serif
- Heading Font: 'Avenir', Arial, Helvetica, sans-serif
- Base Font Size: 16px
- Line Height: 1.6

### Local Development Fonts (Need to Update)
- Main Font: Arial, Helvetica, sans-serif → Change to 'Avenir', Arial, Helvetica, sans-serif
- Heading Font: Arial, Helvetica, sans-serif → Change to 'Avenir', Arial, Helvetica, sans-serif

## Spacing & Layout

### Common Elements
- Container Max Width: 1200px
- Container Padding: 0 20px
- Border Radius: 4px
- Box Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Transition: all 0.3s ease

### Animations
- Original site includes a fadeIn animation that's missing in the local version:
  ```css
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  ```

## Implementation Notes

1. Update all color variables in the local CSS to match the original green color scheme
2. Add the Avenir font family to both main and heading font variables
3. Add the missing fadeIn animation to the local CSS
4. Ensure all sections use consistent spacing that matches the original site
5. Verify that responsive breakpoints match between both versions