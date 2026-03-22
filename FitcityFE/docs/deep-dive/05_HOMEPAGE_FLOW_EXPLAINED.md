# FitCity Homepage - Luồng Hoạt Động Chi Tiết

## 📖 Mục Lục
1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Page Load Sequence](#2-page-load-sequence)
3. [Home Header - Hero Slider](#3-home-header---hero-slider)
4. [Global Menu System](#4-global-menu-system)
5. [Scroll Experience](#5-scroll-experience)
6. [3D Scene Integration](#6-3d-scene-integration)
7. [Phive Clubs Section](#7-phive-clubs-section)
8. [Page Transitions](#8-page-transitions)
9. [Performance Optimizations](#9-performance-optimizations)

---

## 1. Tổng Quan Kiến Trúc

### 1.1 Layer Structure (Z-Index Hierarchy)

```
┌─────────────────────────────────────────┐
│ Layer 11: Menu Grid (z-index: 11)      │ ← Cao nhất
├─────────────────────────────────────────┤
│ Layer 10: Loading Screen (z-index: 10000)│
├─────────────────────────────────────────┤
│ Layer 9: Curtain (z-index: 999)        │
├─────────────────────────────────────────┤
│ Layer 2: Page Content (z-index: 9)     │
├─────────────────────────────────────────┤
│ Layer 1: Background                     │
└─────────────────────────────────────────┘
```

### 1.2 Core Technologies Stack

```javascript
// Framework
- Nuxt 3 (Vue 3 Composition API)
- Vue Router (SPA navigation)

// Animation
- GSAP Core (Timeline, Tween)
- GSAP ScrollTrigger (Scroll-based animations)
- GSAP Flip (Layout transitions)

// 3D Graphics
- Three.js (WebGL rendering)
- TresJS (Vue wrapper for Three.js)

// Smooth Scroll
- Lenis (Smooth scrolling library)

// State Management
- Pinia (Vue store)
- Event Bus (Global events)
```

---

## 2. Page Load Sequence

### 2.1 Initial Load (0-2 seconds)

```javascript
// Step 1: Loading Screen Appears
// File: Bhbjo-UN.js (Loading component)
[data-component="loading"] {
  z-index: 10000;
  background-color: var(--color-black);
  opacity: 1;
}

// Step 2: Assets Loading
const loader = {
  loaded: Promise,  // Resolves when critical assets loaded
  ready: Promise    // Resolves when page ready to animate
}

// Step 3: Preload Critical Assets
- Fonts (PPFormula, AcidGrotesk)
- Hero images (first slide)
- 3D model (/webgl/plates-color-whit-imetal-round.glb)
- CSS variables
```

### 2.2 Curtain Enter Animation (2-3 seconds)

```javascript
// Event: "curtain-enter"
// File: extracted_curtain_code.js

Timeline: o (enter animation)
├─ .top: scaleY(1 → 0) from top
│  Duration: 1s, Ease: expo.inOut
├─ .bottom: scaleY(1 → 0) from bottom
│  Duration: 1s, Ease: expo.inOut
└─ Promise resolves after 850ms

Visual Effect:
┌──────────────────┐
│ ████████████████ │ ← Top panel slides up
│ ────────────────  │ ← Center line
│ ████████████████ │ ← Bottom panel slides down
└──────────────────┘
     ↓ (850ms)
┌──────────────────┐
│                  │ ← Reveals content
│                  │
│                  │
└──────────────────┘
```

### 2.3 Component Initialization Order

```javascript
// 1. Global Components (Always present)
loader.loaded.then(() => {
  // Menu Bar animation
  gsap.set(".bar-container", {
    transformOrigin: "bottom",
    rotationX: 120  // Hidden, rotated back
  })
  
  // Curtain setup
  curtain.setupTimelines()
})

// 2. Page Components
loader.ready.then(() => {
  // Home Header
  homeHeader.enter()
  
  // Menu Bar reveal
  gsap.to(".bar-container", {
    rotationX: 0,
    duration: 1,
    ease: "expo.out",
    delay: 1
  })
  
  // 3D Scene (if viewport > small)
  if (viewport.width >= 744px) {
    threeScene.init()
  }
})
```

---

## 3. Home Header - Hero Slider

### 3.1 Component Architecture

```
HomeHeader (C6udHOap.js)
├─ Ribbon[] (rj_TxuR3.js)
│  ├─ Background (animated image)
│  ├─ Content (text + CTA)
│  └─ Bullets (navigation dots)
├─ Theme Manager
└─ Auto-play Controller
```

### 3.2 Slide Structure

```javascript
// Data structure for each slide
const highlights = [
  {
    id: 1,
    theme: "light",           // or: stream, pilates, nutrition, subduedYellow
    background: {
      desktop: "/imgs/slide-1-desktop.jpg",
      mobile: "/imgs/slide-1-mobile.jpg"
    },
    title: {
      first: "FITNESS",
      last: "REDEFINED"
    },
    subtitle: "DISCOVER YOUR POTENTIAL",
    ctas: [
      { label: "JOIN NOW", link: "/join" }
    ]
  },
  // ... 4 more slides (total 5)
]
```

### 3.3 Animation Timeline per Slide

```javascript
// File: rj_TxuR3.js - Ribbon component

// Each Ribbon has 3 synchronized timelines:

// 1. Background Timeline
const backgroundTl = gsap.timeline({ paused: true })
backgroundTl
  .fromTo(".background img", 
    { scale: 1.2, autoAlpha: 0 },
    { scale: 1, autoAlpha: 1, duration: 2, ease: "power2.out" }
  )

// 2. Content Timeline
const contentTl = gsap.timeline({ paused: true })
contentTl
  .fromTo(".title .first", 
    { y: 100, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out" }
  )
  .fromTo(".title .last",
    { y: 100, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out" },
    "-=0.8"  // Overlap 0.8s
  )
  .fromTo(".subtitle",
    { y: 20, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.8 },
    "-=0.5"
  )
  .fromTo(".ctas",
    { y: 20, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.8 },
    "-=0.5"
  )

// 3. Bullets Timeline
const bulletsTl = gsap.timeline({ paused: true })
bulletsTl
  .to(".bullet.active", {
    scale: 1.2,
    duration: 0.3
  })
```

### 3.4 Slide Transition Flow

```javascript
// File: C6udHOap.js - changeSlide()

Step 1: Close Current Slide
├─ Background: scale(1 → 1.1), opacity(1 → 0)
├─ Content: y(0 → -50), opacity(1 → 0)
└─ Duration: 0.8s

Step 2: Cleanup (after close completes)
├─ bullets[currentIndex].cleanup()
├─ content[currentIndex].cleanup()
├─ background[currentIndex].cleanup()
└─ gsap.set(elements, { clearProps: "all" })

Step 3: Update Index
currentIndex = nextIndex

Step 4: Theme Change
├─ Determine theme based on slide index
│  Slide 1 → "light"
│  Slide 2 → "stream"
│  Slide 3 → "pilates"
│  Slide 4 → "nutrition"
│  Slide 5 → "subduedYellow"
├─ setMenuTheme(theme)
└─ Update CSS variables

Step 5: Enter Next Slide
├─ Background: scale(1.2 → 1), opacity(0 → 1)
├─ Content: y(100 → 0), opacity(0 → 1)
└─ Duration: 1.2s

Step 6: Start Auto-play
setTimeout(() => changeSlide(), 5000)
```

### 3.5 Theme System Integration

```javascript
// File: C6udHOap.js - setThemeForSlide()

const setThemeForSlide = (slideIndex) => {
  const themeMap = {
    0: { mobile: "light", desktop: "dark" },
    1: { mobile: "stream", desktop: "dark-stream" },
    2: { mobile: "pilates", desktop: "dark-pilates" },
    3: { mobile: "nutrition", desktop: "dark-nutrition" },
    4: { mobile: "subduedYellow", desktop: "dark-subduedYellow" }
  }
  
  const theme = viewport.width <= 744 
    ? themeMap[slideIndex].mobile
    : themeMap[slideIndex].desktop
  
  // Update menu theme
  setMenuTheme(theme)
  
  // Update CSS variables
  document.documentElement.style.setProperty(
    '--current-theme-bg', 
    `var(--color-${theme})`
  )
}

// CSS Variables Update
:root {
  /* Light theme */
  --menu-color: var(--color-darkBrown);
  --menu-backgroundColor: var(--color-yellow);
  
  /* Dark theme */
  --menu-color: var(--color-yellow);
  --menu-backgroundColor: var(--color-darkBrown);
}
```

### 3.6 User Interactions

```javascript
// 1. Bullet Click
const onBulletClick = (index) => {
  if (index === currentIndex) return
  
  // Pause auto-play
  pauseAutoPlay()
  
  // Change to clicked slide
  changeSlide(index)
  
  // Resume auto-play after 8s
  setTimeout(() => resumeAutoPlay(), 8000)
}

// 2. Window Blur/Focus
window.addEventListener("blur", () => {
  // Pause all animations when tab inactive
  ribbons[currentIndex].pause()
  bullets[currentIndex].pause()
})

window.addEventListener("focus", () => {
  // Resume animations when tab active
  ribbons[currentIndex].play()
  bullets[currentIndex].play()
})

// 3. Scroll Detection
scroller.on("scroll", ({ scroll }) => {
  if (scroll > 100) {
    // User scrolled down, pause slider
    pauseAutoPlay()
  }
})
```

---

## 4. Global Menu System

### 4.1 Menu Structure

```
MenuGrid (data-component="menu-grid")
├─ Background Overlay (click to close)
├─ Menu Inner
│  ├─ Items Container
│  │  ├─ Main Items (pages)
│  │  │  ├─ Languages Switcher
│  │  │  ├─ Page Links (Home, About, Classes, etc.)
│  │  │  └─ CTA Button (Join Now)
│  │  └─ Sub Items (clubs list)
│  │     ├─ Back Button
│  │     ├─ Club Cards (scrollable)
│  │     └─ Custom Scrollbar
│  └─ Bar Container
│     ├─ Bar (burger button + logo)
│     └─ Anchors (horizontal navigation)
└─ CTA Button (bottom right)
```

### 4.2 Open/Close Animation

```javascript
// File: extracted_menu_code.js

// CLOSED STATE
Initial:
├─ .bar-container: rotationX(120), y(0)
├─ .items: opacity(0), pointer-events(none)
├─ .background: opacity(0)
└─ data-open="false"

// OPENING SEQUENCE (triggered by burger click)
Timeline (duration: ~1.5s):

0.0s: Click burger button
├─ data-open="true"
├─ Stop page scroll (scroller.stop())
└─ Play open timeline

0.0s - 0.8s: Background fade in
├─ .background: opacity(0 → 1)
└─ Ease: cubic-bezier(.19,1,.22,1)

0.2s - 1.2s: Items reveal
├─ .items: opacity(0 → 1)
├─ .items: pointer-events(none → visible)
└─ Perspective transform for 3D effect

0.0s - 1.0s: Bar animation
├─ .bar-container: rotationX(120 → 0)
└─ Ease: expo.out

// CLOSING SEQUENCE (triggered by burger click or ESC key)
Timeline (duration: ~1.0s):

0.0s: Trigger close
├─ data-open="false"
└─ Play close timeline (reverse)

0.0s - 0.6s: Items hide
├─ .items: opacity(1 → 0)
└─ .items: pointer-events(visible → none)

0.2s - 1.0s: Background fade out
├─ .background: opacity(1 → 0)
└─ Resume page scroll (scroller.start())
```

### 4.3 Multi-Level Navigation

```javascript
// Main Items View (default)
[data-component="items"] {
  opacity: 1;
  pointer-events: visible;
}

// When "Clubs" is clicked:
Step 1: Hide main items
├─ items.opacity: 1 → 0
└─ Duration: 0.3s

Step 2: Show sub-items
├─ subItems.opacity: 0 → 1
├─ subItems.transform: translateX(100%) → translateX(0)
└─ Duration: 0.5s, Ease: expo.out

// Sub-Items View
[data-component="sub-items"] {
  position: absolute;
  left: 0; top: 0;
  width: 100%;
  height: 100%;
}

// When "Back" is clicked:
Reverse the animation
```

### 4.4 Responsive Behavior

```javascript
// Desktop (> 1024px)
.menu-grid {
  --menu-width: 55vw;  // 55% viewport width
}

.items {
  display: grid;
  grid-template-columns: 1fr;
}

.anchors {
  display: flex;  // Show anchor navigation
}

// Tablet (744px - 1024px)
.menu-grid {
  --menu-width: 70vw;
}

.anchors {
  display: none;  // Hide anchors
}

// Mobile (< 744px)
.menu-grid {
  --menu-width: 100vw;  // Full width
}

.button-cta-container {
  // Move CTA to bottom center
  left: calc(50vw - 162.5px);
  bottom: 90px;
  width: 325px;
}
```

### 4.5 Keyboard & Accessibility

```javascript
// ESC key to close
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuOpen) {
    closeMenu()
  }
})

// Focus trap when menu open
const focusableElements = menu.querySelectorAll(
  'a, button, [tabindex]:not([tabindex="-1"])'
)

// Cycle focus within menu
firstElement.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && e.shiftKey) {
    e.preventDefault()
    lastElement.focus()
  }
})
```

---

## 5. Scroll Experience

### 5.1 Lenis Smooth Scroll Setup

```javascript
// Initialization
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,        // Scroll duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
  smoothTouch: false,   // Disable on touch devices
  touchMultiplier: 2
})

// Animation loop
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// GSAP Integration
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
```

### 5.2 Scroll-Triggered Animations

```javascript
// Example: Fade in on scroll
gsap.from(".section", {
  scrollTrigger: {
    trigger: ".section",
    start: "top 80%",      // When top of section hits 80% of viewport
    end: "top 20%",
    scrub: true,           // Smooth animation tied to scroll
    markers: false
  },
  y: 100,
  opacity: 0
})

// Example: Pin section while animating
ScrollTrigger.create({
  trigger: ".phive-clubs",
  start: "top top",
  end: "+=2000",           // Pin for 2000px of scroll
  pin: true,
  scrub: 1
})
```

### 5.3 CTA Button Hide on Scroll

```javascript
// File: extracted_menu_code.js

const ctaTimeline = gsap.timeline({ paused: true })

// Desktop: Slide right
if (viewport.width > 744) {
  ctaTimeline.fromTo(".button-cta-container",
    { xPercent: 0 },
    { xPercent: 120, duration: 2, ease: "power4.inOut" }
  )
}
// Mobile: Slide down
else {
  ctaTimeline.fromTo(".button-cta-container",
    { y: 0 },
    { y: 100, duration: 2, ease: "power4.inOut" }
  )
}

// Scroll listener
scroller.on("scroll", ({ scroll, direction }) => {
  if (direction === 1) {        // Scrolling down
    ctaTimeline.play()
  } else if (scroll <= 100) {   // Near top
    ctaTimeline.reverse()
  }
})
```

---

## 6. 3D Scene Integration

### 6.1 Scene Setup

```javascript
// File: CXL_xa40.js

// 1. Scene initialization
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
camera.position.set(0, 0, 12)

// 2. Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1.2)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(0, 0, 8)

// 3. Environment map (for reflections)
const pmremGenerator = new THREE.PMREMGenerator(renderer)
const envTexture = pmremGenerator.fromScene(new THREE.Scene()).texture
scene.environment = envTexture
```

### 6.2 Plate Instances Configuration

```javascript
// 6 plate instances with different positions and rotations
const instances = [
  {
    positionFrom: [-gridWidth * 0.8, gridHeight * 0, 1],
    rotation: [Math.PI/3, 0, -(Math.PI/5)]
  },
  {
    positionFrom: [gridWidth * 0.8, -gridHeight * 1 * spacing, 0],
    rotation: [Math.PI/4, 0, Math.PI/4]
  },
  {
    positionFrom: [-gridWidth * 0.6, -gridHeight * 2 * spacing, 1],
    rotation: [Math.PI/4, 0, -(Math.PI/4)]
  },
  {
    positionFrom: [gridWidth * 0.4, -gridHeight * 3 * spacing, 2],
    rotation: [Math.PI/3, 0, Math.PI/2]
  },
  {
    positionFrom: [-gridWidth * 0.4, -gridHeight * 4 * spacing, 1],
    rotation: [Math.PI/3, 0, -(Math.PI/3)]
  },
  {
    positionFrom: [gridWidth * 0.75, -gridHeight * 5 * spacing, 0],
    rotation: [Math.PI/3, 0, Math.PI/3]
  }
]

// spacing = 0.6 (vertical gap between plates)
```

### 6.3 Animation Loop

```javascript
// Continuous rotation + upward movement
useRenderLoop(({ timer }) => {
  const delta = timer.getDelta()
  
  instances.forEach((instance, i) => {
    // Get current transform
    instancedMesh.getMatrixAt(i, matrix)
    matrix.decompose(position, quaternion, scale)
    
    // Apply rotations
    const rotationY = new THREE.Quaternion()
    rotationY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), delta * 0.18)
    
    const rotationZ = new THREE.Quaternion()
    rotationZ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), delta * 0.25)
    
    quaternion.multiply(rotationY).multiply(rotationZ)
    
    // Move upward
    position.y += 1.2 * delta
    
    // Loop when off-screen
    if (position.y > viewportHeight) {
      position.y = -viewportHeight
    }
    
    // Update matrix
    matrix.compose(position, quaternion, scale)
    instancedMesh.setMatrixAt(i, matrix)
  })
  
  instancedMesh.instanceMatrix.needsUpdate = true
})
```

### 6.4 Click Interaction

```javascript
// Raycaster for click detection
const raycaster = new THREE.Raycaster()
raycaster.listenToPointerEvents(renderer, camera)

instancedMesh.addEventListener("click", ({ intersection }) => {
  const instanceId = intersection.instanceId
  
  // Set spin speed
  instances[instanceId].rotationSpeed = 10
  instances[instanceId].pointerdown = true
})

// Gradually slow down spin
if (instance.pointerdown) {
  instance.rotationSpeed *= 0.95  // Decay factor
  
  if (Math.abs(instance.rotationSpeed) < 0.0001) {
    instance.rotationSpeed = 0
  }
  
  // Apply spin rotation
  const spinRotation = instance.rotationSpeed * delta
  // ... apply to quaternion
}
```

### 6.5 Responsive Viewport

```javascript
// Update positions on resize
watch(viewport, () => {
  const { width, height } = viewport.getCurrentViewport()
  const gridWidth = width / 2
  const gridHeight = height / 2
  
  // Recalculate all instance positions
  instances[0].positionFrom = [-gridWidth * 0.8, gridHeight * 0, 1]
  instances[1].positionFrom = [gridWidth * 0.8, -gridHeight * 1 * 0.6, 0]
  // ... etc
})
```

---

## 7. Phive Clubs Section

### 7.1 Layout Structure

```javascript
// Initial state: Cards in horizontal row
┌────────────────────────────────────────────────┐
│  [Card1] [Card2] [Card3] [Card4] [Card5] ...  │
└────────────────────────────────────────────────┘

// On scroll: Cards rearrange to grid
┌──────────────────┐
│  [Card1] [Card2] │
│  [Card3] [Card4] │
│  [Card5] [Card6] │
└──────────────────┘
```

### 7.2 Flip Animation

```javascript
// File: -2VY23FF.js

import { Flip } from "gsap/Flip"

// Step 1: Capture initial state
const state = Flip.getState(".club-card")

// Step 2: Change layout (CSS class change)
container.classList.add("grid-layout")

// Step 3: Animate to new positions
Flip.from(state, {
  duration: 0.8,
  ease: "power2.inOut",
  stagger: 0.05,
  absolute: true  // Use absolute positioning during animation
})
```

### 7.3 ScrollTrigger Integration

```javascript
ScrollTrigger.create({
  trigger: ".phive-clubs",
  start: "top center",
  end: "bottom center",
  
  onEnter: () => {
    // Trigger layout change
    animateToGrid()
  },
  
  onLeaveBack: () => {
    // Reverse to horizontal
    animateToRow()
  },
  
  scrub: 1  // Smooth animation tied to scroll
})
```

### 7.4 Custom Scrollbar

```javascript
// Draggable scrollbar for horizontal scroll
const scrollbar = {
  track: element.querySelector(".custom-scrollbar"),
  thumb: element.querySelector(".scroll-thumb"),
  
  // Calculate thumb width based on content
  thumbWidth: (visibleWidth / totalWidth) * trackWidth,
  
  // Update thumb position on scroll
  updatePosition: (scrollLeft) => {
    const thumbLeft = (scrollLeft / maxScroll) * (trackWidth - thumbWidth)
    gsap.set(thumb, { x: thumbLeft })
  },
  
  // Drag interaction
  draggable: Draggable.create(thumb, {
    type: "x",
    bounds: track,
    onDrag: function() {
      const scrollLeft = (this.x / (trackWidth - thumbWidth)) * maxScroll
      container.scrollLeft = scrollLeft
    }
  })
}
```

---

## 8. Page Transitions

### 8.1 Navigation Flow

```javascript
// When user clicks a link
router.beforeEach((to, from, next) => {
  // 1. Trigger curtain transition out
  curtain.transitionOut().then(() => {
    // 2. Navigate to new page
    next()
  })
})

router.afterEach(() => {
  // 3. Scroll to top
  lenis.scrollTo(0, { immediate: true })
  
  // 4. Trigger curtain transition in
  curtain.transitionIn().then(() => {
    // 5. Page ready
  })
})
```

### 8.2 Curtain Transition Sequence

```javascript
// TRANSITION OUT (leaving page)
Timeline: u (duration: 900ms)

0ms: Start
├─ .line .inner: scaleX(1 → 0)
│  Ease: expo.inOut, Duration: 1s
├─ .top: scaleY(1 → 0) from top
│  Ease: expo.inOut, Duration: 1s
└─ .bottom: scaleY(1 → 0) from bottom
   Ease: expo.inOut, Duration: 1s

Visual:
┌──────────────────┐
│     Content      │
└──────────────────┘
        ↓
┌──────────────────┐
│ ████████████████ │ ← Panels close in
│ ────────────────  │
│ ████████████████ │
└──────────────────┘

// TRANSITION IN (entering page)
Timeline: l (duration: 900ms)

0ms: Start (panels closed)
├─ .line .inner: scaleX(0 → 1)
│  Ease: expo.inOut, Duration: 1s
├─ .top: scaleY(0 → 1)
│  Ease: expo.inOut, Duration: 1s
└─ .bottom: scaleY(0 → 1)
   Ease: expo.inOut, Duration: 1s

Visual:
┌──────────────────┐
│ ████████████████ │
│ ────────────────  │
│ ████████████████ │
└──────────────────┘
        ↓
┌──────────────────┐
│   New Content    │ ← Panels open out
└──────────────────┘
```

---

## 9. Performance Optimizations

### 9.1 Lazy Loading

```javascript
// Components loaded on-demand
const componentMap = {
  "HomeHeader": () => import("./C6udHOap.js"),
  "PhiveClubs": () => import("./-2VY23FF.js"),
  "ThreeScene": () => import("./CXL_xa40.js")
}

// Only load 3D scene on desktop
if (viewport.width >= 744) {
  loader.deferLoad(loadThreeScene())
}
```

### 9.2 Image Optimization

```javascript
// Responsive images with srcset
<img
  src="/imgs/hero-mobile.jpg"
  srcset="
    /imgs/hero-mobile.jpg 744w,
    /imgs/hero-tablet.jpg 1024w,
    /imgs/hero-desktop.jpg 1920w
  "
  sizes="
    (max-width: 744px) 100vw,
    (max-width: 1024px) 100vw,
    1920px
  "
/>

// Lazy loading for below-fold images
<img loading="lazy" src="..." />
```

### 9.3 GSAP Optimizations

```javascript
// 1. Force3D for hardware acceleration
gsap.set(element, { force3D: true })

// 2. Will-change hints
.animating-element {
  will-change: transform, opacity;
}

// 3. Cleanup after animations
timeline.eventCallback("onComplete", () => {
  gsap.set(element, { clearProps: "all" })
})

// 4. Reuse timelines instead of creating new ones
const tl = gsap.timeline({ paused: true })
// ... setup once
tl.play()  // Reuse multiple times
```

### 9.4 Three.js Optimizations

```javascript
// 1. InstancedMesh instead of individual meshes
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  6  // 6 instances instead of 6 separate meshes
)

// 2. Frustum culling
instancedMesh.frustumCulled = false  // Disable if always visible

// 3. Dispose resources
onUnmounted(() => {
  geometry.dispose()
  material.dispose()
  renderer.dispose()
})

// 4. Conditional rendering
if (!viewport.inViewport) {
  // Pause render loop
  return
}
```

### 9.5 Event Debouncing

```javascript
// Resize handler
let resizeTimeout
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    handleResize()
  }, 150)
})

// Scroll handler with RAF
let scrollTicking = false
scroller.on("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      handleScroll()
      scrollTicking = false
    })
    scrollTicking = true
  }
})
```

---

## 10. Complete User Journey Timeline

```
0s: User lands on page
├─ Loading screen visible (black background)
├─ Assets start loading (fonts, images, 3D model)
└─ Preloader animation

2s: Assets loaded
├─ Curtain enter animation starts
├─ Top/bottom panels slide apart (850ms)
└─ Content revealed

2.85s: Page components initialize
├─ Home Header: First slide enters
│  ├─ Background: scale(1.2 → 1), opacity(0 → 1)
│  ├─ Title "FITNESS": y(100 → 0), opacity(0 → 1)
│  ├─ Title "REDEFINED": y(100 → 0), opacity(0 → 1)
│  └─ CTA button: y(20 → 0), opacity(0 → 1)
├─ Menu Bar: rotationX(120 → 0)
└─ 3D Scene: Plates start rotating

3.5s: Page fully interactive
├─ Auto-play starts (5s per slide)
├─ User can click bullets to change slides
├─ User can scroll down
└─ User can open menu

8s: Second slide auto-advances
├─ Current slide closes (0.8s)
├─ Theme changes to "stream" (purple)
├─ Next slide enters (1.2s)
└─ Cycle continues

User scrolls down:
├─ Slider pauses
├─ CTA button slides out
├─ Phive Clubs section enters viewport
│  └─ Cards animate from row to grid (Flip)
├─ 3D Scene continues in background
└─ Smooth scroll with Lenis

User clicks burger menu:
├─ Page scroll stops
├─ Background overlay fades in (0.8s)
├─ Menu items reveal (1.0s)
├─ Bar rotates to show close icon
└─ User can navigate or close (ESC)

User clicks a link:
├─ Curtain transition out (900ms)
├─ Route changes
├─ Scroll to top
├─ Curtain transition in (900ms)
└─ New page loads
```

---

## 11. Key Takeaways

### Architecture Principles
1. **Layered Approach**: Global components (Menu, Curtain) separate from page content
2. **Event-Driven**: Components communicate via event bus, not direct coupling
3. **Promise-Based**: Async animations return Promises for sequencing
4. **Responsive First**: Different behaviors for mobile/tablet/desktop
5. **Performance Focused**: Lazy loading, hardware acceleration, resource cleanup

### Animation Philosophy
1. **GSAP for Everything**: No CSS transitions for complex animations
2. **Timeline Reuse**: Create once, play/pause/reverse multiple times
3. **Easing Consistency**: `expo.out` for entrances, `expo.inOut` for transitions
4. **Overlap for Flow**: Use negative delays (`-=0.5`) for smooth sequences
5. **Cleanup Always**: Clear props after animations to prevent conflicts

### User Experience
1. **Immediate Feedback**: Animations start within 100ms of interaction
2. **Smooth Transitions**: 60fps animations with hardware acceleration
3. **Accessible**: Keyboard navigation, focus management, reduced motion support
4. **Forgiving**: Auto-pause on blur, resume on focus
5. **Delightful**: Micro-interactions (hover states, click feedback)

---

**Tổng kết**: Homepage của FitCity/Phive là một kiệt tác kỹ thuật với hơn 10 layer animation đồng bộ, 3D graphics tích hợp, và trải nghiệm scroll mượt mà. Mọi chi tiết đều được tính toán kỹ lưỡng từ timing, easing, đến performance optimization.
