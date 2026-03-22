# PHÂN TÍCH CHI TIẾT KIẾN TRÚC WEBSITE PHIVE.PT

> **Mục đích:** Học hỏi cấu trúc components và design patterns để áp dụng cho dự án FitCity
> 
> **Nguồn:** Phân tích từ HTML rendered của phive.pt
> 
> **Ngày:** 05/02/2026

---

## 📋 MỤC LỤC

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Component Hierarchy](#2-component-hierarchy)
3. [Core Components](#3-core-components)
4. [Block Components](#4-block-components)
5. [Design System](#5-design-system)
6. [Animation Strategy](#6-animation-strategy)
7. [Data Flow](#7-data-flow)
8. [Best Practices](#8-best-practices)

---

## 1. TỔNG QUAN KIẾN TRÚC

### Tech Stack
```
Frontend Framework: Nuxt 3 (Vue 3 Composition API)
CMS: Sanity.io (Headless CMS)
Styling: SCSS + CSS Variables
Animations: GSAP + Three.js + Rive
Smooth Scroll: Lenis
State Management: Nuxt built-in (useState, useFetch)
```

### Cấu trúc thư mục (Suy luận từ HTML)
```
phive.pt/
├── components/
│   ├── core/           # Infrastructure components
│   ├── blocks/         # Page section components
│   ├── fragments/      # Reusable UI pieces
│   ├── primitives/     # Basic UI elements
│   └── modals/         # Modal/Drawer components
├── composables/        # Reusable logic
├── pages/              # Route pages
├── assets/             # Static assets
└── config/             # Configuration files
```

---

## 2. COMPONENT HIERARCHY

### Atomic Design Pattern

```
Level 1: Primitives (Atoms)
├── Button
├── Input
├── CircleBtn
├── Burger
└── SoundBtn

Level 2: Fragments (Molecules)
├── Bar (Menu bar)
├── MenuGrid
├── ClubsCards
└── LegalNotice

Level 3: Blocks (Organisms)
├── HomeHeader
├── PhiveClubs
├── ClassesShowcase
├── PhiveApp
└── Footer

Level 4: Pages (Templates)
└── PageBuilder (Dynamic page assembly)
```

---

## 3. CORE COMPONENTS

### 3.1 Scroller Component
**Mục đích:** Quản lý smooth scrolling với Lenis

**Cấu trúc:**
```vue
<Scroller ref="mainScroller" :main="true">
  <NuxtPage />
</Scroller>
```

**Đặc điểm:**
- Tích hợp Lenis smooth scroll
- Provide/Inject pattern để chia sẻ scroller instance
- Custom scrollbar styling
- Overscroll behavior control

**Học được:**
- Sử dụng `provide('$scroller', scrollerRef)` để components con truy cập
- Lenis config: `{ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }`

---

### 3.2 Grid Component
**Mục đích:** Debug grid overlay (Ctrl+G)

**Cấu trúc:**
```vue
<div data-component="grid" :data-show="show">
  <div v-for="col in 16" :class="`col xxlarge-1`" />
</div>
```

**Đặc điểm:**
- 16 columns grid system
- Toggle với keyboard shortcut (Ctrl+G)
- Fixed position overlay
- Semi-transparent red columns

**Học được:**
- Developer tools nên được tích hợp sẵn
- Keyboard shortcuts cho productivity
- CSS Grid với custom properties

---

### 3.3 Page Component
**Mục đích:** Wrapper cho mỗi page với metadata

**Props:**
```typescript
{
  slug: string
  name: string
  metadata: {
    title: string
    description: string
    ogImage: string
  }
  transitionEnter: Function
  transitionLeave: Function
}
```

**Học được:**
- SEO metadata được quản lý ở component level
- Custom page transitions
- Structured data cho từng page

---

### 3.4 PageBuilder Component
**Mục đích:** Dynamic rendering blocks từ CMS

**Cấu trúc:**
```vue
<PageBuilder :blocks="data.blocks" />

// Internally:
<component 
  v-for="block in blocks" 
  :is="getBlockComponent(block._type)"
  :key="block._key"
  v-bind="block"
/>
```

**Học được:**
- Dynamic component rendering
- CMS-driven architecture
- Block-based content management

---

## 4. BLOCK COMPONENTS

### 4.1 HomeHeader (Hero Section)

**HTML Structure:**
```html
<section data-component="home-header">
  <div class="carousel-container">
    <div class="ribbon" data-component="ribbon">
      <!-- Infinite scroll text -->
    </div>
  </div>
  <div class="contents-container">
    <!-- CTA buttons -->
  </div>
  <div class="bullets-container">
    <!-- Progress indicators -->
  </div>
</section>
```

**Tính năng:**
- Infinite horizontal scroll text (ribbon effect)
- Auto-play carousel với bullets navigation
- Audio integration cho mỗi slide
- Responsive images với srcset

**CSS Variables sử dụng:**
```css
--loop-duration: 10s
--ribbon-speed: linear
```

**Học được:**
- Ribbon effect: duplicate content 3 lần, animate transform
- Audio sync với carousel state
- Custom bullet indicators với progress animation

---

### 4.2 PhiveClubs Component

**HTML Structure:**
```html
<section data-component="phive-clubs" data-section-intersect="light">
  <div class="animation-container">
    <!-- WebGL background -->
  </div>
  <div class="photos-grid">
    <!-- Masonry grid of club photos -->
  </div>
  <div class="call-to-action">
    <h2 data-component="rolling-title">Phive</h2>
    <p class="subtitle">Choose your club</p>
    <div class="ctas-list">
      <ButtonRoundVariable>View all Clubs</ButtonRoundVariable>
      <ButtonRoundVariable type="secondary">Schedule a visit</ButtonRoundVariable>
    </div>
  </div>
  <div class="statistics-container">
    <!-- Club features list -->
  </div>
</section>
```

**Tính năng:**
- Intersection Observer để trigger animations
- Photo grid với lazy loading
- Rolling title effect
- Statistics table

**Học được:**
- `data-section-intersect` attribute để control theme
- Photo grid: CSS Grid với auto-fill
- Lazy loading images với `loading="lazy"`

---

### 4.3 ClassesShowcase Component

**HTML Structure:**
```html
<section data-component="classes-showcase" data-three-sticky="end">
  <div class="title-row">
    <h2 data-component="rolling-title">Classes</h2>
    <p class="description">...</p>
  </div>
  <div class="classes-cards-container">
    <div data-component="grid">
      <!-- Dynamic class cards -->
    </div>
  </div>
</section>
```

**Tính năng:**
- Three.js sticky scroll effect
- Grid layout cho class cards
- Filter/sort functionality

**Học được:**
- `data-three-sticky` attribute để control 3D effects
- Grid component có thể reuse cho nhiều contexts
- Scroll-triggered 3D animations

---

### 4.4 PhiveApp Component

**HTML Structure:**
```html
<section data-component="phive-app" data-section-intersect="light">
  <div class="background-container">
    <ImageAssetStatic 
      :sources="[
        { media: '(min-width: 1440px)', src: '/imgs/phive-app.jpg' },
        { media: '(min-width: 743px)', src: '/imgs/phive-app-tablet.jpg' },
        { default: '/imgs/phive-app-mobile.jpg' }
      ]"
    />
  </div>
  <div class="content-row">
    <h2>Phive App</h2>
    <p>Schedule and manage your classes...</p>
    <ul class="list">
      <li><a href="apple-store"><img src="apple-download.svg"></a></li>
      <li><a href="google-play"><img src="google-download.svg"></a></li>
    </ul>
  </div>
</section>
```

**Tính năng:**
- Responsive background images
- Picture element với multiple sources
- App store badges

**Học được:**
- ImageAssetStatic component với responsive sources
- Content overlay trên background image
- Mobile-first responsive design

---

### 4.5 Footer Component

**HTML Structure:**
```html
<div data-component="footer" data-section-intersect="dark">
  <div class="animation-container">
    <!-- Background animation -->
    <div class="cta-container">
      <ButtonRoundVariable size="large">Know more</ButtonRoundVariable>
    </div>
  </div>
  
  <div class="social-container">
    <div data-component="social-networks-simple">
      <ul class="list">
        <li v-for="social in socials" class="item">
          <a :href="social.url">
            <div class="images-container">
              <!-- Multiple images for hover effect -->
            </div>
            <div class="content-container">
              <span class="initials">{{ social.initials }}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
  
  <div class="description-container">
    <h2>Keep up with all the latest on our socials!</h2>
  </div>
  
  <div class="items-container">
    <div class="left-col">
      <ul>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="complaints">Complaints Book</a></li>
      </ul>
    </div>
    <div class="center-col">
      <a href="portugal-2030"><img src="ue-badges.svg"></a>
    </div>
    <div class="right-col">
      <a href="burocratik.com">Made by Büro</a>
    </div>
  </div>
</div>
```

**Tính năng:**
- Social media với hover animations
- Multiple images per social link (carousel on hover)
- EU funding badge
- Three-column layout

**Học được:**
- Social networks component với image carousel
- Footer CTA placement
- Credits và legal links organization

---

## 5. DESIGN SYSTEM

### 5.1 Typography System

**Font Families:**
```css
--font-primary: 'PPFormula' (Headings, Titles)
--font-secondary: 'AcidGrotesk' (Body, UI)
--font-accent: 'PureHeart' (Manuscript style)
```

**Typography Scale:**
```css
/* Titles */
.-title-1: clamp(114px, 46.725px + 100vw * .1725, 340px)
.-title-2: clamp(120px, 66.414px + 100vw * .1374, 300px)
.-title-3: clamp(80px, 47.24px + 100vw * .084, 190px)
.-title-4: clamp(68px, 46.55px + 100vw * .055, 140px)
.-title-5: clamp(34px, 29.242px + 100vw * .0122, 50px)
.-title-6: clamp(20px, 17.036px + 100vw * .0076, 30px)

/* Manuscript */
.-manuscript-1: clamp(40px, 19.174px + 100vw * .0534, 110px)
.-manuscript-2: clamp(60px, 24.276px + 100vw * .0916, 180px)
.-manuscript-3: clamp(40px, 28.105px + 100vw * .0305, 80px)

/* Body */
.-headline: clamp(36px, 28.863px + 100vw * .0183, 60px)
.-callout: clamp(18px, 17.415px + 100vw * .0015, 20px)
.-subhead-1: clamp(30px, 25.242px + 100vw * .0122, 46px)
.-subhead-2: clamp(16px, 14.206px + 100vw * .0046, 22px)
.-body-1: clamp(12px, 11.415px + 100vw * .0015, 14px)
.-caption-1: clamp(18px, 16.791px + 100vw * .0031, 22px)
.-label-1: clamp(10px, 9.415px + 100vw * .0015, 12px)
.-footnote-1: clamp(8px, 7.415px + 100vw * .0015, 10px)
```

**Font Variations:**
```css
/* PPFormula có variable font settings */
font-variation-settings: "wdth" 0, "wght" 400;

/* Weights sử dụng: */
- 350 (Light)
- 400 (Regular)
- 500 (Medium)
- 610 (Semibold)
- 700 (Bold)
```

**Học được:**
- Fluid typography với `clamp()`
- Variable fonts để tiết kiệm bandwidth
- Semantic naming convention
- Responsive typography không cần media queries

---

### 5.2 Color System

**Primary Colors:**
```css
--color-black: #000
--color-white: #fff
--color-yellow: #ffe000       /* Brand primary */
--color-warmYellow: #ffd904   /* Brand secondary */
--color-subduedYellow: #f6c548
--color-lightYellow: #fff4a6
```

**Neutral Colors:**
```css
--color-darkBrown: #161003    /* Dark theme bg */
--color-midBrown: #211e16
--color-lightBrown: #3c3627
--color-warmGrey: #f3efd7
```

**Accent Colors:**
```css
--color-nutrition: #d9f7bb    /* Green */
--color-stream: #b76eff       /* Purple */
--color-pilates: #f7bbce      /* Pink */
--color-red: #ff004d
```

**Theme Variants:**
```css
/* Light Theme */
[data-theme="light"] {
  --menu-color: var(--color-darkBrown);
  --menu-backgroundColor: var(--color-yellow);
  --menu-secondaryBackgroundColor: var(--color-lightYellow);
}

/* Dark Theme */
[data-theme="dark"] {
  --menu-color: var(--color-yellow);
  --menu-backgroundColor: var(--color-darkBrown);
  --menu-secondaryBackgroundColor: var(--color-lightBrown);
}

/* Specialized Themes */
[data-theme="stream"] { /* Purple theme */ }
[data-theme="pilates"] { /* Pink theme */ }
[data-theme="nutrition"] { /* Green theme */ }
```

**Học được:**
- CSS Variables cho theming
- Color naming theo semantic (không theo màu)
- Multiple theme variants
- Context-based color switching

---

### 5.3 Spacing System

**Grid System:**
```css
--grid-num-cols: 16
--grid-max-width: 106.25rem (1700px)
--grid-padding: clamp(8px, 3.242px + 100vw * .0122, 24px)
--grid-gutter: clamp(2px, -.964px + 100vw * .0076, 12px)
--grid-inset: calc(var(--grid-padding) + var(--grid-gutter))
```

**Breakpoints:**
```css
--xxlarge: 2000px
--xlarge: 1700px
--large: 1440px
--medium: 1290px
--small: 1023px
--xsmall: 743px
--xxsmall: 410px
```

**Column Classes:**
```html
<!-- 16-column grid -->
<div class="xxlarge-6">  <!-- 6/16 = 37.5% -->
<div class="xxlarge-8">  <!-- 8/16 = 50% -->
<div class="xxlarge-16"> <!-- 16/16 = 100% -->

<!-- Responsive -->
<div class="xxlarge-6 small-8 xsmall-14">
```

**Học được:**
- 16-column grid (không phải 12)
- Fluid spacing với clamp()
- Mobile-first responsive classes
- Semantic breakpoint names

---

### 5.4 Component Patterns

#### Button Variants

**1. ButtonRoundVariable:**
```html
<button 
  data-component="button-round-variable"
  data-type="primary|secondary"
  data-size="medium|large"
  data-disabled="false"
>
  <span class="bg"></span>
  <div data-component="variable-label">
    <span class="label">Text</span>
  </div>
</button>
```

**Styles:**
```css
/* Primary */
background-color: var(--roundButton-color, var(--color-yellow));
color: var(--roundButton-backgroundColor, var(--color-darkBrown));

/* Secondary */
background-color: transparent;
border: 1px solid var(--roundButton-color);
color: var(--roundButton-color);

/* Hover */
@media (hover: hover) {
  &:hover {
    background-color: var(--color-subduedYellow);
    transform: scale(1.05);
  }
}
```

**2. ButtonVariable:**
```html
<button data-component="button-variable">
  <span class="bg"></span>
  <div class="label-container">
    <span class="label">Text</span>
  </div>
</button>
```

**3. CircleBtn:**
```html
<button 
  data-component="circle-btn"
  class="medium|large"
>
  <div data-component="rive-asset" class="icon">
    <!-- Rive animation -->
  </div>
</button>
```

**Học được:**
- Separate `<span class="bg">` cho hover effects
- Variable label component cho text animations
- Size variants với classes
- Rive animations cho icons

---

## 6. ANIMATION STRATEGY

### 6.1 Scroll Animations

**Intersection Observer Pattern:**
```html
<section data-section-intersect="light|dark">
  <!-- Content -->
</section>
```

**Implementation:**
```javascript
// Composable: useSectionIntersect.js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const theme = entry.target.dataset.sectionIntersect
      updateTheme(theme)
    }
  })
}, { threshold: 0.5 })
```

**Học được:**
- Theme switching dựa trên scroll position
- Intersection Observer cho performance
- Data attributes để config

---

### 6.2 Text Animations

**Rolling Title Effect:**
```html
<h2 data-component="rolling-title">
  <span class="first label">Phive</span>
  <span class="last label">Phive</span>
</h2>
```

**GSAP Timeline:**
```javascript
// Duplicate text cho rolling effect
gsap.timeline()
  .from('.first', { y: '100%', duration: 1 })
  .to('.first', { y: '-100%', duration: 1 }, '+=2')
  .from('.last', { y: '100%', duration: 1 }, '-=1')
```

**Variable Label (Hover Effect):**
```html
<div data-component="variable-label" data-hover="false">
  <span class="label-spacing">Text</span>
  <div class="inner">
    <span class="label">Text</span>
  </div>
</div>
```

**CSS:**
```css
.label {
  transition: font-variation-settings 0.75s cubic-bezier(0.075, 0.82, 0.165, 1);
}

[data-hover="true"] .label {
  font-variation-settings: "wdth" 10, "wght" 600;
  letter-spacing: -0.01em;
}
```

**Học được:**
- Duplicate elements cho complex animations
- Variable fonts cho smooth transitions
- GSAP timelines cho sequencing
- Cubic-bezier easing cho natural motion

---

### 6.3 Page Transitions

**Curtain Transition:**
```html
<div data-component="curtain">
  <span class="top" data-transition=""></span>
  <span class="line">
    <span class="inner"></span>
  </span>
  <span class="bottom" data-transition=""></span>
  <span class="full" data-state=""></span>
</div>
```

**GSAP Animation:**
```javascript
// Enter
gsap.timeline()
  .set('.top, .bottom', { scaleY: 0 })
  .to('.top', { scaleY: 1, transformOrigin: 'bottom', duration: 0.6 })
  .to('.bottom', { scaleY: 1, transformOrigin: 'top', duration: 0.6 }, '-=0.3')
  .to('.line .inner', { scaleX: 1, duration: 0.4 }, '-=0.4')

// Exit (reverse)
```

**Học được:**
- Custom page transitions với GSAP
- Transform origin cho direction control
- Overlapping animations với timeline offsets
- Curtain reveal effect pattern

---

### 6.4 Three.js Integration

**WebGL Background:**
```html
<div class="animation-container">
  <canvas id="webgl-canvas"></canvas>
</div>
```

**Usage Pattern:**
```javascript
// components/blocks/BoldTypography/webgl/ThreeScene.vue
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true })

// Scroll-based animation
const scrollProgress = scrollY / maxScroll
mesh.rotation.y = scrollProgress * Math.PI * 2
```

**Học được:**
- Three.js cho background effects
- Scroll-driven 3D animations
- Alpha transparency cho overlay
- Performance optimization với RAF

---

### 6.5 Rive Animations

**Icon Animations:**
```html
<div data-component="rive-asset" class="icon">
  <!-- Rive file loaded dynamically -->
</div>
```

**Audio Integration:**
```javascript
// Audio controller
const { loadAudio, playAudio } = useAudioController()

onMounted(() => {
  audio.forEach(el => {
    loadAudio(el.slug, ['/assets/rive/' + el.assetId + '.mp3'])
  })
})

// Play on interaction
playAudio(currentSlug)
```

**Học được:**
- Rive cho interactive vector animations
- Audio sync với UI state
- Lazy loading audio files
- Audio controller pattern

---

## 7. DATA FLOW

### 7.1 CMS Integration (Sanity)

**Configuration:**
```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: 'z6ex5ahr',
    dataset: 'production',
    apiVersion: '2022-03-07',
    useCdn: true
  }
})
```

**Data Fetching:**
```javascript
// pages/[...path].vue
const { data } = await useFetch('/cms/page', {
  query: {
    path: path.value,
    lang: locale.value
  },
  key: `page-${path.value}-${locale.value}`
})
```

**Học được:**
- Server-side data fetching
- Cache key strategy
- Multi-language support
- API route abstraction

---

### 7.2 Dynamic Routing

**Catch-all Route:**
```javascript
// pages/[...path].vue
const route = useRoute()
const runtime = useRuntimeConfig()

// Validate path exists
if (!runtime.public.paths.includes(route.path)) {
  throw showError({
    statusCode: 404,
    statusMessage: 'Page not found'
  })
}
```

**Available Paths:**
```javascript
// Stored in runtime config
paths: [
  "/",
  "/en",
  "/aulas",
  "/en/classes",
  "/clubes",
  "/en/clubs",
  "/clubes/lisboa",
  "/en/clubs/lisbon",
  // ... 90+ paths
]
```

**Học được:**
- Pre-validated paths cho SEO
- Catch-all routing với validation
- Runtime config cho dynamic data
- 404 handling

---

### 7.3 Internationalization (i18n)

**Language Detection:**
```javascript
// i18n/index.js
export const useLocale = () => {
  const route = useRoute()
  const locale = computed(() => {
    return route.path.startsWith('/en') ? 'en' : 'pt'
  })
  return locale
}
```

**Translations:**
```javascript
// Runtime config
stringTranslations: {
  en: {
    all: "All",
    class: "Class",
    classes: "Classes",
    // ...
  },
  pt: {
    all: "Todas",
    class: "Aula",
    classes: "Aulas",
    // ...
  }
}
```

**Học được:**
- Path-based locale detection
- Runtime translations
- Computed locale
- Simple i18n without heavy libraries

---

## 8. BEST PRACTICES

### 8.1 Performance Optimization

**1. Image Optimization:**
```html
<!-- Responsive images với srcset -->
<img 
  srcset="
    /_ipx/f_webp&s_400x575/image.jpg 400w,
    /_ipx/f_webp&s_800x1150/image.jpg 800w,
    /_ipx/f_webp&s_1200x1725/image.jpg 1200w
  "
  sizes="(max-width: 1100px) 400px, 1200px"
  loading="lazy"
  decoding="async"
/>
```

**2. Code Splitting:**
```javascript
// Lazy load components
const ThreeScene = defineAsyncComponent(() => 
  import('~/components/blocks/BoldTypography/webgl/ThreeScene.vue')
)
```

**3. Preloading Critical Assets:**
```html
<link rel="preload" as="font" href="/fonts/AcidGroteskVF.woff2" type="font/woff2" crossorigin>
```

**Học được:**
- WebP format với fallbacks
- Lazy loading images
- Font preloading
- Dynamic imports

---

### 8.2 Accessibility

**1. ARIA Labels:**
```html
<button aria-label="Menu Button">
  <span><!-- Icon --></span>
</button>
```

**2. Semantic HTML:**
```html
<nav>
  <ul>
    <li><a href="/clubs">Clubs</a></li>
  </ul>
</nav>
```

**3. Focus Management:**
```css
:focus {
  outline: 2px solid var(--color-yellow);
  outline-offset: 2px;
}
```

**Học được:**
- ARIA labels cho interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Focus indicators

---

### 8.3 SEO Optimization

**1. Meta Tags:**
```javascript
useHead({
  title: page.metadata.title,
  meta: [
    { name: 'description', content: page.metadata.description },
    { property: 'og:title', content: page.metadata.title },
    { property: 'og:image', content: page.metadata.ogImage }
  ]
})
```

**2. Structured Data:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "Phive",
  "url": "https://phive.pt"
}
</script>
```

**3. Sitemap Generation:**
```javascript
// All paths pre-defined in runtime config
// Used for sitemap.xml generation
```

**Học được:**
- Dynamic meta tags
- Open Graph optimization
- Structured data
- Pre-rendered paths

---

### 8.4 Code Organization

**1. Component Naming:**
```
Pattern: [Purpose][Type]
Examples:
- ButtonRoundVariable (UI element)
- HomeHeader (Block component)
- useSectionIntersect (Composable)
```

**2. Data Attributes:**
```html
<!-- Component identification -->
<div data-component="menu-grid">

<!-- State management -->
<div data-open="true">

<!-- Configuration -->
<div data-theme="dark">
<div data-section-intersect="light">
```

**3. CSS Methodology:**
```css
/* Utility classes với prefix */
.-title-1
.-uppercase
.-text-center

/* Component scoping */
[data-component="button"] { }

/* State variants */
[data-component="button"][data-disabled="true"] { }
```

**Học được:**
- Consistent naming conventions
- Data attributes cho state
- Utility-first CSS
- Component scoping

---

## 9. KẾT LUẬN & KHUYẾN NGHỊ

### Điểm mạnh của kiến trúc Phive:

✅ **Component-driven architecture** - Dễ maintain và scale
✅ **CMS-driven content** - Non-technical users có thể update
✅ **Performance-focused** - Lazy loading, code splitting
✅ **Animation-rich** - Premium user experience
✅ **Responsive design** - Mobile-first approach
✅ **SEO-optimized** - Pre-rendered paths, meta tags

### Áp dụng cho FitCity:

**1. Tech Stack đề xuất:**
```
Framework: Nuxt 3
CMS: Strapi (open-source alternative to Sanity)
Styling: Tailwind CSS + SCSS
Animations: GSAP + Framer Motion
Smooth Scroll: Lenis
```

**2. Components cần xây dựng:**
```
Priority 1 (MVP):
- Layout (Header, Footer)
- Hero Section
- Classes Grid
- Club Cards
- Contact Form

Priority 2:
- Timetable
- Membership Plans
- Trainer Profiles
- Blog

Priority 3:
- 3D Animations
- Audio Integration
- Advanced Transitions
```

**3. Design System:**
```
Colors: 
- Primary: Brand color của FitCity
- Secondary: Accent color
- Neutral: Grays cho text/backgrounds

Typography:
- Headings: Bold sans-serif
- Body: Clean sans-serif
- Accent: Optional display font

Spacing:
- 8px base unit
- 12-column grid (easier than 16)
```

---

## 10. NEXT STEPS

### Để bắt đầu dự án FitCity:

**Bước 1: Setup Project**
```bash
npx nuxi@latest init fitcity
cd fitcity
npm install
```

**Bước 2: Install Dependencies**
```bash
npm install -D sass
npm install gsap lenis
npm install @nuxtjs/strapi
```

**Bước 3: Create Design System**
- Define color palette
- Setup typography scale
- Create spacing system
- Build component library

**Bước 4: Build Core Components**
- Layout components
- Navigation
- Footer
- Basic UI elements

**Bước 5: Implement Features**
- Homepage
- Classes page
- Clubs page
- Contact form

---

## TÀI LIỆU THAM KHẢO

### Official Documentation:
- Nuxt 3: https://nuxt.com
- GSAP: https://greensock.com/gsap
- Lenis: https://lenis.studiofreight.com
- Strapi: https://strapi.io

### Design Inspiration:
- Awwwards: https://awwwards.com/websites/fitness
- Dribbble: https://dribbble.com/tags/fitness-website

### Learning Resources:
- Vue Mastery: https://vuemastery.com
- GSAP Learning: https://greensock.com/learning
- CSS Tricks: https://css-tricks.com

---

**Tài liệu này được tạo bởi:** Antigravity AI
**Ngày:** 05/02/2026
**Mục đích:** Educational analysis cho dự án FitCity
