# REVERSE ENGINEERING MASTER PLAN - PHIVE.PT

> Chiến lược của một đội ngũ Reverse Engineering chuyên nghiệp

---

## 🎯 OBJECTIVES

**Primary Goals:**
1. ✅ Understand architecture & design patterns
2. ✅ Extract reusable components structure
3. ✅ Identify tech stack & dependencies
4. ✅ Document best practices
5. ✅ Create implementation blueprint for FitCity

**NOT Goals:**
- ❌ Copy source code
- ❌ Steal intellectual property
- ❌ Clone the exact website
- ❌ Use their assets

---

## 📊 METHODOLOGY: 5-PHASE APPROACH

### PHASE 1: RECONNAISSANCE (Week 1)
**Goal:** Gather all available information

#### 1.1 Static Analysis
```powershell
# Run extraction script
.\01_extract_assets.ps1
```

**Deliverables:**
- [ ] `extracted-styles.css` - All CSS code
- [ ] `components-list.md` - Component inventory
- [ ] `resources-list.md` - External dependencies
- [ ] `css-variables.md` - Design tokens

#### 1.2 Network Analysis
```bash
# Analyze network requests (if we had live access)
# - API endpoints
# - CDN resources
# - Third-party services
```

**Findings:**
- CMS: Sanity.io (projectId: z6ex5ahr)
- CDN: DigitalOcean Spaces
- Analytics: Google Analytics, Hotjar, TikTok Pixel
- Fonts: Custom fonts (PPFormula, AcidGrotesk)

#### 1.3 Technology Stack Detection
```javascript
// From HTML analysis
{
  "framework": "Nuxt 3",
  "buildId": "5768c293-f361-4615-bfdb-1346ab5b2813",
  "cms": "Sanity",
  "libraries": [
    "GSAP",
    "Three.js", 
    "Lenis",
    "Rive"
  ]
}
```

---

### PHASE 2: DECOMPOSITION (Week 2)
**Goal:** Break down into understandable pieces

#### 2.1 Component Mapping
```
Create component tree:
App
├── Scroller (Lenis wrapper)
├── Grid (Debug overlay)
├── MenuGrid (Navigation)
├── ModalDrawer (Modals)
├── PreLoader (Loading screen)
├── Curtain (Page transitions)
└── NuxtPage
    └── PageBuilder
        ├── HomeHeader
        ├── PhiveClubs
        ├── ClassesShowcase
        ├── PhiveApp
        └── Footer
```

**Script to generate:**
```powershell
# 02_map_components.ps1
# Parse HTML and create component hierarchy
```

#### 2.2 Data Flow Analysis
```
User Request
    ↓
Nuxt Router (pages/[...path].vue)
    ↓
Fetch from CMS (/cms/page?path=X&lang=Y)
    ↓
PageBuilder renders blocks
    ↓
Each block = Vue component
```

#### 2.3 State Management
```javascript
// Identified patterns:
- provide/inject for scroller
- useFetch for data
- useState for reactive state
- No Vuex/Pinia (using Nuxt built-ins)
```

---

### PHASE 3: PATTERN EXTRACTION (Week 3)
**Goal:** Identify reusable patterns

#### 3.1 Design Patterns

**1. PageBuilder Pattern**
```vue
<template>
  <component 
    v-for="block in blocks"
    :is="getComponent(block._type)"
    v-bind="block"
  />
</template>
```

**2. Provide/Inject Pattern**
```javascript
// Parent
provide('$scroller', scrollerRef)

// Child (anywhere)
const scroller = inject('$scroller')
```

**3. Intersection Observer Pattern**
```javascript
// Theme switching based on scroll position
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      updateTheme(entry.target.dataset.sectionIntersect)
    }
  })
})
```

**4. Ribbon Animation Pattern**
```html
<!-- Infinite scroll text -->
<div class="ribbon">
  <div class="inner" style="animation: scroll 10s linear infinite">
    <div>Content</div>
    <div>Content</div> <!-- Duplicate -->
    <div>Content</div> <!-- Duplicate -->
  </div>
</div>
```

#### 3.2 Animation Patterns

**GSAP Timeline Pattern:**
```javascript
const tl = gsap.timeline()
tl.from('.element', { opacity: 0, y: 50 })
  .to('.element', { scale: 1.1 }, '-=0.5') // Overlap
```

**Scroll-Triggered Pattern:**
```javascript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top 80%',
  onEnter: () => animate()
})
```

#### 3.3 Styling Patterns

**BEM-like Convention:**
```css
[data-component="button"] { }
[data-component="button"][data-type="primary"] { }
[data-component="button"][data-disabled="true"] { }
```

**Utility Classes:**
```css
.-title-1 { /* Large heading */ }
.-uppercase { text-transform: uppercase; }
.-text-center { text-align: center; }
```

---

### PHASE 4: RECONSTRUCTION (Week 4-6)
**Goal:** Build clean implementation

#### 4.1 Create Component Library

**Priority 1: Primitives**
```
✓ Button (with variants)
✓ Input
✓ Card
✓ Icon
```

**Priority 2: Fragments**
```
✓ Navigation
✓ Footer
✓ Form
✓ Modal
```

**Priority 3: Blocks**
```
✓ Hero
✓ Features
✓ Grid sections
✓ CTA sections
```

#### 4.2 Implement Core Systems

**Scroller System:**
```javascript
// composables/useScroller.js
import Lenis from '@studio-freight/lenis'

export const useScroller = () => {
  const lenis = ref(null)
  
  onMounted(() => {
    lenis.value = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })
    
    function raf(time) {
      lenis.value.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  })
  
  return { lenis }
}
```

**Theme System:**
```javascript
// composables/useSectionIntersect.js
export const useSectionIntersect = () => {
  const currentTheme = ref('light')
  
  onMounted(() => {
    const sections = document.querySelectorAll('[data-section-intersect]')
    const observer = new IntersectionObserver(/* ... */)
    sections.forEach(s => observer.observe(s))
  })
  
  return { currentTheme }
}
```

#### 4.3 Build Design System

**Step 1: Define Tokens**
```css
:root {
  /* Colors - FitCity brand */
  --color-primary: #FF6B35;
  --color-secondary: #004E89;
  
  /* Typography */
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Spacing */
  --space-unit: 8px;
  --space-sm: calc(var(--space-unit) * 1);
  --space-md: calc(var(--space-unit) * 2);
}
```

**Step 2: Create Utilities**
```scss
// Generate utility classes
@each $size in (sm, md, lg, xl) {
  .mt-#{$size} { margin-top: var(--space-#{$size}); }
  .mb-#{$size} { margin-bottom: var(--space-#{$size}); }
}
```

---

### PHASE 5: OPTIMIZATION (Week 7-8)
**Goal:** Refine and optimize

#### 5.1 Performance Optimization

**Image Optimization:**
```vue
<picture>
  <source 
    type="image/webp"
    srcset="/images/hero.webp"
  />
  <img 
    src="/images/hero.jpg"
    loading="lazy"
    decoding="async"
  />
</picture>
```

**Code Splitting:**
```javascript
// Lazy load heavy components
const ThreeScene = defineAsyncComponent(() =>
  import('~/components/ThreeScene.vue')
)
```

**Font Loading:**
```html
<link 
  rel="preload" 
  as="font" 
  href="/fonts/font.woff2"
  type="font/woff2"
  crossorigin
/>
```

#### 5.2 Accessibility Audit

**Checklist:**
- [ ] Semantic HTML
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Color contrast (WCAG AA)
- [ ] Screen reader testing

#### 5.3 SEO Optimization

**Meta Tags:**
```vue
useHead({
  title: 'FitCity - Premium Fitness',
  meta: [
    { name: 'description', content: '...' },
    { property: 'og:image', content: '...' }
  ]
})
```

**Structured Data:**
```json
{
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "FitCity",
  "url": "https://fitcity.com"
}
```

---

## 🛠️ TOOLS & SCRIPTS

### Automated Analysis Tools

**1. Component Extractor**
```powershell
# 01_extract_assets.ps1
# Extracts CSS, components, resources
```

**2. Component Mapper**
```powershell
# 02_map_components.ps1
# Creates component hierarchy
```

**3. Animation Analyzer**
```javascript
// 03_analyze_animations.js
// Identifies animation patterns
```

**4. Performance Profiler**
```javascript
// 04_profile_performance.js
// Measures load times, bundle sizes
```

---

## 📋 DELIVERABLES

### Documentation
- [x] Architecture Overview
- [x] Component Library
- [x] Design System
- [x] Animation Patterns
- [x] Best Practices Guide

### Code
- [ ] Nuxt 3 Project Template
- [ ] Component Storybook
- [ ] Design System Package
- [ ] Utility Functions Library

### Assets
- [ ] Design Tokens (JSON)
- [ ] Icon Library
- [ ] Typography Scale
- [ ] Color Palette

---

## 🔍 DETAILED ANALYSIS FINDINGS

### 1. Component Architecture

**Atomic Design Implementation:**
```
Atoms (Primitives):
- Button (5 variants)
- Input (3 types)
- Icon (Rive-based)
- CircleBtn
- Burger

Molecules (Fragments):
- Card
- Navigation Item
- Form Field
- Social Link

Organisms (Blocks):
- Header (3 variants)
- Hero Section
- Grid Section
- Footer

Templates (Pages):
- Homepage
- Club Page
- Class Page
- Dynamic Page
```

### 2. Animation System

**GSAP Usage:**
```javascript
// Identified patterns:
1. ScrollTrigger for scroll-based animations
2. Timeline for sequenced animations
3. Custom easing functions
4. Stagger for list animations
```

**Lenis Configuration:**
```javascript
{
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
  smoothTouch: false
}
```

### 3. Data Architecture

**CMS Structure (Sanity):**
```javascript
{
  page: {
    slug: String,
    name: String,
    metadata: {
      title: String,
      description: String,
      ogImage: Image
    },
    blocks: [
      {
        _type: 'homeHeader',
        _key: String,
        // ... block-specific fields
      }
    ]
  }
}
```

### 4. Routing Strategy

**Dynamic Routing:**
```
/                    → pages/index.vue (or [...path].vue)
/en                  → pages/[...path].vue
/clubs               → pages/[...path].vue
/clubs/lisbon        → pages/[...path].vue
/classes             → pages/[...path].vue
```

**Pre-validated Paths:**
```javascript
// Runtime config includes all valid paths
paths: ["/", "/en", "/clubs", "/clubs/lisbon", ...]

// 404 if path not in list
if (!paths.includes(route.path)) {
  throw showError({ statusCode: 404 })
}
```

---

## 🎓 KEY LEARNINGS

### What Worked Well

1. **Component-Driven Architecture**
   - Easy to maintain
   - Highly reusable
   - Scalable

2. **CMS-Driven Content**
   - Non-technical content updates
   - Flexible page building
   - Version control

3. **Animation-Rich UX**
   - Premium feel
   - Engaging experience
   - Smooth interactions

4. **Performance Focus**
   - Fast load times
   - Optimized assets
   - Code splitting

### What to Improve

1. **Accessibility**
   - Some missing ARIA labels
   - Keyboard navigation could be better
   - Color contrast in some areas

2. **Mobile Experience**
   - Some animations too heavy on mobile
   - Touch gestures could be smoother

3. **SEO**
   - Could have more structured data
   - Some meta tags missing

---

## 🚀 IMPLEMENTATION ROADMAP FOR FITCITY

### Week 1-2: Foundation
```
✓ Setup Nuxt 3 project
✓ Install dependencies (GSAP, Lenis)
✓ Create design system
✓ Setup component structure
```

### Week 3-4: Core Components
```
✓ Build primitive components
✓ Implement scroller system
✓ Create navigation
✓ Build layout components
```

### Week 5-6: Page Blocks
```
✓ Hero section
✓ Features grid
✓ Clubs showcase
✓ Classes section
✓ Footer
```

### Week 7-8: Polish
```
✓ Add animations
✓ Optimize performance
✓ Accessibility audit
✓ SEO optimization
✓ Deploy
```

---

## 🔐 ETHICAL CONSIDERATIONS

### What We CAN Do:
✅ Analyze publicly available code
✅ Learn from design patterns
✅ Understand architecture
✅ Extract concepts and ideas
✅ Create our own implementation

### What We CANNOT Do:
❌ Copy source code directly
❌ Use their assets (images, fonts)
❌ Clone exact designs
❌ Violate copyright
❌ Steal intellectual property

### Legal Framework:
- **Fair Use**: Educational analysis ✅
- **Reverse Engineering**: For interoperability ✅
- **Clean Room**: Independent implementation ✅
- **Copyright**: Respect original work ✅

---

## 📊 METRICS & KPIs

### Success Criteria

**Technical:**
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Lighthouse SEO > 95
- [ ] Bundle size < 500KB
- [ ] First Paint < 1s

**Functional:**
- [ ] All components working
- [ ] Animations smooth (60fps)
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] CMS integrated

**Business:**
- [ ] Matches FitCity brand
- [ ] Better than competitors
- [ ] Easy to maintain
- [ ] Scalable architecture

---

## 🛡️ RISK MITIGATION

### Potential Risks

**1. Legal Issues**
- **Risk**: Copyright infringement
- **Mitigation**: Clean room implementation, original designs

**2. Technical Debt**
- **Risk**: Over-engineering
- **Mitigation**: Start simple, iterate

**3. Performance**
- **Risk**: Heavy animations slow site
- **Mitigation**: Progressive enhancement, lazy loading

**4. Maintenance**
- **Risk**: Complex codebase hard to maintain
- **Mitigation**: Good documentation, simple patterns

---

## 📞 NEXT ACTIONS

### Immediate (Today)
1. [x] Run `01_extract_assets.ps1`
2. [ ] Review extracted components
3. [ ] Analyze CSS patterns
4. [ ] Document findings

### Short-term (This Week)
1. [ ] Create component map
2. [ ] Build design system
3. [ ] Setup Nuxt project
4. [ ] Implement first component

### Long-term (This Month)
1. [ ] Complete core components
2. [ ] Build homepage
3. [ ] Integrate CMS
4. [ ] Deploy MVP

---

## 📚 REFERENCES

### Tools Used
- PowerShell (Asset extraction)
- VS Code (Code analysis)
- Chrome DevTools (Network analysis)
- Lighthouse (Performance)

### Documentation Created
- PHIVE_ANALYSIS.md
- COMPONENTS_REFERENCE.md
- design-system.css
- ROADMAP.md
- This file (REVERSE_ENGINEERING.md)

---

**Created by:** Reverse Engineering Team  
**Date:** 05/02/2026  
**Status:** Phase 1 Complete ✅  
**Next Phase:** Component Mapping
