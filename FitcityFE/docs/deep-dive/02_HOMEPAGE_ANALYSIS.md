# 🏠 HOMEPAGE ANALYSIS - PHIVE.PT

> Phân tích chi tiết từng section của homepage Phive.pt

---

## 📋 TABLE OF CONTENTS

1. [Homepage Structure](#structure)
2. [Hero Section](#hero)
3. [Clubs Grid](#clubs)
4. [Classes Section](#classes)
5. [App Section](#app)
6. [Footer](#footer)
7. [Implementation Guide](#implementation)

---

## 🎯 HOMEPAGE STRUCTURE {#structure}

### Overall Layout

```
┌─────────────────────────────────────────────────────────────┐
│                      HOMEPAGE LAYOUT                         │
└─────────────────────────────────────────────────────────────┘

Section 1: HERO (100vh)
├─ Rolling Title Animation
├─ Background Video/Image
├─ CTA Button
└─ Scroll Indicator

Section 2: INTRO TEXT (Auto height)
├─ Large Typography
├─ Fade-in Animation
└─ Scroll Trigger

Section 3: CLUBS GRID (Auto height)
├─ Grid Layout (16 columns)
├─ Club Cards
├─ Hover Effects
└─ Filter System

Section 4: CLASSES CAROUSEL (Auto height)
├─ Horizontal Scroll
├─ Class Cards
├─ Drag Interaction
└─ Progress Indicator

Section 5: APP SHOWCASE (100vh)
├─ Phone Mockup
├─ Parallax Effect
├─ Feature List
└─ Download CTAs

Section 6: FOOTER (Auto height)
├─ Navigation Links
├─ Social Media
├─ Newsletter Signup
└─ Legal Links
```

### Page Flow

```javascript
// Page structure
const pageStructure = {
  sections: [
    {
      id: 'hero',
      height: '100vh',
      backgroundColor: 'var(--color-yellow)',
      scrollBehavior: 'pin'
    },
    {
      id: 'intro',
      height: 'auto',
      backgroundColor: 'var(--color-yellow)',
      scrollBehavior: 'fade-in'
    },
    {
      id: 'clubs',
      height: 'auto',
      backgroundColor: 'var(--color-darkBrown)',
      scrollBehavior: 'stagger'
    },
    {
      id: 'classes',
      height: 'auto',
      backgroundColor: 'var(--color-yellow)',
      scrollBehavior: 'horizontal-scroll'
    },
    {
      id: 'app',
      height: '100vh',
      backgroundColor: 'var(--color-darkBrown)',
      scrollBehavior: 'parallax'
    },
    {
      id: 'footer',
      height: 'auto',
      backgroundColor: 'var(--color-darkBrown)',
      scrollBehavior: 'none'
    }
  ]
}
```

---

## 🎬 HERO SECTION {#hero}

### Structure

```vue
<template>
  <section class="hero" data-section="hero">
    <!-- Background -->
    <div class="hero-bg">
      <video autoplay loop muted playsinline>
        <source src="/videos/hero.mp4" type="video/mp4">
      </video>
    </div>
    
    <!-- Content -->
    <div class="hero-content">
      <!-- Rolling Title -->
      <h1 class="hero-title rolling-title">
        <span class="first">It's not just fitness.</span>
        <span class="last">It's living fully</span>
      </h1>
      
      <!-- CTA -->
      <ButtonVariable 
        label="Explore Clubs"
        @click="scrollToClubs"
      />
    </div>
    
    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <span class="label">Scroll</span>
      <div class="arrow"></div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroRef = ref(null)

onMounted(() => {
  // Pin hero while animating
  ScrollTrigger.create({
    trigger: heroRef.value,
    start: 'top top',
    end: '+=100%',
    pin: true,
    scrub: 1
  })
  
  // Fade out content on scroll
  gsap.to('.hero-content', {
    opacity: 0,
    y: -50,
    scrollTrigger: {
      trigger: heroRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  
  // Rolling title animation
  animateRollingTitle('.rolling-title')
})

const animateRollingTitle = (selector) => {
  const element = document.querySelector(selector)
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
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-yellow);
  
  &-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.3;
    }
  }
  
  &-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
  }
  
  &-title {
    font-size: clamp(114px, 46.725px + 100vw * .1725, 340px);
    font-variation-settings: "wdth" 0, "wght" 400;
    line-height: 1em;
    letter-spacing: -0.02em;
    text-align: center;
    overflow: hidden;
    
    span {
      display: block;
      overflow: hidden;
    }
  }
  
  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    
    .arrow {
      width: 2px;
      height: 40px;
      background: var(--color-darkBrown);
      animation: scrollDown 2s ease-in-out infinite;
    }
  }
}

@keyframes scrollDown {
  0%, 100% {
    transform: translateY(0);
    opacity: 0;
  }
  50% {
    transform: translateY(20px);
    opacity: 1;
  }
}
</style>
```

### Key Features

**1. Rolling Title Animation**
- Alternates between two phrases
- Smooth slide-in/slide-out
- 2-second pause between transitions
- Infinite loop

**2. Background Video**
- Autoplay, loop, muted
- Low opacity (30%)
- Cover object-fit
- Fallback to image

**3. Scroll Pin**
- Pins section while scrolling
- Fades out content
- Smooth transition to next section

---

## 🏢 CLUBS GRID {#clubs}

### Structure

```vue
<template>
  <section class="clubs" data-section="clubs">
    <div class="row">
      <div class="col">
        <!-- Header -->
        <div class="clubs-header">
          <h2 class="title">Our Clubs</h2>
          <p class="subtitle">Find your perfect location</p>
        </div>
        
        <!-- Grid -->
        <div class="clubs-grid">
          <ClubCard
            v-for="club in clubs"
            :key="club.id"
            :club="club"
            @click="openClub(club)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const clubs = ref([
  {
    id: 1,
    name: 'Amoreiras',
    image: '/images/clubs/amoreiras.jpg',
    location: 'Lisbon',
    amenities: ['Pool', 'Sauna', 'Classes']
  },
  // ... more clubs
])

onMounted(() => {
  // Stagger animation for cards
  gsap.from('.clubs-grid .club-card', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: {
      amount: 1.2,
      from: 'start'
    },
    scrollTrigger: {
      trigger: '.clubs-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })
})
</script>

<style scoped lang="scss">
.clubs {
  background-color: var(--color-darkBrown);
  color: var(--color-yellow);
  padding: 5rem 0;
  
  &-header {
    text-align: center;
    margin-bottom: 4rem;
    
    .title {
      font-size: clamp(68px, 46.55px + 100vw * .055, 140px);
      margin-bottom: 1rem;
    }
    
    .subtitle {
      font-size: clamp(18px, 16.791px + 100vw * .0031, 22px);
      opacity: 0.7;
    }
  }
  
  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
}
</style>
```

### Club Card Component

```vue
<!-- components/ClubCard.vue -->
<template>
  <article class="club-card" @click="handleClick">
    <!-- Image -->
    <div class="card-image">
      <img :src="club.image" :alt="club.name">
    </div>
    
    <!-- Content -->
    <div class="card-content">
      <h3 class="card-title">{{ club.name }}</h3>
      <p class="card-location">{{ club.location }}</p>
      
      <!-- Amenities -->
      <ul class="card-amenities">
        <li v-for="amenity in club.amenities" :key="amenity">
          {{ amenity }}
        </li>
      </ul>
    </div>
    
    <!-- Hover Overlay -->
    <div class="card-overlay">
      <span class="cta">Explore</span>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  club: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.club)
}
</script>

<style scoped lang="scss">
.club-card {
  position: relative;
  border: 1px solid rgba(255, 224, 0, 0.5);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-yellow);
    transform: translateY(-5px);
    
    .card-overlay {
      opacity: 1;
    }
    
    .card-image img {
      transform: scale(1.05);
    }
  }
  
  &-image {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }
  
  &-content {
    padding: 1.5rem;
  }
  
  &-title {
    font-size: clamp(20px, 17.036px + 100vw * .0076, 30px);
    margin-bottom: 0.5rem;
  }
  
  &-location {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 1rem;
  }
  
  &-amenities {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    
    li {
      font-size: 12px;
      padding: 0.25rem 0.5rem;
      background: rgba(255, 224, 0, 0.1);
      border-radius: 4px;
    }
  }
  
  &-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(22, 16, 3, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .cta {
      font-size: 24px;
      color: var(--color-yellow);
    }
  }
}
</style>
```

---

## 📚 CLASSES SECTION {#classes}

### Horizontal Scroll Implementation

```vue
<template>
  <section class="classes" data-section="classes">
    <div class="row">
      <div class="col">
        <!-- Header -->
        <div class="classes-header">
          <h2 class="title">Classes</h2>
          <p class="subtitle">Find your rhythm</p>
        </div>
        
        <!-- Horizontal Scroll Container -->
        <div 
          ref="scrollContainer"
          class="classes-scroll"
          @mousedown="startDrag"
          @mousemove="drag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
        >
          <div class="classes-inner" :style="{ transform: `translateX(${scrollX}px)` }">
            <ClassCard
              v-for="classItem in classes"
              :key="classItem.id"
              :class-item="classItem"
            />
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="scroll-progress">
          <div class="progress-bar" :style="{ width: `${scrollProgress}%` }"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const scrollContainer = ref(null)
const scrollX = ref(0)
const scrollProgress = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const classes = ref([
  {
    id: 1,
    name: 'Yoga Flow',
    instructor: 'Maria Silva',
    duration: '60 min',
    level: 'All Levels',
    image: '/images/classes/yoga.jpg'
  },
  // ... more classes
])

const startDrag = (e) => {
  isDragging.value = true
  startX.value = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft.value = scrollX.value
}

const drag = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX.value) * 2 // Scroll speed multiplier
  scrollX.value = scrollLeft.value + walk
  
  // Clamp scroll
  const maxScroll = -(scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth)
  scrollX.value = Math.max(maxScroll, Math.min(0, scrollX.value))
  
  // Update progress
  updateProgress()
}

const endDrag = () => {
  isDragging.value = false
}

const updateProgress = () => {
  const maxScroll = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth
  scrollProgress.value = Math.abs(scrollX.value) / maxScroll * 100
}

onMounted(() => {
  // GSAP horizontal scroll
  gsap.to('.classes-inner', {
    x: () => -(scrollContainer.value.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: '.classes',
      start: 'top top',
      end: () => `+=${scrollContainer.value.scrollWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  })
})
</script>

<style scoped lang="scss">
.classes {
  background-color: var(--color-yellow);
  padding: 5rem 0;
  
  &-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  &-scroll {
    overflow: hidden;
    cursor: grab;
    
    &:active {
      cursor: grabbing;
    }
  }
  
  &-inner {
    display: flex;
    gap: 2rem;
    will-change: transform;
  }
  
  .scroll-progress {
    margin-top: 2rem;
    height: 4px;
    background: rgba(22, 16, 3, 0.1);
    border-radius: 2px;
    
    .progress-bar {
      height: 100%;
      background: var(--color-darkBrown);
      border-radius: 2px;
      transition: width 0.1s ease;
    }
  }
}
</style>
```

---

## 📱 APP SECTION {#app}

### Parallax Phone Mockup

```vue
<template>
  <section class="app" data-section="app">
    <div class="row align-middle">
      <!-- Left: Phone Mockup -->
      <div class="col large-6">
        <div ref="phoneRef" class="phone-mockup">
          <img src="/images/phone-frame.png" alt="Phone" class="phone-frame">
          <div class="phone-screen">
            <img 
              ref="screenRef"
              src="/images/app-screen.jpg" 
              alt="App Screen"
              class="screen-content"
            >
          </div>
        </div>
      </div>
      
      <!-- Right: Features -->
      <div class="col large-6">
        <div class="app-content">
          <h2 class="title">Your fitness journey, in your pocket</h2>
          
          <ul class="features">
            <li v-for="feature in features" :key="feature.id">
              <div class="feature-icon">
                <Icon :name="feature.icon" />
              </div>
              <div class="feature-text">
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </li>
          </ul>
          
          <!-- Download Buttons -->
          <div class="download-buttons">
            <a href="#" class="download-btn">
              <img src="/images/app-store.svg" alt="App Store">
            </a>
            <a href="#" class="download-btn">
              <img src="/images/google-play.svg" alt="Google Play">
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const phoneRef = ref(null)
const screenRef = ref(null)

const features = ref([
  {
    id: 1,
    icon: 'calendar',
    title: 'Book Classes',
    description: 'Reserve your spot in advance'
  },
  {
    id: 2,
    icon: 'chart',
    title: 'Track Progress',
    description: 'Monitor your fitness journey'
  },
  {
    id: 3,
    icon: 'users',
    title: 'Connect',
    description: 'Join a community of members'
  }
])

onMounted(() => {
  // Parallax effect on phone
  gsap.to(phoneRef.value, {
    y: -100,
    scrollTrigger: {
      trigger: '.app',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
  
  // Parallax effect on screen (faster)
  gsap.to(screenRef.value, {
    y: -150,
    scrollTrigger: {
      trigger: '.app',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
  
  // Stagger features
  gsap.from('.features li', {
    opacity: 0,
    x: -50,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.features',
      start: 'top 80%'
    }
  })
})
</script>

<style scoped lang="scss">
.app {
  background-color: var(--color-darkBrown);
  color: var(--color-yellow);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 5rem 0;
  
  .phone-mockup {
    position: relative;
    max-width: 400px;
    margin: 0 auto;
    
    .phone-frame {
      width: 100%;
      position: relative;
      z-index: 2;
    }
    
    .phone-screen {
      position: absolute;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 90%;
      overflow: hidden;
      border-radius: 30px;
      
      .screen-content {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  
  .app-content {
    .title {
      font-size: clamp(48px, 39.654px + 100vw * .0214, 76px);
      margin-bottom: 3rem;
    }
    
    .features {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 3rem;
      
      li {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }
      
      .feature-icon {
        width: 48px;
        height: 48px;
        background: var(--color-yellow);
        color: var(--color-darkBrown);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .feature-text {
        h3 {
          font-size: 20px;
          margin-bottom: 0.5rem;
        }
        
        p {
          font-size: 14px;
          opacity: 0.7;
        }
      }
    }
    
    .download-buttons {
      display: flex;
      gap: 1rem;
      
      .download-btn {
        img {
          height: 50px;
        }
      }
    }
  }
}
</style>
```

---

## 🦶 FOOTER {#footer}

### Structure

```vue
<template>
  <footer class="footer">
    <div class="row">
      <div class="col">
        <!-- Top Section -->
        <div class="footer-top">
          <!-- Logo -->
          <div class="footer-logo">
            <Logo />
          </div>
          
          <!-- Navigation -->
          <nav class="footer-nav">
            <div class="nav-column">
              <h4>Clubs</h4>
              <ul>
                <li v-for="club in clubs" :key="club.id">
                  <NuxtLink :to="`/clubs/${club.slug}`">
                    {{ club.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
            
            <div class="nav-column">
              <h4>Classes</h4>
              <ul>
                <li><NuxtLink to="/classes">All Classes</NuxtLink></li>
                <li><NuxtLink to="/schedule">Schedule</NuxtLink></li>
              </ul>
            </div>
            
            <div class="nav-column">
              <h4>About</h4>
              <ul>
                <li><NuxtLink to="/about">Our Story</NuxtLink></li>
                <li><NuxtLink to="/careers">Careers</NuxtLink></li>
                <li><NuxtLink to="/contact">Contact</NuxtLink></li>
              </ul>
            </div>
          </nav>
          
          <!-- Newsletter -->
          <div class="footer-newsletter">
            <h4>Stay Updated</h4>
            <form @submit.prevent="subscribe">
              <input 
                v-model="email"
                type="email" 
                placeholder="Your email"
                required
              >
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
        <!-- Bottom Section -->
        <div class="footer-bottom">
          <!-- Social -->
          <div class="footer-social">
            <a href="#" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
            <a href="#" aria-label="Facebook">
              <Icon name="facebook" />
            </a>
            <a href="#" aria-label="Twitter">
              <Icon name="twitter" />
            </a>
          </div>
          
          <!-- Legal -->
          <div class="footer-legal">
            <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms">Terms of Service</NuxtLink>
            <span>© 2026 FitCity. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const email = ref('')

const clubs = ref([
  { id: 1, name: 'Downtown', slug: 'downtown' },
  { id: 2, name: 'Uptown', slug: 'uptown' },
  { id: 3, name: 'Westside', slug: 'westside' }
])

const subscribe = async () => {
  // Handle newsletter subscription
  console.log('Subscribe:', email.value)
}
</script>

<style scoped lang="scss">
.footer {
  background-color: var(--color-darkBrown);
  color: var(--color-yellow);
  padding: 5rem 0 2rem;
  
  &-top {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid rgba(255, 224, 0, 0.1);
  }
  
  &-logo {
    svg {
      width: 150px;
    }
  }
  
  &-nav {
    display: contents;
    
    .nav-column {
      h4 {
        font-size: 18px;
        margin-bottom: 1rem;
      }
      
      ul {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        a {
          font-size: 14px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
          
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
  
  &-newsletter {
    h4 {
      font-size: 18px;
      margin-bottom: 1rem;
    }
    
    form {
      display: flex;
      gap: 0.5rem;
      
      input {
        flex: 1;
        padding: 0.75rem 1rem;
        background: rgba(255, 224, 0, 0.1);
        border: 1px solid rgba(255, 224, 0, 0.3);
        color: var(--color-yellow);
        
        &::placeholder {
          color: rgba(255, 224, 0, 0.5);
        }
      }
      
      button {
        padding: 0.75rem 1.5rem;
        background: var(--color-yellow);
        color: var(--color-darkBrown);
        font-weight: 600;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
  
  &-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  &-social {
    display: flex;
    gap: 1rem;
    
    a {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 224, 0, 0.3);
      border-radius: 50%;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--color-yellow);
        color: var(--color-darkBrown);
        border-color: var(--color-yellow);
      }
    }
  }
  
  &-legal {
    display: flex;
    gap: 2rem;
    font-size: 12px;
    opacity: 0.7;
    
    a {
      transition: opacity 0.3s ease;
      
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
```

---

## 🚀 IMPLEMENTATION GUIDE {#implementation}

### Step-by-Step Build Order

**Week 1: Foundation**
```
Day 1-2: Hero Section
├─ Background video/image
├─ Rolling title animation
├─ CTA button
└─ Scroll indicator

Day 3-4: Intro Section
├─ Large typography
├─ Fade-in animation
└─ Scroll trigger setup

Day 5-7: Testing & Polish
├─ Responsive design
├─ Performance optimization
└─ Cross-browser testing
```

**Week 2: Content Sections**
```
Day 1-3: Clubs Grid
├─ Grid layout
├─ Club cards
├─ Hover effects
└─ Stagger animations

Day 4-5: Classes Carousel
├─ Horizontal scroll
├─ Drag interaction
├─ Progress indicator
└─ GSAP integration

Day 6-7: Testing & Polish
```

**Week 3: App & Footer**
```
Day 1-3: App Section
├─ Phone mockup
├─ Parallax effects
├─ Feature list
└─ Download CTAs

Day 4-5: Footer
├─ Navigation
├─ Newsletter form
├─ Social links
└─ Legal links

Day 6-7: Final Testing
├─ Full page flow
├─ Performance audit
└─ Accessibility check
```

### Performance Checklist

```javascript
// Performance targets
const performanceTargets = {
  // Lighthouse scores
  performance: 90,
  accessibility: 95,
  bestPractices: 95,
  seo: 95,
  
  // Core Web Vitals
  LCP: 2.5, // Largest Contentful Paint (seconds)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift
  
  // Bundle sizes
  initialJS: 200, // KB
  initialCSS: 50,  // KB
  
  // Images
  heroImage: 500,  // KB (WebP)
  clubImages: 100, // KB each (WebP)
  
  // Fonts
  totalFonts: 100  // KB
}
```

### Accessibility Checklist

```html
<!-- ✅ Semantic HTML -->
<header>
  <nav aria-label="Main navigation">
    <!-- ... -->
  </nav>
</header>

<main>
  <section aria-labelledby="hero-title">
    <h1 id="hero-title"><!-- ... --></h1>
  </section>
</main>

<!-- ✅ ARIA labels -->
<button aria-label="Open menu">
  <BurgerIcon />
</button>

<!-- ✅ Skip links -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- ✅ Focus management -->
<style>
:focus-visible {
  outline: 2px solid var(--color-yellow);
  outline-offset: 4px;
}
</style>

<!-- ✅ Alt text -->
<img 
  src="/images/club.jpg" 
  alt="Modern gym interior with equipment"
>

<!-- ✅ Color contrast -->
<!-- Ensure 4.5:1 ratio for normal text -->
<!-- Ensure 3:1 ratio for large text -->
```

---

## 📊 SECTION BREAKDOWN

### Component Count

```
Hero Section:
├─ 1 Video/Image component
├─ 1 Rolling Title component
├─ 1 Button component
└─ 1 Scroll Indicator component
Total: 4 components

Clubs Section:
├─ 1 Header component
├─ 1 Grid container
└─ N Club Card components
Total: 2 + N components

Classes Section:
├─ 1 Header component
├─ 1 Scroll container
├─ N Class Card components
└─ 1 Progress Bar component
Total: 3 + N components

App Section:
├─ 1 Phone Mockup component
├─ 1 Feature List component
└─ 2 Download Button components
Total: 4 components

Footer:
├─ 1 Logo component
├─ 3 Nav Column components
├─ 1 Newsletter Form component
├─ 1 Social Links component
└─ 1 Legal Links component
Total: 8 components

GRAND TOTAL: ~25-30 components
```

---

**Created by:** Homepage Analysis Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete  
**Next:** Apply to FitCity homepage
