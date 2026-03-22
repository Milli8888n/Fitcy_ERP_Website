# Deep Dive Analysis: Homepage (Phive.pt)

## 1. Page Anatomy (DOM Structure)
Based on `en.html`, the homepage is structured as a single `<div data-component="scroller">` wrapper containing the page content. The main sections are:

### A. **Hero Section** (`<div data-component="home-header">`)
A complex, multi-layered hero section with video backgrounds and scrolling text ribbons.
*   **Layer 1: Backgrounds** (`.backgrounds-container`)
    *   Cycle of 3-5 background items (`<div data-component="background">`).
    *   Media: Contains both `<img>` (fallback/lazy) and `<video>` (autoplay loop).
*   **Layer 2: Ribbons** (`.ribbons-container`)
    *   Marquee text effect using `<div data-component="ribbon">`.
    *   Structure: `.ribbon-inner` -> `.container` -> `.title`.
    *   Text: "PHIVE PORTO", "PHIVE LISBON", "TRAIN EVERY DAY".
    *   States: `paused`, `active`, `splitted` (for transition effects).
*   **Layer 3: Content** (`.contents-container`)
    *   Overlays centered text contexts (`<div data-component="content">`).
    *   Elements: `<h3>` (Club Name), `<h2>` (CTA), `<a data-component="content-button">`.
*   **Layer 4: Navigation/Bullets** (`.bullets-container`)
    *   `<ul data-component="bullets">`: Slide indicators.

### B. **Clubs Showcase** (`<section data-component="phive-clubs">`)
A scroll-driven section showing club photos.
*   **Grid System**: Uses custom 16-column grid (`.xxlarge-6`, `.small-10`).
*   **Photo Grid**: `<div data-component="photo-grid">` with 10x4 grid layout containing `img` tiles.
*   **Sticky Behavior**: `.photos-ctas-container` has `height: 400vh` creating a scroll scrub effect.
*   **CTA Panel**: `<div data-component="call-to-action">` with rolling title "PHIVE".

### C. **Typography Section** (`<section data-component="bold-typography">`)
A visual break with large typography and video masked text.
*   **Component**: `<div data-component="bold-mobile">`.
*   **Content**: Words "FITNESS" and "STRONG" interacting with a background video.

### D. **Classes Section** (`<section data-component="classes-showcase">`)
Highlights available classes.
*   **Layout**: Sticky title row (`.title-row`) on the left, scrolling cards on the right.
*   **Grid**: `<div data-component="grid">` specific for class cards.
*   **Cards**: Reuses a generic card structure (likely `<ClassCard>`).

### E. **App Download** (`<section data-component="phive-app">`)
Promotes the mobile app.
*   **Background**: `<div data-component="image-asset-static">` (Phone mockup).
*   **Content**: Text description and Store badges (Apple/Google).

### F. **Footer** (`<div data-component="footer">`)
*   **Socials**: `<div data-component="social-networks-simple">` (Big circular balls).
*   **Links**: Privacy policy, Complaints book.
*   **Badges**: Portugal 2030.

---

## 2. Component Blueprint
We can map these directly to Vue/Nuxt components:

| Extracted `data-component` | Vue Component Name | Props/Features |
| :--- | :--- | :--- |
| `scroller` | `TheSmoothScroller.vue` | Lenis/Locomotive scroll wrapper |
| `home-header` | `HomeHero.vue` | Slideshow logic, Video handling |
| `background` | `HeroBackground.vue` | `src`, `videoSrc`, `isActive` |
| `ribbon` | `TextRibbon.vue` | `text`, `speed`, `direction` |
| `content` | `HeroSlideContent.vue` | `title`, `subtitle`, `ctaLabel`, `ctaLink` |
| `content-button` | `AppButton.vue` | `variant` (outline/solid), `label` |
| `phive-clubs` | `HomeClubsSection.vue` | ScrollTrigger integration |
| `photo-grid` | `ClubPhotoGrid.vue` | Grid layout CSS |
| `rolling-title` | `RollingTitle.vue` | Text hover effect (marquee on hover) |
| `classes-showcase`| `HomeClassesSection.vue`| Sticky layout, Class data listing |
| `phive-app` | `HomeAppSection.vue` | Static promotional section |
| `social-networks-simple`| `SocialBubbles.vue` | Physics/Spring animation for balls |

---

## 3. Key CSS & Animation Insights

### A. Typography System (from `en.html` style blocks)
*   **Font Families**: `PPFormula` (Display), `AcidGrotesk` (Body/UI), `PureHeart` (Script/Manuscript).
*   **Dynamic Sizes**: heavily uses `clamp()` and `vw` units.
    *   `-title-1`: `clamp(114px, ... , 340px)` -> Huge responsive titles.
    *   `-body-1`: `AcidGrotesk`, small text.
*   **Utilities**: `-uppercase`, `-text-center`.

### B. Grid System
*   **CSS Variables**: `var(--grid-num-cols: 16)`, `var(--grid-padding)`, `var(--grid-gutter)`.
*   **Classes**: `.col`, `.xxlarge-6` (reminiscent of Foundation/Bootstrap but custom).

### C. Color Palette
Extracted from `<body>` style:
*   `--color-yellow`: `#ffe000` (Brand Primary)
*   `--color-darkBrown`: `#161003` (Brand Black/Background)
*   `--color-white`: `#fff`
*   `--color-lightYellow`: `#fff4a6`

---

## 4. Nuxt Data Structure (Inferred)
The `window.__NUXT__` object suggests data is fetched from Sanity (Headless CMS).
For our **Mock Data**, we need structures like:

```json
// mock/home-hero.json
[
  {
    "id": 1,
    "clubName": "Phive Porto",
    "video": "/videos/hero-porto.mp4",
    "image": "/images/hero-porto.jpg",
    "ribbonText": "PHIVE PORTO",
    "cta": "Discover the Club",
    "link": "/clubs/porto"
  },
  ...
]
```

```json
// mock/home-clubs.json
{
  "title": "Phive has clubs located in...",
  "photos": ["/img/club1.jpg", "/img/club2.jpg", ...], // 10-12 photos
  "ctaTitle": "Phive",
  "ctaSubtitle": "Choose your club"
}
```

## 5. Next Steps
1.  **Refine Project Structure**: create `components/home/HomeHero.vue`, `components/home/HomeClubs.vue` etc.
2.  **Generate CSS Tokens**: Ensure `assets/css/typography.css` implements `-title-1` classes exactly as seen.
3.  **Implement Mock Data**: Create the JSON files based on the structure above.
