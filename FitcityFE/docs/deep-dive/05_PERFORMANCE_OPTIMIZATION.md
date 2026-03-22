# ⚡ PERFORMANCE OPTIMIZATION - PHIVE.PT

> Phân tích chi tiết performance optimization strategies và best practices

---

## 📋 SUMMARY

**Target Metrics:**
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Total Bundle Size: < 500KB

**Key Strategies:**
1. Code Splitting & Lazy Loading
2. Image Optimization
3. Font Loading Strategy
4. Critical CSS
5. Caching Strategy
6. Bundle Optimization

---

## 🚀 QUICK WINS

```javascript
// 1. Lazy load images
<img loading="lazy" decoding="async">

// 2. Preload critical resources
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>

// 3. Defer non-critical JavaScript
<script defer src="analytics.js"></script>

// 4. Use WebP images
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="">
</picture>

// 5. Minimize main thread work
requestIdleCallback(() => {
  // Non-critical work
})
```

---

## 📦 CODE SPLITTING

### Route-based Splitting

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'gsap': ['gsap'],
            'sanity': ['@nuxtjs/sanity']
          }
        }
      }
    }
  }
})
```

### Component Lazy Loading

```vue
<script setup>
// Lazy load heavy components
const HeavyComponent = defineAsyncComponent(() =>
  import('~/components/HeavyComponent.vue')
)

// With loading state
const AsyncComponent = defineAsyncComponent({
  loader: () => import('~/components/AsyncComponent.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200,
  timeout: 3000
})
</script>
```

---

## 🖼️ IMAGE OPTIMIZATION

### Best Practices

```javascript
// 1. Use modern formats
const imageUrl = urlFor(image)
  .format('webp')
  .quality(80)
  .url()

// 2. Responsive images
const srcset = [400, 800, 1200, 1600]
  .map(w => `${getImageUrl(image, { width: w })} ${w}w`)
  .join(', ')

// 3. Lazy loading
<img loading="lazy" decoding="async">

// 4. Blur placeholder
const blurDataUrl = urlFor(image)
  .width(20)
  .quality(20)
  .blur(50)
  .url()
```

---

## 🔤 FONT OPTIMIZATION

### Font Loading Strategy

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/PPFormula.woff2" as="font" type="font/woff2" crossorigin>

<!-- Use font-display: swap -->
<style>
@font-face {
  font-family: 'PPFormula';
  src: url('/fonts/PPFormula.woff2') format('woff2');
  font-display: swap;
  font-weight: 400;
}
</style>
```

---

## 🎨 CRITICAL CSS

### Inline Critical CSS

```vue
<!-- app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
/* Critical CSS - inlined */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

.hero {
  min-height: 100vh;
  background: var(--color-yellow);
}
</style>
```

---

## 💾 CACHING STRATEGY

### Service Worker

```javascript
// sw.js
const CACHE_NAME = 'fitcity-v1'
const urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/fonts/main.woff2'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  )
})
```

---

## 📊 MONITORING

### Web Vitals

```javascript
// composables/useWebVitals.js
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'

export const useWebVitals = () => {
  onCLS(console.log)
  onFID(console.log)
  onLCP(console.log)
  onFCP(console.log)
  onTTFB(console.log)
}
```

---

**Created by:** Performance Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete
