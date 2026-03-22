# 🎬 ANIMATION DEEP DIVE - PHIVE.PT

> Phân tích chi tiết hệ thống animation của Phive.pt

---

## 📋 TABLE OF CONTENTS

1. [Animation Stack Overview](#animation-stack)
2. [GSAP Implementation](#gsap)
3. [Lenis Smooth Scroll](#lenis)
4. [ScrollTrigger Patterns](#scrolltrigger)
5. [Three.js Integration](#threejs)
6. [Rive Animations](#rive)
7. [Performance Optimization](#performance)
8. [Code Examples](#examples)

---

## 🎯 ANIMATION STACK OVERVIEW {#animation-stack}

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ANIMATION LAYERS                          │
└─────────────────────────────────────────────────────────────┘

Layer 5: VECTOR ANIMATIONS (Rive)
├─ Interactive icons
├─ State machines
├─ Audio-reactive animations
└─ Playback control

Layer 4: 3D EFFECTS (Three.js)
├─ WebGL backgrounds
├─ Particle systems
├─ 3D typography
└─ Scroll-driven 3D

Layer 3: SCROLL ANIMATIONS (GSAP ScrollTrigger)
├─ Fade-in effects
├─ Parallax scrolling
├─ Pin/Unpin sections
└─ Progress-based animations

Layer 2: MICRO-INTERACTIONS (GSAP)
├─ Hover effects
├─ Click animations
├─ State transitions
└─ Loading animations

Layer 1: SMOOTH SCROLL (Lenis)
├─ Smooth scrolling behavior
├─ Custom easing
├─ RAF loop
└─ Scroll events
```

### Technology Breakdown

| Library | Version | Purpose | Usage % |
|---------|---------|---------|---------|
| **GSAP** | 3.12+ | Core animations | 80% |
| **ScrollTrigger** | 3.12+ | Scroll-based | 60% |
| **Lenis** | 1.0+ | Smooth scroll | 100% |
| **Three.js** | r150+ | 3D effects | 20% |
| **Rive** | 2.0+ | Vector animations | 10% |

---

## 🎨 GSAP IMPLEMENTATION {#gsap}

### 1. Basic Timeline Pattern

```javascript
// Pattern: Sequential animations
const tl = gsap.timeline({
  defaults: {
    duration: 1,
    ease: 'power3.out'
  }
})

tl.from('.hero-title', {
    opacity: 0,
    y: 100,
    duration: 1.2
  })
  .from('.hero-subtitle', {
    opacity: 0,
    y: 50,
    duration: 0.8
  }, '-=0.6') // Overlap by 0.6s
  .from('.hero-cta', {
    opacity: 0,
    scale: 0.8,
    duration: 0.6
  }, '-=0.4')
```

**Key Concepts:**
- `defaults` - Shared properties
- Position parameter (`'-=0.6'`) - Overlap animations
- Chaining - Sequential execution

---

### 2. Stagger Pattern

```javascript
// Pattern: Animate multiple elements with delay
gsap.from('.grid-item', {
  opacity: 0,
  y: 50,
  duration: 0.8,
  stagger: {
    amount: 1.2,        // Total stagger duration
    from: 'start',      // or 'center', 'end', 'edges'
    ease: 'power2.out'
  }
})

// Advanced stagger with grid
gsap.from('.grid-item', {
  opacity: 0,
  scale: 0.5,
  stagger: {
    grid: [4, 4],       // 4x4 grid
    from: 'center',     // Start from center
    amount: 1.5
  }
})
```

**Use Cases:**
- Grid animations
- List reveals
- Card cascades

---

### 3. Rolling Text Effect

```javascript
// Pattern: Text rolling animation (Phive signature)
const rollingTitle = (element) => {
  const first = element.querySelector('.first')
  const last = element.querySelector('.last')
  
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 2
  })
  
  tl.from(first, {
      y: '100%',
      duration: 1,
      ease: 'power3.out'
    })
    .to(first, {
      y: '-100%',
      duration: 1,
      ease: 'power3.in'
    }, '+=2')
    .from(last, {
      y: '100%',
      duration: 1,
      ease: 'power3.out'
    }, '-=1')
    .to(last, {
      y: '-100%',
      duration: 1,
      ease: 'power3.in'
    }, '+=2')
}

// HTML Structure
/*
<h2 class="rolling-title">
  <span class="first">Transform</span>
  <span class="last">Your Body</span>
</h2>
*/
```

**Timeline:**
```
0s    1s    2s    3s    4s    5s    6s
│─────│─────│─────│─────│─────│─────│
First: ▲─────────▼           
       In   Hold  Out
                  
Last:              ▲─────────▼
                   In   Hold  Out
```

---

### 4. Variable Font Animation

```javascript
// Pattern: Animate font variation settings
gsap.to('.variable-text', {
  fontVariationSettings: '"wdth" 100, "wght" 700',
  duration: 0.3,
  ease: 'power2.out',
  paused: true
})

// On hover
element.addEventListener('mouseenter', () => {
  gsap.to(element, {
    fontVariationSettings: '"wdth" 100, "wght" 700',
    duration: 0.3
  })
})

element.addEventListener('mouseleave', () => {
  gsap.to(element, {
    fontVariationSettings: '"wdth" 0, "wght" 400',
    duration: 0.3
  })
})
```

**CSS Setup:**
```css
.variable-text {
  font-family: 'PPFormula', sans-serif;
  font-variation-settings: "wdth" 0, "wght" 400;
  transition: font-variation-settings 0.3s ease;
}
```

---

### 5. Morphing Shapes

```javascript
// Pattern: SVG path morphing
gsap.to('.shape', {
  morphSVG: '.target-shape',
  duration: 1.5,
  ease: 'power2.inOut'
})

// Circle to square
const tl = gsap.timeline({ repeat: -1, yoyo: true })

tl.to('.morph-shape', {
  attr: {
    d: 'M0,0 L100,0 L100,100 L0,100 Z' // Square path
  },
  duration: 2,
  ease: 'elastic.out(1, 0.5)'
})
```

---

## 🌊 LENIS SMOOTH SCROLL {#lenis}

### 1. Basic Setup

```javascript
// composables/useScroller.js
import Lenis from '@studio-freight/lenis'

export const useScroller = () => {
  const lenis = ref(null)
  
  onMounted(() => {
    // Initialize Lenis
    lenis.value = new Lenis({
      duration: 1.2,           // Scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: 'vertical',   // or 'horizontal'
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,      // Disable on touch devices
      touchMultiplier: 2,
      infinite: false
    })
    
    // RAF loop
    function raf(time) {
      lenis.value.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  })
  
  onUnmounted(() => {
    lenis.value?.destroy()
  })
  
  // Methods
  const scrollTo = (target, options = {}) => {
    lenis.value?.scrollTo(target, {
      offset: 0,
      duration: 1.2,
      easing: (t) => t,
      ...options
    })
  }
  
  const stop = () => lenis.value?.stop()
  const start = () => lenis.value?.start()
  
  return {
    lenis,
    scrollTo,
    stop,
    start
  }
}
```

### 2. Integration with GSAP

```javascript
// Sync Lenis with GSAP ScrollTrigger
import { ScrollTrigger } from 'gsap/ScrollTrigger'

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
```

### 3. Custom Easing Functions

```javascript
// Phive's easing
const phiveEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

// Smooth ease out
const smoothEaseOut = (t) => 1 - Math.pow(1 - t, 3)

// Elastic
const elastic = (t) => {
  const c4 = (2 * Math.PI) / 3
  return t === 0 ? 0 : t === 1 ? 1 : 
    Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
}

// Usage
new Lenis({
  easing: phiveEasing
})
```

---

## 📜 SCROLLTRIGGER PATTERNS {#scrolltrigger}

### 1. Fade In on Scroll

```javascript
// Pattern: Fade in elements when they enter viewport
gsap.utils.toArray('.fade-in').forEach((element) => {
  gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',      // When top of element hits 80% of viewport
      end: 'top 20%',        // When top of element hits 20% of viewport
      toggleActions: 'play none none reverse',
      // onEnter onLeave onEnterBack onLeaveBack
      markers: false         // Debug markers
    }
  })
})
```

**Toggle Actions:**
- `play` - Play animation
- `pause` - Pause animation
- `resume` - Resume animation
- `reverse` - Reverse animation
- `restart` - Restart animation
- `reset` - Reset animation
- `complete` - Complete animation
- `none` - Do nothing

---

### 2. Parallax Effect

```javascript
// Pattern: Different scroll speeds for depth
gsap.to('.parallax-slow', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-container',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true  // Smooth scrubbing
  }
})

gsap.to('.parallax-fast', {
  y: -200,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-container',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
})
```

**Scrub Values:**
- `true` - Smooth scrubbing (0.5s lag)
- `1` - 1 second lag
- `0.5` - 0.5 second lag
- `false` - No scrubbing

---

### 3. Pin Section

```javascript
// Pattern: Pin section while animations play
gsap.timeline({
  scrollTrigger: {
    trigger: '.pinned-section',
    start: 'top top',
    end: '+=2000',         // Pin for 2000px of scroll
    pin: true,
    scrub: 1,
    anticipatePin: 1
  }
})
.to('.pinned-content', { scale: 2, duration: 1 })
.to('.pinned-content', { rotation: 360, duration: 1 })
.to('.pinned-content', { opacity: 0, duration: 1 })
```

---

### 4. Progress-Based Animation

```javascript
// Pattern: Animate based on scroll progress
ScrollTrigger.create({
  trigger: '.progress-section',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const progress = self.progress // 0 to 1
    
    // Update progress bar
    gsap.to('.progress-bar', {
      scaleX: progress,
      duration: 0.1
    })
    
    // Change color based on progress
    const hue = progress * 360
    gsap.to('.progress-element', {
      backgroundColor: `hsl(${hue}, 70%, 50%)`,
      duration: 0.1
    })
  }
})
```

---

### 5. Horizontal Scroll

```javascript
// Pattern: Horizontal scrolling sections
const sections = gsap.utils.toArray('.horizontal-section')

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-container',
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => '+=' + document.querySelector('.horizontal-container').offsetWidth
  }
})
```

---

## 🎮 THREE.JS INTEGRATION {#threejs}

### 1. Basic Setup

```javascript
// components/ThreeScene.vue
<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, mesh

onMounted(() => {
  init()
  animate()
})

const init = () => {
  // Scene
  scene = new THREE.Scene()
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 5
  
  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)
  
  // Geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshNormalMaterial()
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  
  // Resize handler
  window.addEventListener('resize', onResize)
}

const animate = () => {
  requestAnimationFrame(animate)
  
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  
  renderer.render(scene, camera)
}

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
</script>
```

---

### 2. Scroll-Driven 3D

```javascript
// Pattern: Control 3D with scroll
import { ScrollTrigger } from 'gsap/ScrollTrigger'

ScrollTrigger.create({
  trigger: '.three-section',
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    const progress = self.progress
    
    // Rotate mesh based on scroll
    mesh.rotation.y = progress * Math.PI * 2
    
    // Move camera
    camera.position.z = 5 - progress * 3
    
    // Change material color
    const hue = progress * 360
    mesh.material.color.setHSL(hue / 360, 0.7, 0.5)
  }
})
```

---

### 3. Particle System

```javascript
// Pattern: Animated particles
const particleCount = 1000
const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  size: 0.05,
  color: 0xffffff
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

// Animate
const animate = () => {
  particles.rotation.y += 0.001
  
  const positions = particles.geometry.attributes.position.array
  for (let i = 1; i < positions.length; i += 3) {
    positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01
  }
  particles.geometry.attributes.position.needsUpdate = true
}
```

---

## 🎨 RIVE ANIMATIONS {#rive}

### 1. Basic Integration

```javascript
// composables/useRive.js
import { useRive } from '@rive-app/canvas'

export const useRiveAnimation = (src, stateMachine) => {
  const canvas = ref(null)
  const rive = ref(null)
  
  onMounted(() => {
    rive.value = useRive({
      src,
      canvas: canvas.value,
      autoplay: true,
      stateMachines: stateMachine,
      onLoad: () => {
        rive.value.resizeDrawingSurfaceToCanvas()
      }
    })
  })
  
  return {
    canvas,
    rive,
    play: () => rive.value?.play(),
    pause: () => rive.value?.pause(),
    reset: () => rive.value?.reset()
  }
}
```

### 2. Audio-Reactive Rive

```javascript
// Pattern: Sync Rive with audio
const { canvas, rive } = useRiveAnimation('/animations/icon.riv', 'State Machine 1')

const audioController = useAudioController()

watch(() => audioController.isPlaying, (playing) => {
  if (playing) {
    rive.value?.play()
  } else {
    rive.value?.pause()
  }
})
```

---

## ⚡ PERFORMANCE OPTIMIZATION {#performance}

### 1. Animation Performance Tips

```javascript
// ✅ GOOD: Use transform and opacity (GPU accelerated)
gsap.to('.element', {
  x: 100,
  opacity: 0.5,
  duration: 1
})

// ❌ BAD: Use left/top (CPU intensive)
gsap.to('.element', {
  left: '100px',
  duration: 1
})

// ✅ GOOD: Use will-change for complex animations
.animated-element {
  will-change: transform, opacity;
}

// ✅ GOOD: Remove will-change after animation
element.addEventListener('animationend', () => {
  element.style.willChange = 'auto'
})
```

### 2. Lazy Loading Animations

```javascript
// Pattern: Only animate when in viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Start animation
      gsap.from(entry.target, {
        opacity: 0,
        y: 50,
        duration: 1
      })
      
      // Unobserve after animation
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.1 })

// Observe elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el)
})
```

### 3. Reduce Motion Preference

```javascript
// Pattern: Respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  // Disable or reduce animations
  gsap.globalTimeline.timeScale(0.1) // 10x faster
  // or
  gsap.set('.animated', { opacity: 1, y: 0 }) // Skip animations
} else {
  // Normal animations
  gsap.from('.animated', { opacity: 0, y: 50, duration: 1 })
}
```

---

## 💻 CODE EXAMPLES {#examples}

### Complete Hero Animation

```vue
<template>
  <section class="hero">
    <h1 class="hero-title">
      <span class="line">Transform</span>
      <span class="line">Your Body</span>
    </h1>
    <p class="hero-subtitle">Premium Fitness Experience</p>
    <button class="hero-cta">Get Started</button>
  </section>
</template>

<script setup>
import gsap from 'gsap'

onMounted(() => {
  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out'
    }
  })
  
  tl.from('.hero-title .line', {
      opacity: 0,
      y: 100,
      duration: 1.2,
      stagger: 0.2
    })
    .from('.hero-subtitle', {
      opacity: 0,
      y: 30,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-cta', {
      opacity: 0,
      scale: 0.8,
      duration: 0.6
    }, '-=0.4')
})
</script>

<style scoped lang="scss">
.hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &-title {
    font-size: clamp(48px, 8vw, 120px);
    font-weight: 700;
    text-align: center;
    
    .line {
      display: block;
      overflow: hidden;
    }
  }
}
</style>
```

---

## 📊 ANIMATION PERFORMANCE METRICS

### Target Metrics

```
Frame Rate: 60 FPS (16.67ms per frame)
Animation Duration: 0.3s - 1.5s (optimal)
Stagger Delay: 50ms - 200ms
Scroll Smoothness: < 100ms lag

Performance Budget:
├─ GSAP: ~30KB gzipped
├─ ScrollTrigger: ~15KB gzipped
├─ Lenis: ~5KB gzipped
├─ Three.js: ~150KB gzipped (if needed)
└─ Total: ~200KB max
```

---

## 🎯 BEST PRACTICES

### DO ✅
1. Use `transform` and `opacity` for animations
2. Enable `will-change` for complex animations
3. Use `requestAnimationFrame` for smooth loops
4. Respect `prefers-reduced-motion`
5. Lazy load heavy animations
6. Use GSAP's `defaults` for consistency
7. Clean up animations on unmount

### DON'T ❌
1. Animate `width`, `height`, `left`, `top`
2. Create too many simultaneous animations
3. Forget to kill timelines on unmount
4. Ignore mobile performance
5. Overuse `will-change`
6. Animate without easing
7. Block main thread with heavy calculations

---

## 📚 RESOURCES

### Documentation
- [GSAP Docs](https://greensock.com/docs/)
- [ScrollTrigger Demos](https://greensock.com/st-demos/)
- [Lenis GitHub](https://github.com/studio-freight/lenis)
- [Three.js Docs](https://threejs.org/docs/)
- [Rive Docs](https://rive.app/community/doc/)

### Learning
- [GSAP Learning](https://greensock.com/learning/)
- [Three.js Journey](https://threejs-journey.com/)
- [Creative Coding](https://www.youtube.com/c/TheCodingTrain)

---

**Created by:** Animation Analysis Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete  
**Next:** Apply to FitCity project
