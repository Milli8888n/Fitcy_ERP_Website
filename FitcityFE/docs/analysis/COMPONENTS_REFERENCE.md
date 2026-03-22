# PHIVE COMPONENTS REFERENCE GUIDE

> Quick reference cho các components chính của Phive website

---

## 🎨 UI COMPONENTS

### 1. Button Components

#### ButtonRoundVariable
```vue
<template>
  <button 
    :class="['btn-round', size, type]"
    :disabled="disabled"
  >
    <span class="bg"></span>
    <VariableLabel :text="label" />
  </button>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'primary' }, // primary | secondary
  size: { type: String, default: 'medium' },  // medium | large
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped lang="scss">
.btn-round {
  position: relative;
  border-radius: 100px;
  padding: 1rem 2rem;
  overflow: hidden;
  
  .bg {
    position: absolute;
    inset: 0;
    background: var(--button-bg);
    transition: transform 0.4s ease;
  }
  
  &:hover .bg {
    transform: scale(1.1);
  }
  
  &.primary {
    --button-bg: var(--color-yellow);
    color: var(--color-darkBrown);
  }
  
  &.secondary {
    --button-bg: transparent;
    border: 1px solid currentColor;
  }
}
</style>
```

#### CircleBtn (Icon Button)
```vue
<template>
  <button :class="['circle-btn', size]">
    <RiveAsset :src="icon" />
  </button>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'medium' }, // medium | large
  icon: { type: String, required: true }
})
</script>

<style scoped lang="scss">
.circle-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-yellow);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.large {
    width: 4rem;
    height: 4rem;
  }
}
</style>
```

---

### 2. Text Components

#### RollingTitle
```vue
<template>
  <h2 class="rolling-title">
    <span class="first">{{ text }}</span>
    <span class="last">{{ text }}</span>
  </h2>
</template>

<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  text: { type: String, required: true }
})

onMounted(() => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
  
  tl.from('.first', { 
    y: '100%', 
    duration: 1,
    ease: 'power3.out'
  })
  .to('.first', { 
    y: '-100%', 
    duration: 1,
    ease: 'power3.in'
  }, '+=2')
  .from('.last', { 
    y: '100%', 
    duration: 1,
    ease: 'power3.out'
  }, '-=1')
})
</script>

<style scoped lang="scss">
.rolling-title {
  position: relative;
  overflow: hidden;
  height: 1.2em;
  
  span {
    position: absolute;
    width: 100%;
    left: 0;
  }
}
</style>
```

#### VariableLabel (Hover Effect)
```vue
<template>
  <div 
    class="variable-label"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <span class="label-spacing">{{ text }}</span>
    <div class="inner">
      <span :class="['label', { hover }]">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  text: { type: String, required: true }
})

const hover = ref(false)
</script>

<style scoped lang="scss">
.label {
  font-variation-settings: "wdth" 0, "wght" 400;
  transition: font-variation-settings 0.75s cubic-bezier(0.075, 0.82, 0.165, 1);
  
  &.hover {
    font-variation-settings: "wdth" 10, "wght" 600;
    letter-spacing: -0.01em;
  }
}
</style>
```

---

### 3. Navigation Components

#### MenuGrid
```vue
<template>
  <div 
    class="menu-grid"
    :data-open="isOpen"
  >
    <span class="background"></span>
    
    <div class="container">
      <div class="menu-inner">
        <!-- Languages -->
        <div class="languages">
          <a 
            v-for="lang in languages" 
            :key="lang.code"
            :href="`/${lang.code}`"
          >
            {{ lang.name }}
          </a>
        </div>
        
        <!-- Main Menu -->
        <ul class="pages">
          <li v-for="page in pages" :key="page.slug">
            <a :href="page.slug">
              <VariableLabel :text="page.title" />
            </a>
            <CircleBtn 
              v-if="page.children"
              @click="openSubmenu(page)"
            />
          </li>
        </ul>
        
        <!-- CTA -->
        <div class="cta">
          <a href="https://join.phive.pt" target="_blank">
            <VariableLabel text="Join Phive" />
          </a>
        </div>
      </div>
    </div>
    
    <!-- Bar -->
    <Bar @toggle="isOpen = !isOpen" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const languages = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' }
]

const pages = [
  { slug: '/', title: 'Homepage' },
  { slug: '/clubs', title: 'Clubs', children: true },
  { slug: '/classes', title: 'Classes' },
  { slug: '/fitness-hub', title: 'Fitness Hub' },
  { slug: '/timetable', title: 'Timetable' }
]
</script>

<style scoped lang="scss">
.menu-grid {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  
  &[data-open="true"] {
    pointer-events: all;
    
    .background {
      opacity: 1;
    }
    
    .container {
      transform: translateY(0);
    }
  }
  
  .background {
    position: absolute;
    inset: 0;
    background: var(--color-darkBrown);
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  
  .container {
    position: relative;
    transform: translateY(-100%);
    transition: transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
}
</style>
```

#### Bar (Top Navigation)
```vue
<template>
  <div class="bar">
    <div class="left-col">
      <BurgerBtn @click="$emit('toggle')" />
    </div>
    
    <div class="center-col">
      <a href="/">
        <img src="/logo.svg" alt="Phive" />
      </a>
    </div>
    
    <div class="right-col">
      <SoundBtn />
    </div>
  </div>
</template>

<script setup>
defineEmits(['toggle'])
</script>

<style scoped lang="scss">
.bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  padding: 1rem var(--grid-padding);
  
  .center-col {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .right-col {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
```

---

## 📦 BLOCK COMPONENTS

### 1. HomeHeader (Hero Section)

```vue
<template>
  <section class="home-header">
    <!-- Carousel -->
    <div class="carousel">
      <Ribbon 
        v-for="(slide, index) in slides"
        :key="index"
        :text="slide.title"
        :subtitle="slide.subtitle"
        :cta="slide.cta"
        :active="currentSlide === index"
      />
    </div>
    
    <!-- Bullets -->
    <div class="bullets">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
      >
        <span class="progress"></span>
      </button>
    </div>
    
    <!-- Audio -->
    <audio ref="audioRef" :src="currentAudio"></audio>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudioController } from '~/composables/useAudioController'

const slides = [
  {
    title: 'Phive Porto',
    subtitle: "We're open!",
    cta: { text: 'Discover', url: '/clubs/porto' },
    audio: '/audio/porto.mp3'
  },
  // ... more slides
]

const currentSlide = ref(0)
const { playAudio } = useAudioController()

const currentAudio = computed(() => slides[currentSlide.value].audio)

let interval

onMounted(() => {
  // Auto-play carousel
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
    playAudio(currentAudio.value)
  }, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const goToSlide = (index) => {
  currentSlide.value = index
  playAudio(currentAudio.value)
}
</script>

<style scoped lang="scss">
.home-header {
  height: 100vh;
  position: relative;
  overflow: hidden;
  
  .bullets {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
    
    button {
      width: 3rem;
      height: 0.25rem;
      background: rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      
      .progress {
        position: absolute;
        inset: 0;
        background: var(--color-yellow);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 5s linear;
      }
      
      &.active .progress {
        transform: scaleX(1);
      }
    }
  }
}
</style>
```

---

### 2. PhiveClubs Component

```vue
<template>
  <section 
    class="phive-clubs"
    data-section-intersect="light"
  >
    <!-- Title -->
    <div class="title-row">
      <h2 class="title">
        {{ title }}
      </h2>
    </div>
    
    <!-- Photo Grid -->
    <div class="photos-grid">
      <div 
        v-for="(photo, index) in photos"
        :key="index"
        class="photo-container"
      >
        <img 
          v-if="photo"
          :src="photo.src"
          :alt="photo.alt"
          loading="lazy"
        />
      </div>
    </div>
    
    <!-- CTA -->
    <div class="call-to-action">
      <RollingTitle text="Phive" />
      <p class="subtitle">Choose your club</p>
      <div class="ctas">
        <ButtonRoundVariable 
          label="View all Clubs"
          @click="navigateTo('/clubs')"
        />
        <ButtonRoundVariable 
          type="secondary"
          label="Schedule a visit"
          @click="openModal('schedule-visit')"
        />
      </div>
    </div>
    
    <!-- Statistics -->
    <div class="statistics">
      <h3>What you can find at Phive Clubs</h3>
      <ul>
        <li v-for="feature in features" :key="feature">
          {{ feature }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const title = 'Phive has clubs located in Coimbra, Leiria, Lisbon, and Porto. Get to know each one!'

const photos = [
  { src: '/clubs/photo-1.jpg', alt: 'Club interior' },
  { src: '/clubs/photo-2.jpg', alt: 'Swimming pool' },
  // ... 30+ photos with some null for spacing
]

const features = [
  'Heated Indoor Swimming Pool',
  'Sauna, Turkish Bath and Jacuzzi',
  'Weight and cardio room',
  'Private Pilates Studio',
  'Group Classes'
]
</script>

<style scoped lang="scss">
.phive-clubs {
  padding: 4rem var(--grid-padding);
  
  .photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
    
    .photo-container {
      aspect-ratio: 480 / 690;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
    }
  }
  
  .call-to-action {
    text-align: center;
    margin: 4rem 0;
    
    .ctas {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }
  }
}
</style>
```

---

### 3. ClassesShowcase Component

```vue
<template>
  <section class="classes-showcase">
    <div class="title-row">
      <RollingTitle text="Classes" />
      <p class="description">
        The most exciting classes, created by top instructors. 
        No matter your goal, we can make it happen.
      </p>
    </div>
    
    <div class="classes-grid">
      <ClassCard
        v-for="classItem in classes"
        :key="classItem.id"
        :class-data="classItem"
      />
    </div>
  </section>
</template>

<script setup>
const classes = [
  {
    id: 1,
    name: 'Yoga',
    instructor: 'Maria Silva',
    duration: 60,
    intensity: 'Low',
    image: '/classes/yoga.jpg'
  },
  // ... more classes
]
</script>
```

---

### 4. PhiveApp Component

```vue
<template>
  <section class="phive-app">
    <!-- Background -->
    <div class="background">
      <picture>
        <source 
          media="(min-width: 1440px)" 
          srcset="/imgs/phive-app.jpg"
        />
        <source 
          media="(min-width: 743px)" 
          srcset="/imgs/phive-app-tablet.jpg"
        />
        <img 
          src="/imgs/phive-app-mobile.jpg" 
          alt="Phive App"
          loading="lazy"
        />
      </picture>
    </div>
    
    <!-- Content -->
    <div class="content">
      <h2>Phive App</h2>
      <p>
        Schedule and manage your classes, access your training plan, 
        book appointments, and much more!
      </p>
      <ul class="app-stores">
        <li>
          <a href="https://apps.apple.com/..." target="_blank">
            <img src="/imgs/apps/apple-download.svg" alt="App Store" />
          </a>
        </li>
        <li>
          <a href="https://play.google.com/..." target="_blank">
            <img src="/imgs/apps/google-download.svg" alt="Google Play" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.phive-app {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  
  .background {
    position: absolute;
    inset: 0;
    z-index: -1;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .content {
    max-width: 600px;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    
    .app-stores {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      
      img {
        height: 3rem;
      }
    }
  }
}
</style>
```

---

## 🎬 ANIMATION COMPONENTS

### 1. Ribbon (Infinite Scroll Text)

```vue
<template>
  <div class="ribbon" :style="{ '--loop-duration': `${duration}s` }">
    <div class="ribbon-inner">
      <div v-for="i in 3" :key="i" class="container">
        <h2 class="title">
          <span class="first">{{ text }}</span>
          <span class="last">{{ text }}</span>
        </h2>
        <div v-if="subtitle" class="ctas">
          <h3 class="subtitle">{{ subtitle }}</h3>
          <a v-if="cta" :href="cta.url" class="link">
            {{ cta.text }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  subtitle: String,
  cta: Object,
  duration: { type: Number, default: 10 }
})
</script>

<style scoped lang="scss">
.ribbon {
  overflow: hidden;
  
  .ribbon-inner {
    display: flex;
    animation: scroll var(--loop-duration) linear infinite;
    
    .container {
      flex-shrink: 0;
      width: 100vw;
    }
  }
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100vw);
  }
}
</style>
```

---

### 2. Curtain Transition

```vue
<template>
  <div class="curtain" ref="curtainRef">
    <span class="top"></span>
    <span class="line">
      <span class="inner"></span>
    </span>
    <span class="bottom"></span>
    <span class="full"></span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const curtainRef = ref(null)

const open = () => {
  const tl = gsap.timeline()
  
  tl.set('.top, .bottom', { scaleY: 0 })
    .to('.top', { 
      scaleY: 1, 
      transformOrigin: 'bottom', 
      duration: 0.6,
      ease: 'power3.out'
    })
    .to('.bottom', { 
      scaleY: 1, 
      transformOrigin: 'top', 
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3')
    .to('.line .inner', { 
      scaleX: 1, 
      duration: 0.4 
    }, '-=0.4')
}

const close = () => {
  const tl = gsap.timeline()
  
  tl.to('.line .inner', { scaleX: 0, duration: 0.4 })
    .to('.top', { scaleY: 0, duration: 0.6 }, '-=0.2')
    .to('.bottom', { scaleY: 0, duration: 0.6 }, '-=0.5')
}

defineExpose({ open, close })
</script>

<style scoped lang="scss">
.curtain {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  
  .top, .bottom {
    position: absolute;
    left: 0;
    right: 0;
    height: 50%;
    background: var(--color-darkBrown);
  }
  
  .top {
    top: 0;
  }
  
  .bottom {
    bottom: 0;
  }
  
  .line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    overflow: hidden;
    
    .inner {
      width: 100%;
      height: 100%;
      background: var(--color-yellow);
      transform: scaleX(0);
      transform-origin: left;
    }
  }
}
</style>
```

---

## 🔧 COMPOSABLES

### 1. useAudioController

```javascript
// composables/useAudioController.js
export const useAudioController = () => {
  const audioMap = new Map()
  const currentAudio = ref(null)
  
  const loadAudio = (slug, sources) => {
    const audio = new Audio()
    sources.forEach(src => {
      const source = document.createElement('source')
      source.src = src
      audio.appendChild(source)
    })
    audioMap.set(slug, audio)
  }
  
  const playAudio = (slug) => {
    // Stop current
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.currentTime = 0
    }
    
    // Play new
    const audio = audioMap.get(slug)
    if (audio) {
      audio.play()
      currentAudio.value = audio
    }
  }
  
  const stopAudio = () => {
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.currentTime = 0
    }
  }
  
  return {
    loadAudio,
    playAudio,
    stopAudio
  }
}
```

---

### 2. useSectionIntersect

```javascript
// composables/useSectionIntersect.js
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
    }, {
      threshold: 0.5,
      rootMargin: '-20% 0px'
    })
    
    sections.forEach(section => observer.observe(section))
    
    onUnmounted(() => observer.disconnect())
  })
  
  return {
    currentTheme
  }
}
```

---

### 3. useScroller (Lenis Integration)

```javascript
// composables/useScroller.js
import Lenis from '@studio-freight/lenis'

export const useScroller = () => {
  const lenis = ref(null)
  
  onMounted(() => {
    lenis.value = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2
    })
    
    function raf(time) {
      lenis.value.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)
  })
  
  const scrollTo = (target, options = {}) => {
    lenis.value?.scrollTo(target, options)
  }
  
  const stop = () => {
    lenis.value?.stop()
  }
  
  const start = () => {
    lenis.value?.start()
  }
  
  return {
    lenis,
    scrollTo,
    stop,
    start
  }
}
```

---

## 📱 RESPONSIVE UTILITIES

### Grid System Helper

```javascript
// composables/useGrid.js
export const useGrid = () => {
  const getColumnClass = (sizes) => {
    return Object.entries(sizes)
      .map(([breakpoint, cols]) => `${breakpoint}-${cols}`)
      .join(' ')
  }
  
  return {
    getColumnClass
  }
}

// Usage:
// const { getColumnClass } = useGrid()
// const classes = getColumnClass({
//   xxlarge: 6,
//   small: 8,
//   xsmall: 14
// })
// Result: "xxlarge-6 small-8 xsmall-14"
```

---

## 🎯 USAGE EXAMPLES

### Complete Page Example

```vue
<template>
  <Page 
    :slug="data.slug"
    :name="data.name"
    :metadata="data.metadata"
  >
    <PageBuilder :blocks="data.blocks" />
  </Page>
</template>

<script setup>
const route = useRoute()
const { data } = await useFetch('/cms/page', {
  query: {
    path: route.path,
    lang: 'en'
  }
})
</script>
```

---

**Tài liệu tham khảo nhanh này giúp bạn:**
- ✅ Hiểu cấu trúc từng component
- ✅ Copy/paste code mẫu để bắt đầu
- ✅ Học patterns và best practices
- ✅ Áp dụng vào dự án FitCity

**Next steps:** Bắt đầu xây dựng từng component một, test riêng lẻ trước khi tích hợp!
