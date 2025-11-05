# Hero Section Background Image Setup

## What Was Changed

I've updated your hero section to support a background image with a beautiful overlay effect. The changes include:

1. **Background Image Support**: Added support for a background image in the hero section
2. **Dark Overlay**: Added a dark gradient overlay (85-90% opacity) to ensure text remains readable
3. **Accent Overlay**: Added a subtle golden accent overlay that matches your brand color
4. **Parallax Effect**: Added a fixed background attachment for a modern parallax scrolling effect
5. **Mobile Optimization**: Disabled parallax on mobile devices for better performance

## How to Add Your Background Image

### Option 1: Add Your Own Image

1. **Choose your image**: Select a high-quality group/team/gym photo
   - Recommended size: 1920x1080 pixels or larger
   - Format: JPG, PNG, or WebP
   - Subject: Team photo, gym facility, training session, etc.

2. **Name the file**: Rename your image to `hero-bg.jpg`

3. **Place the file**: Put `hero-bg.jpg` in the root directory of your project
   ```
   client-muscle mentors/
   ├── hero-bg.jpg  ← Place your image here
   ├── index.html
   ├── css/
   └── ...
   ```

### Option 2: Use a Different Image Name or Path

If you want to use a different filename or location, update line 268 in `css/styles.css`:

**Current:**
```css
url('../hero-bg.jpg')
```

**Change to your image path:**
```css
url('../your-image-name.jpg')
```
or if in a different folder:
```css
url('../images/your-image-name.jpg')
```

## Testing

After adding your image:
1. Open `index.html` in your browser
2. The hero section should display your background image with the overlay
3. Scroll down to see the parallax effect (on desktop)
4. Check on mobile to ensure it looks good there too

## Troubleshooting

### Image Not Showing?
- Check the file path in `css/styles.css` line 268
- Make sure the image filename matches exactly (case-sensitive)
- Verify the image is in the correct folder
- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)

### Image Too Bright/Dark?
Adjust the overlay opacity in `css/styles.css` line 267:
- Current: `rgba(13, 20, 33, 0.85)` (85% dark)
- Lighter: `rgba(13, 20, 33, 0.70)` (70% dark)
- Darker: `rgba(13, 20, 33, 0.95)` (95% dark)

### Want to Remove the Golden Accent?
Comment out or delete lines 277-286 in `css/styles.css`:
```css
/* .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(235, 190, 11, 0.1) 0%, rgba(13, 20, 33, 0.3) 100%);
    pointer-events: none;
} */
```

## Tips for Best Results

1. **Image Selection**: Choose an image with people/action in the center or right side, so it doesn't conflict with your hero text on the left
2. **Image Quality**: Use high-resolution images for crisp display on all screen sizes
3. **File Size**: Optimize your image (compress it) to keep page load times fast (aim for under 500KB)
4. **Contrast**: Ensure your image has good contrast so the text overlay remains readable

## Current Settings

- **Overlay Color**: Dark blue (#0d1421)
- **Overlay Opacity**: 85-90%
- **Accent Color**: Golden yellow (matching your brand)
- **Background Position**: Center
- **Background Size**: Cover (fills entire section)
- **Parallax**: Enabled (desktop only)

Enjoy your new hero section background! 🎉

