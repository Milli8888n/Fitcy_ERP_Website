# 📋 PHIVE ANALYSIS - QUICK REFERENCE CARD

> Cheat sheet nhanh cho dự án FitCity

---

## 🎯 TECH STACK

```
Framework:  Nuxt 3 (Vue 3)
CMS:        Sanity.io / Strapi
Styling:    SCSS + CSS Variables
Animations: GSAP + Lenis
Grid:       16 columns
```

---

## 🎨 DESIGN TOKENS

### Colors
```css
--color-primary:   #FF6B35  /* Orange */
--color-secondary: #004E89  /* Blue */
--color-accent:    #F7B801  /* Yellow */
--color-dark:      #1A1A1A
--color-light:     #F5F5F5
```

### Typography
```css
--font-heading: 'Montserrat', sans-serif
--font-body:    'Inter', sans-serif

--font-size-h1: clamp(48px, 5vw, 96px)
--font-size-h2: clamp(36px, 4vw, 72px)
--font-size-h3: clamp(28px, 3vw, 48px)
```

### Spacing
```css
--space-xs:  0.25rem  /* 4px */
--space-sm:  0.5rem   /* 8px */
--space-md:  1rem     /* 16px */
--space-lg:  1.5rem   /* 24px */
--space-xl:  2rem     /* 32px */
--space-2xl: 3rem     /* 48px */
```

---

## 🧱 COMPONENT HIERARCHY

```
Primitives (Atoms)
├── Button
├── Input
└── Icon

Fragments (Molecules)
├── Card
├── Navigation
└── Form

Blocks (Organisms)
├── Hero
├── ClubsGrid
├── ClassesShowcase
└── Footer

Pages (Templates)
└── PageBuilder
```

---

## 📱 GRID SYSTEM

```html
<!-- 16-column grid -->
<div class="row">
  <div class="xxlarge-6 small-8 xsmall-14 col">
    <!-- 6/16 desktop, 8/16 tablet, 14/16 mobile -->
  </div>
</div>
```

### Breakpoints
```
xxsmall:  < 410px
xsmall:   < 743px
small:    < 1023px
medium:   < 1290px
large:    < 1440px
xlarge:   < 1700px
xxlarge:  > 2000px
```

---

## 🎬 ANIMATIONS

### Scroll Animations
```javascript
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.from('.element', {
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
    end: 'top 20%',
    scrub: true
  },
  opacity: 0,
  y: 50
})
```

### Smooth Scroll
```javascript
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
```

---

## 🔧 ESSENTIAL COMPOSABLES

### useScroller
```javascript
export const useScroller = () => {
  const lenis = ref(null)
  
  onMounted(() => {
    lenis.value = new Lenis({ /* config */ })
    // RAF loop
  })
  
  return { lenis, scrollTo, stop, start }
}
```

### useSectionIntersect
```javascript
export const useSectionIntersect = () => {
  const currentTheme = ref('light')
  
  onMounted(() => {
    const observer = new IntersectionObserver(/* ... */)
    // Observe sections
  })
  
  return { currentTheme }
}
```

---

## 📦 PROJECT STRUCTURE

```
fitcity/
├── assets/
│   ├── css/
│   │   ├── main.scss
│   │   └── design-system.css
│   └── fonts/
├── components/
│   ├── core/       # Scroller, Grid, Page
│   ├── blocks/     # Hero, Clubs, Classes
│   ├── fragments/  # Bar, Menu
│   └── primitives/ # Button, Input
├── composables/
│   ├── useScroller.js
│   └── useSectionIntersect.js
├── layouts/
│   └── default.vue
├── pages/
│   ├── index.vue
│   └── [...path].vue
└── nuxt.config.ts
```

---

## ⚡ QUICK COMMANDS

### Setup
```bash
npx nuxi@latest init fitcity
cd fitcity
npm install
npm install -D sass
npm install gsap @studio-freight/lenis
```

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
```bash
npx vercel --prod    # Deploy to Vercel
npx netlify deploy   # Deploy to Netlify
```

---

## 🎯 MVP CHECKLIST (4 weeks)

### Week 1: Setup
- [ ] Initialize Nuxt project
- [ ] Install dependencies
- [ ] Setup design system
- [ ] Configure fonts

### Week 2: Core
- [ ] Layout components
- [ ] Navigation
- [ ] Button component
- [ ] Grid system

### Week 3: Pages
- [ ] Homepage hero
- [ ] Features section
- [ ] Clubs grid
- [ ] Footer

### Week 4: Polish
- [ ] Animations
- [ ] Responsive design
- [ ] SEO meta tags
- [ ] Deploy

---

## 🚨 COMMON ISSUES

### Lenis not working
```javascript
// Client-side only
if (process.client) {
  const Lenis = (await import('@studio-freight/lenis')).default
}
```

### GSAP not triggering
```javascript
// Register plugin
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

### Fonts not loading
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Important! */
}
```

---

## 📊 PERFORMANCE TARGETS

```
Lighthouse Scores:
- Performance:    > 90
- Accessibility:  > 95
- Best Practices: > 95
- SEO:            > 95

Load Times:
- First Paint:    < 1s
- Interactive:    < 2s
- Full Load:      < 3s
```

---

## 🎨 BUTTON VARIANTS

```vue
<!-- Primary -->
<Button variant="primary" size="lg">
  Join Now
</Button>

<!-- Secondary -->
<Button variant="secondary" size="md">
  Learn More
</Button>

<!-- Outline -->
<Button variant="outline" size="sm">
  Details
</Button>
```

---

## 📱 RESPONSIVE IMAGES

```vue
<picture>
  <source 
    media="(min-width: 1440px)" 
    srcset="/images/hero-desktop.jpg"
  />
  <source 
    media="(min-width: 768px)" 
    srcset="/images/hero-tablet.jpg"
  />
  <img 
    src="/images/hero-mobile.jpg" 
    alt="Hero"
    loading="lazy"
    decoding="async"
  />
</picture>
```

---

## 🔐 SEO ESSENTIALS

```vue
<script setup>
useHead({
  title: 'FitCity - Premium Fitness',
  meta: [
    { name: 'description', content: '...' },
    { property: 'og:title', content: '...' },
    { property: 'og:image', content: '...' }
  ]
})
</script>
```

---

## 💡 BEST PRACTICES

### DO ✅
- Use semantic HTML
- Lazy load images
- Preload critical fonts
- Mobile-first design
- Test on real devices

### DON'T ❌
- Inline large images
- Block main thread
- Ignore accessibility
- Skip responsive testing
- Forget SEO meta tags

---

## 📚 DOCUMENTATION FILES

1. **README.md** - Overview & quick start
2. **ROADMAP.md** - 12-week plan
3. **PHIVE_ANALYSIS.md** - Architecture deep dive
4. **COMPONENTS_REFERENCE.md** - Code examples
5. **design-system.css** - CSS variables
6. **QUICK_REFERENCE.md** - This file

---

## 🎓 LEARNING ORDER

```
1. Read README.md          (15 min)
2. Skim ROADMAP.md         (10 min)
3. Setup project           (30 min)
4. Copy design-system.css  (5 min)
5. Build first component   (1 hour)
6. Reference as needed     (ongoing)
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Build succeeds
- [ ] No console errors
- [ ] Images optimized
- [ ] Fonts loaded
- [ ] Meta tags set
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Analytics added
- [ ] Performance tested
- [ ] Mobile tested

---

## 📞 QUICK LINKS

- [Nuxt Docs](https://nuxt.com)
- [Vue Docs](https://vuejs.org)
- [GSAP Docs](https://greensock.com/docs)
- [Lenis GitHub](https://github.com/studio-freight/lenis)
- [Strapi Docs](https://docs.strapi.io)

---

**Print this for quick reference!** 🖨️

**Last updated:** 05/02/2026
