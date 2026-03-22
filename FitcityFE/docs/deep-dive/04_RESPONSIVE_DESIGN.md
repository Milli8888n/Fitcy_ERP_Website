# 📱 RESPONSIVE DESIGN PATTERNS - PHIVE.PT

> Phân tích chi tiết responsive design strategy và mobile-first approach

---

## 📋 TABLE OF CONTENTS

1. [Breakpoint Strategy](#breakpoints)
2. [Mobile-First Approach](#mobile-first)
3. [Touch Gestures](#touch)
4. [Responsive Images](#images)
5. [Mobile Navigation](#navigation)
6. [Implementation Guide](#implementation)

---

## 📐 BREAKPOINT STRATEGY {#breakpoints}

### Breakpoint System

```css
:root {
  --xxlarge: 2000px;
  --xlarge: 1700px;
  --large: 1440px;
  --medium: 1290px;
  --small: 1023px;
  --xsmall: 743px;
  --xxsmall: 410px;
}
```

### Media Query Usage

```scss
// Desktop First (Phive approach)
.element {
  font-size: 24px; // Desktop
  
  @media (max-width: 1440px) {
    font-size: 20px; // Large
  }
  
  @media (max-width: 1023px) {
    font-size: 18px; // Tablet
  }
  
  @media (max-width: 743px) {
    font-size: 16px; // Mobile
  }
}

// Mobile First (Recommended for FitCity)
.element {
  font-size: 16px; // Mobile
  
  @media (min-width: 744px) {
    font-size: 18px; // Tablet
  }
  
  @media (min-width: 1024px) {
    font-size: 20px; // Desktop
  }
  
  @media (min-width: 1441px) {
    font-size: 24px; // Large
  }
}
```

### Fluid Typography

```css
/* Phive's clamp() approach */
.title-1 {
  font-size: clamp(114px, 46.725px + 100vw * .1725, 340px);
  /* min: 114px, preferred: calc, max: 340px */
}

.title-2 {
  font-size: clamp(120px, 66.414px + 100vw * .1374, 300px);
}

.body-1 {
  font-size: clamp(12px, 11.415px + 100vw * .0015, 14px);
}

/* Simplified approach for FitCity */
.title {
  font-size: clamp(2rem, 5vw, 5rem);
}

.subtitle {
  font-size: clamp(1.25rem, 2.5vw, 2rem);
}

.body {
  font-size: clamp(0.875rem, 1vw, 1rem);
}
```

---

## 📱 MOBILE-FIRST APPROACH {#mobile-first}

### Grid System

```scss
// 16-column grid (Phive)
.row {
  display: flex;
  flex-wrap: wrap;
  padding: 0 var(--grid-padding);
  
  .col {
    flex: 1 1 0;
    padding: 0 var(--grid-gutter);
  }
}

// Mobile: Full width
.col-mobile-16 {
  flex: 0 0 100%;
  max-width: 100%;
}

// Tablet: Half width
@media (min-width: 744px) {
  .col-tablet-8 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

// Desktop: Custom widths
@media (min-width: 1024px) {
  .col-desktop-6 {
    flex: 0 0 37.5%;
    max-width: 37.5%;
  }
}
```

### Responsive Components

```vue
<!-- ClubCard.vue -->
<template>
  <article class="club-card">
    <div class="card-image">
      <picture>
        <!-- Mobile -->
        <source
          media="(max-width: 743px)"
          :srcset="getMobileImage()"
          sizes="100vw"
        >
        
        <!-- Tablet -->
        <source
          media="(max-width: 1023px)"
          :srcset="getTabletImage()"
          sizes="50vw"
        >
        
        <!-- Desktop -->
        <img
          :src="getDesktopImage()"
          :alt="club.name"
          loading="lazy"
        >
      </picture>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ club.name }}</h3>
      <p class="card-location">{{ club.location }}</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.club-card {
  // Mobile: Full width, vertical layout
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .card-image {
    aspect-ratio: 4 / 3;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .card-title {
    font-size: clamp(1.25rem, 3vw, 1.875rem);
  }
  
  // Tablet: Side-by-side
  @media (min-width: 744px) {
    flex-direction: row;
    
    .card-image {
      flex: 0 0 40%;
      aspect-ratio: 1 / 1;
    }
    
    .card-content {
      flex: 1;
      padding: 1.5rem;
    }
  }
  
  // Desktop: Hover effects
  @media (min-width: 1024px) and (hover: hover) {
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
```

---

## 👆 TOUCH GESTURES {#touch}

### Swipe Detection

```javascript
// composables/useSwipe.js
export const useSwipe = (element, options = {}) => {
  const {
    threshold = 50,
    timeout = 500,
    passive = true
  } = options
  
  const touchStart = ref({ x: 0, y: 0, time: 0 })
  const touchEnd = ref({ x: 0, y: 0, time: 0 })
  
  const onSwipeLeft = ref(() => {})
  const onSwipeRight = ref(() => {})
  const onSwipeUp = ref(() => {})
  const onSwipeDown = ref(() => {})
  
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    touchStart.value = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
  }
  
  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0]
    touchEnd.value = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    
    const deltaX = touchEnd.value.x - touchStart.value.x
    const deltaY = touchEnd.value.y - touchStart.value.y
    const deltaTime = touchEnd.value.time - touchStart.value.time
    
    if (deltaTime > timeout) return
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight.value()
        } else {
          onSwipeLeft.value()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          onSwipeDown.value()
        } else {
          onSwipeUp.value()
        }
      }
    }
  }
  
  onMounted(() => {
    if (!element.value) return
    
    element.value.addEventListener('touchstart', handleTouchStart, { passive })
    element.value.addEventListener('touchend', handleTouchEnd, { passive })
  })
  
  onUnmounted(() => {
    if (!element.value) return
    
    element.value.removeEventListener('touchstart', handleTouchStart)
    element.value.removeEventListener('touchend', handleTouchEnd)
  })
  
  return {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  }
}
```

### Usage

```vue
<template>
  <div ref="carouselRef" class="carousel">
    <div class="carousel-inner" :style="{ transform: `translateX(${offset}px)` }">
      <slot />
    </div>
  </div>
</template>

<script setup>
const carouselRef = ref(null)
const offset = ref(0)
const currentIndex = ref(0)

const { onSwipeLeft, onSwipeRight } = useSwipe(carouselRef)

onSwipeLeft.value = () => {
  if (currentIndex.value < totalSlides.value - 1) {
    currentIndex.value++
    updateOffset()
  }
}

onSwipeRight.value = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    updateOffset()
  }
}

const updateOffset = () => {
  offset.value = -currentIndex.value * slideWidth.value
}
</script>
```

### Touch-Friendly Buttons

```scss
.button {
  // Minimum touch target: 44x44px (iOS), 48x48px (Android)
  min-width: 48px;
  min-height: 48px;
  
  // Add padding for easier tapping
  padding: 12px 24px;
  
  // Prevent text selection on touch
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  
  // Touch feedback
  @media (hover: none) {
    &:active {
      transform: scale(0.95);
      opacity: 0.8;
    }
  }
}
```

---

## 🖼️ RESPONSIVE IMAGES {#images}

### Picture Element

```vue
<template>
  <picture>
    <!-- Mobile: 400px wide -->
    <source
      media="(max-width: 743px)"
      :srcset="`
        ${getImageUrl(image, { width: 400, format: 'webp' })} 1x,
        ${getImageUrl(image, { width: 800, format: 'webp' })} 2x
      `"
      type="image/webp"
    >
    
    <!-- Tablet: 800px wide -->
    <source
      media="(max-width: 1023px)"
      :srcset="`
        ${getImageUrl(image, { width: 800, format: 'webp' })} 1x,
        ${getImageUrl(image, { width: 1600, format: 'webp' })} 2x
      `"
      type="image/webp"
    >
    
    <!-- Desktop: 1200px wide -->
    <source
      :srcset="`
        ${getImageUrl(image, { width: 1200, format: 'webp' })} 1x,
        ${getImageUrl(image, { width: 2400, format: 'webp' })} 2x
      `"
      type="image/webp"
    >
    
    <!-- Fallback -->
    <img
      :src="getImageUrl(image, { width: 800 })"
      :alt="alt"
      loading="lazy"
      decoding="async"
    >
  </picture>
</template>
```

### Srcset & Sizes

```html
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w,
    image-1600.jpg 1600w
  "
  sizes="
    (max-width: 743px) 100vw,
    (max-width: 1023px) 50vw,
    33vw
  "
  alt="Description"
  loading="lazy"
>
```

### Lazy Loading

```vue
<template>
  <div class="image-wrapper">
    <!-- Placeholder -->
    <div
      v-if="!loaded"
      class="image-placeholder"
      :style="{ backgroundColor: dominantColor }"
    >
      <div class="spinner"></div>
    </div>
    
    <!-- Actual image -->
    <img
      v-show="loaded"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      @load="handleLoad"
    >
  </div>
</template>

<script setup>
const props = defineProps({
  src: String,
  alt: String,
  dominantColor: {
    type: String,
    default: '#f0f0f0'
  }
})

const loaded = ref(false)

const handleLoad = () => {
  loaded.value = true
}
</script>

<style scoped>
.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
```

---

## 🧭 MOBILE NAVIGATION {#navigation}

### Hamburger Menu

```vue
<!-- components/MobileMenu.vue -->
<template>
  <div class="mobile-menu" :class="{ 'is-open': isOpen }">
    <!-- Burger Button -->
    <button
      class="burger-btn"
      :aria-label="isOpen ? 'Close menu' : 'Open menu'"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="burger-line"></span>
      <span class="burger-line"></span>
      <span class="burger-line"></span>
    </button>
    
    <!-- Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="menu-overlay"
        @click="close"
      ></div>
    </Transition>
    
    <!-- Menu Panel -->
    <Transition name="slide">
      <nav
        v-if="isOpen"
        class="menu-panel"
        @click.stop
      >
        <ul class="menu-list">
          <li v-for="item in menuItems" :key="item.id">
            <NuxtLink
              :to="item.path"
              @click="close"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </div>
</template>

<script setup>
const isOpen = ref(false)

const menuItems = [
  { id: 1, label: 'Home', path: '/' },
  { id: 2, label: 'Clubs', path: '/clubs' },
  { id: 3, label: 'Classes', path: '/classes' },
  { id: 4, label: 'About', path: '/about' },
  { id: 5, label: 'Contact', path: '/contact' }
]

const toggle = () => {
  isOpen.value = !isOpen.value
  
  // Prevent body scroll when menu is open
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const close = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
.mobile-menu {
  // Only show on mobile
  @media (min-width: 1024px) {
    display: none;
  }
}

.burger-btn {
  position: relative;
  z-index: 1001;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  
  .burger-line {
    width: 100%;
    height: 2px;
    background: var(--color-darkBrown);
    transition: all 0.3s ease;
  }
  
  .is-open & {
    .burger-line:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }
    
    .burger-line:nth-child(2) {
      opacity: 0;
    }
    
    .burger-line:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 400px;
  height: 100%;
  background: var(--color-yellow);
  z-index: 1000;
  padding: 5rem 2rem;
  overflow-y: auto;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  a {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-darkBrown);
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 0.7;
    }
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
```

---

## 🚀 IMPLEMENTATION GUIDE {#implementation}

### Mobile-First Workflow

```scss
// 1. Start with mobile styles
.component {
  // Mobile (default)
  padding: 1rem;
  font-size: 1rem;
  
  // 2. Add tablet styles
  @media (min-width: 744px) {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
  
  // 3. Add desktop styles
  @media (min-width: 1024px) {
    padding: 2rem;
    font-size: 1.25rem;
  }
  
  // 4. Add large desktop styles
  @media (min-width: 1441px) {
    padding: 3rem;
    font-size: 1.5rem;
  }
}
```

### Testing Checklist

```javascript
// Devices to test
const testDevices = [
  // Mobile
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12 Pro', width: 390, height: 844 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800 },
  
  // Tablet
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  
  // Desktop
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Large Desktop', width: 2560, height: 1440 }
]

// Features to test
const testFeatures = [
  'Touch gestures (swipe, tap, pinch)',
  'Scroll behavior',
  'Navigation menu',
  'Form inputs',
  'Image loading',
  'Video playback',
  'Animations',
  'Orientation change',
  'Keyboard visibility'
]
```

### Performance Optimization

```javascript
// 1. Reduce bundle size for mobile
if (process.client && window.innerWidth < 744) {
  // Don't load heavy desktop features
  // Use lighter alternatives
}

// 2. Lazy load images
<img loading="lazy" decoding="async">

// 3. Use appropriate image sizes
const imageWidth = window.innerWidth < 744 ? 400 : 800

// 4. Defer non-critical CSS
<link rel="preload" href="critical.css" as="style">
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">

// 5. Use system fonts on mobile
@media (max-width: 743px) {
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
}
```

---

## 📊 BEST PRACTICES

### DO ✅
1. Start with mobile design
2. Use touch-friendly sizes (min 48x48px)
3. Test on real devices
4. Optimize images for each breakpoint
5. Use system fonts when possible
6. Implement proper touch gestures
7. Prevent zoom on input focus
8. Use viewport meta tag correctly

### DON'T ❌
1. Rely only on desktop testing
2. Use hover states on mobile
3. Create tiny touch targets
4. Load desktop-sized images on mobile
5. Forget about landscape orientation
6. Block pinch-to-zoom
7. Use fixed positioning excessively
8. Ignore safe areas (notches)

---

**Created by:** Responsive Design Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete  
**Next:** Test on real devices
