# 🚀 FITCITY DEVELOPMENT ROADMAP

> Lộ trình xây dựng website FitCity dựa trên phân tích từ Phive.pt

**Ngày tạo:** 05/02/2026  
**Mục tiêu:** Xây dựng website fitness club premium với Nuxt 3

---

## 📚 TÀI LIỆU THAM KHẢO ĐÃ TẠO

1. **PHIVE_ANALYSIS.md** - Phân tích chi tiết kiến trúc (700+ dòng)
2. **COMPONENTS_REFERENCE.md** - Code examples cho từng component
3. **design-system.css** - CSS variables và design tokens
4. **README.md** - File này (roadmap)

---

## 🎯 PHASE 1: PROJECT SETUP (Tuần 1)

### 1.1 Initialize Nuxt 3 Project
```bash
# Create project
npx nuxi@latest init fitcity
cd fitcity

# Install dependencies
npm install

# Install additional packages
npm install -D sass
npm install gsap @studio-freight/lenis
npm install @nuxtjs/strapi
npm install @vueuse/core
```

### 1.2 Project Structure
```
fitcity/
├── assets/
│   ├── css/
│   │   ├── main.scss
│   │   ├── design-system.css
│   │   └── utilities.scss
│   ├── fonts/
│   └── images/
├── components/
│   ├── core/          # Scroller, Grid, Page
│   ├── blocks/        # HomeHeader, ClubsGrid, etc.
│   ├── fragments/     # Bar, MenuGrid
│   ├── primitives/    # Button, Input
│   └── ui/            # Reusable UI components
├── composables/
│   ├── useScroller.js
│   ├── useSectionIntersect.js
│   └── useAudioController.js
├── layouts/
│   └── default.vue
├── pages/
│   ├── index.vue
│   ├── clubs/
│   ├── classes/
│   └── [...path].vue
├── public/
│   ├── fonts/
│   ├── images/
│   └── audio/
└── nuxt.config.ts
```

### 1.3 Configure Nuxt
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/strapi'
  ],
  
  css: [
    '~/assets/css/main.scss',
    '~/assets/css/design-system.css'
  ],
  
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/utilities.scss" as *;'
        }
      }
    }
  },
  
  app: {
    head: {
      title: 'FitCity - Premium Fitness Club',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Premium fitness club experience' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
```

**Deliverables:**
- ✅ Project initialized
- ✅ Dependencies installed
- ✅ Folder structure created
- ✅ Basic configuration done

---

## 🎨 PHASE 2: DESIGN SYSTEM (Tuần 2)

### 2.1 Setup Fonts
```bash
# Download fonts (hoặc sử dụng Google Fonts)
# Phive uses: PPFormula, AcidGrotesk, PureHeart
# FitCity có thể dùng: Inter, Montserrat, Bebas Neue
```

```css
/* assets/css/fonts.css */
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/Montserrat-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

### 2.2 Define Color Palette
```css
/* assets/css/design-system.css */
:root {
  /* FitCity Brand Colors */
  --color-primary: #FF6B35;      /* Orange - Energy */
  --color-secondary: #004E89;    /* Blue - Trust */
  --color-accent: #F7B801;       /* Yellow - Motivation */
  
  /* Neutrals */
  --color-dark: #1A1A1A;
  --color-light: #F5F5F5;
  --color-white: #FFFFFF;
  
  /* Semantic Colors */
  --color-success: #00C896;
  --color-warning: #FFB800;
  --color-error: #FF4757;
  
  /* Apply to components */
  --button-primary-bg: var(--color-primary);
  --button-primary-text: var(--color-white);
}
```

### 2.3 Typography Scale
```css
/* Copy từ design-system.css và customize */
:root {
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Fluid typography */
  --font-size-h1: clamp(48px, 5vw, 96px);
  --font-size-h2: clamp(36px, 4vw, 72px);
  --font-size-h3: clamp(28px, 3vw, 48px);
  --font-size-body: clamp(16px, 1.5vw, 18px);
}
```

### 2.4 Create Utility Classes
```scss
// assets/css/utilities.scss
@mixin fluid-type($min, $max, $min-vw: 320px, $max-vw: 1920px) {
  font-size: clamp($min, calc($min + ($max - $min) * ((100vw - $min-vw) / ($max-vw - $min-vw))), $max);
}

.text-h1 { @include fluid-type(48px, 96px); }
.text-h2 { @include fluid-type(36px, 72px); }

// Spacing utilities
.mt-1 { margin-top: var(--space-sm); }
.mt-2 { margin-top: var(--space-md); }
// ... etc
```

**Deliverables:**
- ✅ Fonts loaded
- ✅ Color palette defined
- ✅ Typography system ready
- ✅ Utility classes created

---

## 🧱 PHASE 3: CORE COMPONENTS (Tuần 3-4)

### 3.1 Layout Components

#### Default Layout
```vue
<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <Scroller ref="scroller">
      <Bar />
      <slot />
      <Footer />
    </Scroller>
    
    <MenuGrid />
    <Grid />
  </div>
</template>

<script setup>
import { useSectionIntersect } from '~/composables/useSectionIntersect'

useSectionIntersect()
</script>
```

#### Scroller Component
```vue
<!-- components/core/Scroller.vue -->
<template>
  <div ref="scrollerRef" class="scroller">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScroller } from '~/composables/useScroller'

const scrollerRef = ref(null)
const { lenis } = useScroller()

provide('$scroller', scrollerRef)
</script>
```

### 3.2 Primitive Components

#### Button Component
```vue
<!-- components/primitives/Button.vue -->
<template>
  <button 
    :class="['btn', variant, size]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="btn-bg"></span>
    <span class="btn-label">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  label: String,
  disabled: Boolean
})

defineEmits(['click'])
</script>

<style scoped lang="scss">
.btn {
  position: relative;
  border-radius: var(--border-radius-full);
  padding: 1rem 2rem;
  font-weight: 600;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &.primary {
    background: var(--color-primary);
    color: white;
  }
  
  &.secondary {
    background: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
  }
}
</style>
```

### 3.3 Navigation Components

#### Bar (Top Navigation)
```vue
<!-- components/fragments/Bar.vue -->
<template>
  <nav class="bar">
    <div class="bar-left">
      <button class="burger" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    
    <div class="bar-center">
      <NuxtLink to="/">
        <img src="/logo.svg" alt="FitCity" />
      </NuxtLink>
    </div>
    
    <div class="bar-right">
      <NuxtLink to="/join" class="btn-join">
        Join Now
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const toggleMenu = () => {
  // Emit event to MenuGrid
}
</script>
```

**Deliverables:**
- ✅ Layout structure
- ✅ Scroller with Lenis
- ✅ Button component
- ✅ Navigation bar
- ✅ Menu grid

---

## 📄 PHASE 4: PAGE BLOCKS (Tuần 5-6)

### 4.1 Homepage Blocks

#### Hero Section
```vue
<!-- components/blocks/HomeHero.vue -->
<template>
  <section class="home-hero">
    <div class="hero-content">
      <h1 class="-title-1">
        Transform Your Body,<br>
        Elevate Your Life
      </h1>
      <p class="-subhead-1">
        Join FitCity and experience premium fitness
      </p>
      <div class="hero-ctas">
        <Button variant="primary" size="lg">
          Start Free Trial
        </Button>
        <Button variant="secondary" size="lg">
          Explore Clubs
        </Button>
      </div>
    </div>
    
    <div class="hero-media">
      <video autoplay loop muted playsinline>
        <source src="/videos/hero.mp4" type="video/mp4">
      </video>
    </div>
  </section>
</template>
```

#### Clubs Grid
```vue
<!-- components/blocks/ClubsGrid.vue -->
<template>
  <section class="clubs-grid" data-section-intersect="light">
    <div class="row">
      <div class="xxlarge-16 col">
        <h2 class="-title-2 -text-center">Our Clubs</h2>
      </div>
    </div>
    
    <div class="clubs-list">
      <ClubCard
        v-for="club in clubs"
        :key="club.id"
        :club="club"
      />
    </div>
  </section>
</template>

<script setup>
const clubs = [
  {
    id: 1,
    name: 'FitCity Downtown',
    location: 'City Center',
    image: '/clubs/downtown.jpg',
    features: ['Pool', 'Sauna', 'Classes']
  },
  // ... more clubs
]
</script>
```

### 4.2 Classes Section
```vue
<!-- components/blocks/ClassesShowcase.vue -->
<template>
  <section class="classes-showcase" data-section-intersect="dark">
    <h2 class="-title-2">Our Classes</h2>
    
    <div class="classes-grid">
      <ClassCard
        v-for="classItem in classes"
        :key="classItem.id"
        :data="classItem"
      />
    </div>
  </section>
</template>
```

**Deliverables:**
- ✅ Hero section
- ✅ Clubs grid
- ✅ Classes showcase
- ✅ Features section
- ✅ CTA sections

---

## 🎬 PHASE 5: ANIMATIONS (Tuần 7)

### 5.1 Scroll Animations
```javascript
// composables/useSectionIntersect.js
import { ref, onMounted, onUnmounted } from 'vue'

export const useSectionIntersect = () => {
  const currentTheme = ref('light')
  
  onMounted(() => {
    const sections = document.querySelectorAll('[data-section-intersect]')
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const theme = entry.target.dataset.sectionIntersect
          currentTheme.value = theme
          document.documentElement.setAttribute('data-theme', theme)
        }
      })
    }, { threshold: 0.5 })
    
    sections.forEach(section => observer.observe(section))
    
    onUnmounted(() => observer.disconnect())
  })
  
  return { currentTheme }
}
```

### 5.2 GSAP Animations
```javascript
// composables/useGSAP.js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useGSAP = () => {
  const fadeIn = (element, options = {}) => {
    return gsap.from(element, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      ...options
    })
  }
  
  const staggerFadeIn = (elements, options = {}) => {
    return gsap.from(elements, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      ...options
    })
  }
  
  return {
    fadeIn,
    staggerFadeIn,
    gsap,
    ScrollTrigger
  }
}
```

**Deliverables:**
- ✅ Scroll-based theme switching
- ✅ Fade-in animations
- ✅ Stagger animations
- ✅ Smooth scrolling

---

## 📱 PHASE 6: RESPONSIVE DESIGN (Tuần 8)

### 6.1 Mobile Navigation
```vue
<!-- components/fragments/MobileMenu.vue -->
<template>
  <div class="mobile-menu" :class="{ open: isOpen }">
    <nav>
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <NuxtLink :to="item.path" @click="close">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
```

### 6.2 Responsive Images
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
  />
</picture>
```

**Deliverables:**
- ✅ Mobile menu
- ✅ Responsive images
- ✅ Touch gestures
- ✅ Mobile-optimized layouts

---

## 🗄️ PHASE 7: CMS INTEGRATION (Tuần 9-10)

### 7.1 Setup Strapi
```bash
# Install Strapi
npx create-strapi-app@latest fitcity-cms

# Start Strapi
cd fitcity-cms
npm run develop
```

### 7.2 Create Content Types
```
Content Types:
- Club
  - name (Text)
  - slug (UID)
  - description (Rich Text)
  - location (Text)
  - features (Relation to Feature)
  - images (Media)
  
- Class
  - name (Text)
  - slug (UID)
  - description (Rich Text)
  - instructor (Relation to Instructor)
  - duration (Number)
  - intensity (Enumeration)
  - image (Media)
  
- Page
  - title (Text)
  - slug (UID)
  - blocks (Dynamic Zone)
  - metadata (Component)
```

### 7.3 Fetch Data in Nuxt
```vue
<!-- pages/clubs/[slug].vue -->
<script setup>
const route = useRoute()
const { data: club } = await useFetch(`/api/clubs/${route.params.slug}`)
</script>

<template>
  <div v-if="club">
    <h1>{{ club.name }}</h1>
    <p>{{ club.description }}</p>
  </div>
</template>
```

**Deliverables:**
- ✅ Strapi setup
- ✅ Content types created
- ✅ API integration
- ✅ Dynamic pages

---

## 🚀 PHASE 8: OPTIMIZATION & DEPLOYMENT (Tuần 11-12)

### 8.1 Performance Optimization
```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  // Image optimization
  image: {
    formats: ['webp', 'avif'],
    quality: 80
  },
  
  // Build optimization
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap'],
            'lenis': ['@studio-freight/lenis']
          }
        }
      }
    }
  },
  
  // Nitro prerendering
  nitro: {
    prerender: {
      routes: ['/', '/clubs', '/classes']
    }
  }
})
```

### 8.2 SEO Optimization
```vue
<!-- pages/index.vue -->
<script setup>
useHead({
  title: 'FitCity - Premium Fitness Club',
  meta: [
    { 
      name: 'description', 
      content: 'Transform your body at FitCity premium fitness clubs' 
    },
    { property: 'og:title', content: 'FitCity' },
    { property: 'og:image', content: '/og-image.jpg' }
  ]
})
</script>
```

### 8.3 Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
npx netlify deploy --prod
```

**Deliverables:**
- ✅ Images optimized
- ✅ Code splitting
- ✅ SEO meta tags
- ✅ Production deployment

---

## ✅ FINAL CHECKLIST

### Functionality
- [ ] Homepage with hero section
- [ ] Clubs listing and detail pages
- [ ] Classes listing and detail pages
- [ ] Contact form
- [ ] Membership plans
- [ ] Timetable/Schedule
- [ ] Blog (optional)

### Performance
- [ ] Lighthouse score > 90
- [ ] Images lazy loaded
- [ ] Fonts optimized
- [ ] Code split
- [ ] Prerendering enabled

### SEO
- [ ] Meta tags on all pages
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Structured data added
- [ ] Open Graph images

### Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Alt text on images
- [ ] Color contrast ratios

### Responsive
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Touch gestures
- [ ] Mobile menu

---

## 📊 TIMELINE SUMMARY

| Phase | Duration | Tasks |
|-------|----------|-------|
| 1. Setup | 1 week | Project init, dependencies |
| 2. Design System | 1 week | Fonts, colors, typography |
| 3. Core Components | 2 weeks | Layout, primitives, navigation |
| 4. Page Blocks | 2 weeks | Hero, clubs, classes sections |
| 5. Animations | 1 week | GSAP, scroll effects |
| 6. Responsive | 1 week | Mobile optimization |
| 7. CMS | 2 weeks | Strapi setup, integration |
| 8. Optimization | 2 weeks | Performance, SEO, deployment |
| **TOTAL** | **12 weeks** | **~3 months** |

---

## 🎓 LEARNING RESOURCES

### Official Docs
- [Nuxt 3](https://nuxt.com)
- [Vue 3](https://vuejs.org)
- [GSAP](https://greensock.com/docs)
- [Lenis](https://github.com/studio-freight/lenis)
- [Strapi](https://docs.strapi.io)

### Video Tutorials
- [Nuxt 3 Crash Course](https://www.youtube.com/watch?v=dCxSsr5xuL8)
- [GSAP ScrollTrigger](https://www.youtube.com/watch?v=X7IBa7vZjmo)
- [Strapi + Nuxt](https://www.youtube.com/watch?v=g7Jg9vFwHvA)

### Design Inspiration
- [Awwwards - Fitness](https://www.awwwards.com/websites/fitness/)
- [Dribbble - Gym Website](https://dribbble.com/tags/gym-website)

---

## 💡 PRO TIPS

1. **Start Small**: Build MVP first, then add features
2. **Component Library**: Create reusable components from day 1
3. **Git Workflow**: Commit often, use branches
4. **Testing**: Test on real devices, not just browser DevTools
5. **Performance**: Monitor with Lighthouse regularly
6. **Documentation**: Document your components as you build
7. **Feedback**: Get user feedback early and often

---

## 🆘 TROUBLESHOOTING

### Common Issues

**Issue: Lenis not working**
```javascript
// Make sure to import in client-side only
if (process.client) {
  const Lenis = (await import('@studio-freight/lenis')).default
  // ... initialize
}
```

**Issue: GSAP animations not triggering**
```javascript
// Register ScrollTrigger plugin
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

**Issue: Fonts not loading**
```css
/* Use font-display: swap */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Important! */
}
```

---

## 📞 NEXT STEPS

**Bước tiếp theo:**

1. **Review tài liệu** - Đọc kỹ 3 files đã tạo
2. **Setup project** - Chạy `npx nuxi@latest init fitcity`
3. **Copy design system** - Import `design-system.css`
4. **Build first component** - Bắt đầu với Button
5. **Test và iterate** - Build, test, improve

**Câu hỏi?** Hỏi tôi bất cứ lúc nào! 🚀

---

**Created by:** Antigravity AI  
**Date:** 05/02/2026  
**Version:** 1.0
