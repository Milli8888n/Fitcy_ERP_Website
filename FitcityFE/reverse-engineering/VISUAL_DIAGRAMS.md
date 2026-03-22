# 📊 PHIVE ARCHITECTURE - VISUAL DIAGRAMS

> Visual representations của kiến trúc Phive.pt

---

## 1. COMPONENT HIERARCHY

```
┌─────────────────────────────────────────────────────────────┐
│                         APP.VUE                              │
│                    (Root Component)                          │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   SCROLLER   │    │  MENU GRID   │    │   CURTAIN    │
│   (Lenis)    │    │ (Navigation) │    │ (Transition) │
└──────────────┘    └──────────────┘    └──────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│                       NUXT PAGE                               │
│                   (Dynamic Routing)                           │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│                     PAGE BUILDER                              │
│              (Dynamic Component Rendering)                    │
└──────────────────────────────────────────────────────────────┘
        │
        ├─────────────┬─────────────┬─────────────┬─────────────┐
        ▼             ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ HOME HEADER  │ │  PHIVE   │ │ CLASSES  │ │  PHIVE   │ │  FOOTER  │
│   (Hero)     │ │  CLUBS   │ │ SHOWCASE │ │   APP    │ │          │
└──────────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

---

## 2. DATA FLOW

```
┌──────────────┐
│     USER     │
│   REQUEST    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│        NUXT ROUTER                   │
│   pages/[...path].vue                │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│    VALIDATE PATH                     │
│  runtime.public.paths.includes()     │
└──────┬───────────────────────────────┘
       │
       ├─── NOT FOUND ──→ [404 Error]
       │
       ▼ FOUND
┌──────────────────────────────────────┐
│      FETCH FROM CMS                  │
│  useFetch('/cms/page', {             │
│    query: { path, lang }             │
│  })                                  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│     RECEIVE PAGE DATA                │
│  {                                   │
│    slug, name, metadata,             │
│    blocks: [...]                     │
│  }                                   │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│      PAGE BUILDER                    │
│  v-for="block in blocks"             │
│  :is="getComponent(block._type)"     │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│    RENDER COMPONENTS                 │
│  HomeHeader, PhiveClubs, etc.        │
└──────────────────────────────────────┘
```

---

## 3. ANIMATION SYSTEM

```
┌─────────────────────────────────────────────────────────────┐
│                    ANIMATION LAYERS                          │
└─────────────────────────────────────────────────────────────┘

Layer 1: SMOOTH SCROLL (Lenis)
├─ Smooth scrolling behavior
├─ Custom easing function
└─ RAF (RequestAnimationFrame) loop

Layer 2: SCROLL-TRIGGERED (GSAP ScrollTrigger)
├─ Fade-in animations
├─ Parallax effects
├─ Scroll-based timelines
└─ Pin/Unpin sections

Layer 3: INTERACTION (GSAP)
├─ Hover effects
├─ Click animations
├─ State transitions
└─ Micro-interactions

Layer 4: 3D EFFECTS (Three.js)
├─ WebGL backgrounds
├─ 3D object animations
├─ Particle systems
└─ Scroll-driven 3D

Layer 5: VECTOR ANIMATIONS (Rive)
├─ Icon animations
├─ Interactive graphics
├─ State machines
└─ Playback control
```

---

## 4. THEME SWITCHING MECHANISM

```
┌─────────────────────────────────────────────────────────────┐
│                   SCROLL POSITION                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              INTERSECTION OBSERVER                           │
│  observes: [data-section-intersect]                         │
│  threshold: 0.5                                             │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Section 1    │    │ Section 2    │    │ Section 3    │
│ data-theme=  │    │ data-theme=  │    │ data-theme=  │
│  "light"     │    │  "dark"      │    │  "stream"    │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         UPDATE DOCUMENT ATTRIBUTE                            │
│  document.documentElement.setAttribute('data-theme', X)      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              CSS VARIABLES UPDATE                            │
│  [data-theme="dark"] {                                      │
│    --bg-color: #161003;                                     │
│    --text-color: #fff;                                      │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. COMPONENT COMMUNICATION

```
┌─────────────────────────────────────────────────────────────┐
│                     APP.VUE (ROOT)                           │
│                                                              │
│  const scrollerRef = ref(null)                              │
│  provide('$scroller', scrollerRef)                          │
│                                                              │
│  const curtainRef = ref(null)                               │
│  provide('$curtain', curtainRef)                            │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────────┐            ┌──────────────────────┐
│   CHILD COMPONENT A  │            │   CHILD COMPONENT B  │
│                      │            │                      │
│  const scroller =    │            │  const curtain =     │
│    inject('$scroller')│            │    inject('$curtain')│
│                      │            │                      │
│  scroller.scrollTo() │            │  curtain.open()      │
└──────────────────────┘            └──────────────────────┘
```

---

## 6. RESPONSIVE GRID SYSTEM

```
┌─────────────────────────────────────────────────────────────┐
│                    16-COLUMN GRID                            │
└─────────────────────────────────────────────────────────────┘

Desktop (xxlarge: > 2000px)
├─ 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
│  └──────────────┘ └──────────────┘
│    6 columns        6 columns
│    (37.5%)          (37.5%)

Tablet (small: < 1023px)
├─ 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
│  └──────────────────────┘ └──────────────────────┘
│       8 columns              8 columns
│       (50%)                  (50%)

Mobile (xsmall: < 743px)
├─ 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
│  └──────────────────────────────────────────────┘
│              14 columns
│              (87.5%)

Usage:
<div class="row">
  <div class="xxlarge-6 small-8 xsmall-14 col">
    Content adapts to screen size
  </div>
</div>
```

---

## 7. ANIMATION TIMELINE EXAMPLE

```
ROLLING TITLE ANIMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Time:  0s      1s      2s      3s      4s      5s
       │       │       │       │       │       │
First: │ ▲ ─── │ ─── ▼ │       │       │       │
       │ Fade  │ Fade  │       │       │       │
       │  In   │  Out  │       │       │       │
       │       │       │       │       │       │
Last:  │       │       │ ▲ ─── │ ─── ▼ │       │
       │       │       │ Fade  │ Fade  │       │
       │       │       │  In   │  Out  │       │
       │       │       │       │       │       │
Loop:  └───────┴───────┴───────┴───────┴───────┘ → Repeat

Legend:
▲ = Slide up from bottom (y: 100% → 0%)
▼ = Slide down to top (y: 0% → -100%)
─ = Hold position
```

---

## 8. PAGE TRANSITION FLOW

```
CURTAIN TRANSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: CLOSE (0.6s)
┌─────────────────────────────────────┐
│                                     │ ← Top curtain slides down
├─────────────────────────────────────┤
│         CURRENT PAGE                │
├─────────────────────────────────────┤
│                                     │ ← Bottom curtain slides up
└─────────────────────────────────────┘

Step 2: LINE ANIMATION (0.4s)
┌─────────────────────────────────────┐
│█████████████████████████████████████│
├─────────────────────────────────────┤ ← Yellow line expands
│         CURRENT PAGE                │
├─────────────────────────────────────┤
│█████████████████████████████████████│
└─────────────────────────────────────┘

Step 3: ROUTE CHANGE
┌─────────────────────────────────────┐
│█████████████████████████████████████│
├─────────────────────────────────────┤
│          NEW PAGE LOADS             │
├─────────────────────────────────────┤
│█████████████████████████████████████│
└─────────────────────────────────────┘

Step 4: OPEN (0.6s)
┌─────────────────────────────────────┐
│                                     │ ← Top curtain slides up
├─────────────────────────────────────┤
│          NEW PAGE                   │
├─────────────────────────────────────┤
│                                     │ ← Bottom curtain slides down
└─────────────────────────────────────┘

Total Duration: ~1.6s
```

---

## 9. CMS CONTENT STRUCTURE

```
SANITY CMS SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Page Document
├── _id: "page-home"
├── _type: "page"
├── slug: "/"
├── name: "Homepage"
├── metadata
│   ├── title: "Phive - It's not just fitness"
│   ├── description: "..."
│   └── ogImage: { asset: {...} }
└── blocks: [
    ├── {
    │   _type: "homeHeader",
    │   _key: "abc123",
    │   slides: [
    │       { title: "...", subtitle: "...", cta: {...} }
    │   ]
    │   },
    ├── {
    │   _type: "phiveClubs",
    │   _key: "def456",
    │   title: "...",
    │   clubs: [...]
    │   },
    └── {
        _type: "footer",
        _key: "ghi789",
        socials: [...],
        links: [...]
        }
    ]

Rendering:
blocks.forEach(block => {
  <component :is="block._type" v-bind="block" />
})
```

---

## 10. PERFORMANCE OPTIMIZATION STRATEGY

```
LOADING SEQUENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. CRITICAL PATH (0-1s)
   ├─ HTML (inline critical CSS)
   ├─ Fonts (preloaded)
   └─ Above-fold content

2. PRIORITY RESOURCES (1-2s)
   ├─ Main JavaScript bundle
   ├─ CSS (non-critical)
   └─ Hero images (WebP)

3. DEFERRED RESOURCES (2-3s)
   ├─ Below-fold images (lazy)
   ├─ Animation libraries (GSAP)
   └─ Analytics scripts

4. BACKGROUND RESOURCES (3s+)
   ├─ Remaining images
   ├─ Videos
   └─ Audio files

Techniques:
├─ Code Splitting (by route)
├─ Dynamic Imports (heavy components)
├─ Lazy Loading (images, videos)
├─ Preloading (critical fonts)
├─ Prefetching (next page)
└─ Caching (service worker)
```

---

## 11. DEVELOPMENT WORKFLOW

```
DEVELOPMENT PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────┐
│  DESIGN      │ → Figma/Adobe XD
│  MOCKUPS     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  COMPONENT   │ → Identify reusable components
│  BREAKDOWN   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  BUILD       │ → Vue components
│  COMPONENTS  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  INTEGRATE   │ → PageBuilder
│  WITH CMS    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  ADD         │ → GSAP, Lenis
│  ANIMATIONS  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  OPTIMIZE    │ → Lighthouse, Bundle Analyzer
│  PERFORMANCE │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  DEPLOY      │ → Vercel/Netlify
│              │
└──────────────┘
```

---

## 12. TECH STACK LAYERS

```
TECHNOLOGY STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Vue 3 Components │ SCSS │ CSS Variables │ Utility Classes  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   FRAMEWORK LAYER                            │
│  Nuxt 3 │ Auto-imports │ File-based Routing │ SSR/SSG       │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   ANIMATION LAYER                            │
│  GSAP │ ScrollTrigger │ Lenis │ Three.js │ Rive             │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  Sanity CMS │ useFetch │ Composables │ State Management     │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                       │
│  Vercel │ CDN (DigitalOcean) │ Analytics │ Monitoring       │
└─────────────────────────────────────────────────────────────┘
```

---

**Created by:** Reverse Engineering Team  
**Date:** 05/02/2026  
**Purpose:** Visual documentation of Phive architecture
