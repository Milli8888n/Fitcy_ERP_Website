# 🏢 CLUBS PAGE ANALYSIS - PHIVE.PT

> Deep dive into Clubs listing and detail page architecture

---

## 📋 TABLE OF CONTENTS

1. [Page Structure](#structure)
2. [Clubs Listing](#listing)
3. [Club Detail Page](#detail)
4. [Filter & Search](#filter)
5. [Map Integration](#map)
6. [Implementation Guide](#implementation)

---

## 🏗️ PAGE STRUCTURE {#structure}

### URL Pattern

```
/en/clubs              → Clubs listing
/en/clubs/amoreiras    → Club detail
/en/clubs/campo-grande → Club detail
/en/clubs/colombo      → Club detail
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CLUBS PAGE FLOW                           │
└─────────────────────────────────────────────────────────────┘

USER REQUEST
    ↓
NUXT ROUTER
    ↓
FETCH CLUBS DATA (Sanity CMS)
    ↓
RENDER LISTING/DETAIL
    ↓
APPLY FILTERS (Client-side)
    ↓
DISPLAY RESULTS
```

---

## 📋 CLUBS LISTING PAGE {#listing}

### Page Layout

```vue
<!-- pages/clubs/index.vue -->
<template>
  <div class="clubs-page">
    <!-- Hero Section -->
    <section class="clubs-hero">
      <div class="row">
        <div class="col">
          <h1 class="hero-title">
            <span class="first">Find your</span>
            <span class="last">perfect club</span>
          </h1>
          
          <p class="hero-subtitle">
            {{ totalClubs }} locations across Portugal
          </p>
        </div>
      </div>
    </section>
    
    <!-- Filter Bar -->
    <section class="clubs-filters">
      <div class="row">
        <div class="col">
          <ClubFilters
            v-model:city="selectedCity"
            v-model:amenities="selectedAmenities"
            :cities="cities"
            :amenities="amenities"
          />
        </div>
      </div>
    </section>
    
    <!-- Clubs Grid -->
    <section class="clubs-grid">
      <div class="row">
        <div class="col">
          <!-- Grid Layout -->
          <div class="grid">
            <ClubCard
              v-for="club in filteredClubs"
              :key="club._id"
              :club="club"
              @click="navigateToClub(club.slug)"
            />
          </div>
          
          <!-- Empty State -->
          <div v-if="filteredClubs.length === 0" class="empty-state">
            <p>No clubs found matching your criteria</p>
            <button @click="clearFilters">Clear Filters</button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Map Section -->
    <section class="clubs-map">
      <div class="row">
        <div class="col">
          <ClubsMap
            :clubs="filteredClubs"
            :selected-club="selectedClub"
            @select="handleClubSelect"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useSanityQuery } from '@nuxtjs/sanity/composables'

// SEO
useHead({
  title: 'Our Clubs | FitCity',
  meta: [
    {
      name: 'description',
      content: 'Find your perfect fitness club across Portugal. Premium facilities, expert trainers, and a community that motivates.'
    }
  ]
})

// Fetch clubs data
const query = groq`*[_type == "club"] | order(name.en asc) {
  _id,
  name,
  slug,
  "image": images[0].asset->url,
  location {
    city,
    address,
    coordinates
  },
  amenities[] {
    name,
    icon
  },
  schedule {
    weekdays,
    weekends
  },
  description
}`

const { data: clubs } = await useSanityQuery(query)

// Filters
const selectedCity = ref('all')
const selectedAmenities = ref([])
const selectedClub = ref(null)

// Computed
const cities = computed(() => {
  const uniqueCities = [...new Set(clubs.value.map(c => c.location.city))]
  return ['all', ...uniqueCities]
})

const amenities = computed(() => {
  const allAmenities = clubs.value.flatMap(c => c.amenities)
  const uniqueAmenities = [...new Map(
    allAmenities.map(a => [a.icon, a])
  ).values()]
  return uniqueAmenities
})

const filteredClubs = computed(() => {
  let filtered = clubs.value
  
  // Filter by city
  if (selectedCity.value !== 'all') {
    filtered = filtered.filter(c => c.location.city === selectedCity.value)
  }
  
  // Filter by amenities
  if (selectedAmenities.value.length > 0) {
    filtered = filtered.filter(club => {
      return selectedAmenities.value.every(amenity => {
        return club.amenities.some(a => a.icon === amenity)
      })
    })
  }
  
  return filtered
})

const totalClubs = computed(() => clubs.value.length)

// Methods
const navigateToClub = (slug) => {
  navigateTo(`/clubs/${slug.current}`)
}

const clearFilters = () => {
  selectedCity.value = 'all'
  selectedAmenities.value = []
}

const handleClubSelect = (club) => {
  selectedClub.value = club
}

// Animations
onMounted(() => {
  // Stagger animation for club cards
  gsap.from('.club-card', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: {
      amount: 1.2,
      from: 'start',
      grid: 'auto'
    },
    scrollTrigger: {
      trigger: '.clubs-grid',
      start: 'top 80%'
    }
  })
})
</script>

<style scoped lang="scss">
.clubs-page {
  background: var(--color-darkBrown);
  color: var(--color-yellow);
}

.clubs-hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 0;
  
  .hero-title {
    font-size: clamp(68px, 46.55px + 100vw * .055, 140px);
    line-height: 1em;
    margin-bottom: 1rem;
    
    span {
      display: block;
    }
  }
  
  .hero-subtitle {
    font-size: clamp(18px, 16.791px + 100vw * .0031, 22px);
    opacity: 0.7;
  }
}

.clubs-filters {
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255, 224, 0, 0.1);
}

.clubs-grid {
  padding: 5rem 0;
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    
    @media (max-width: 743px) {
      grid-template-columns: 1fr;
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 5rem 0;
    
    p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.7;
    }
    
    button {
      padding: 1rem 2rem;
      background: var(--color-yellow);
      color: var(--color-darkBrown);
      font-weight: 600;
      border-radius: 4px;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.clubs-map {
  padding: 5rem 0;
}
</style>
```

### Filter Component

```vue
<!-- components/ClubFilters.vue -->
<template>
  <div class="club-filters">
    <!-- City Filter -->
    <div class="filter-group">
      <label for="city-filter">City</label>
      <select
        id="city-filter"
        :value="city"
        @change="$emit('update:city', $event.target.value)"
      >
        <option
          v-for="cityOption in cities"
          :key="cityOption"
          :value="cityOption"
        >
          {{ cityOption === 'all' ? 'All Cities' : cityOption }}
        </option>
      </select>
    </div>
    
    <!-- Amenities Filter -->
    <div class="filter-group">
      <label>Amenities</label>
      <div class="amenities-list">
        <button
          v-for="amenity in amenities"
          :key="amenity.icon"
          :class="['amenity-btn', { active: isSelected(amenity.icon) }]"
          @click="toggleAmenity(amenity.icon)"
        >
          <Icon :name="amenity.icon" />
          <span>{{ getLocaleValue(amenity.name) }}</span>
        </button>
      </div>
    </div>
    
    <!-- Clear Button -->
    <button
      v-if="hasActiveFilters"
      class="clear-btn"
      @click="clearAll"
    >
      Clear All
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  city: String,
  amenities: Array,
  cities: Array,
  amenities: Array
})

const emit = defineEmits(['update:city', 'update:amenities'])

const { getLocaleValue } = useLocaleContent()

const isSelected = (amenityIcon) => {
  return props.amenities.includes(amenityIcon)
}

const toggleAmenity = (amenityIcon) => {
  const newAmenities = [...props.amenities]
  const index = newAmenities.indexOf(amenityIcon)
  
  if (index > -1) {
    newAmenities.splice(index, 1)
  } else {
    newAmenities.push(amenityIcon)
  }
  
  emit('update:amenities', newAmenities)
}

const clearAll = () => {
  emit('update:city', 'all')
  emit('update:amenities', [])
}

const hasActiveFilters = computed(() => {
  return props.city !== 'all' || props.amenities.length > 0
})
</script>

<style scoped lang="scss">
.club-filters {
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  flex-wrap: wrap;
  
  .filter-group {
    flex: 1;
    min-width: 200px;
    
    label {
      display: block;
      font-size: 14px;
      margin-bottom: 0.5rem;
      opacity: 0.7;
    }
    
    select {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 224, 0, 0.1);
      border: 1px solid rgba(255, 224, 0, 0.3);
      color: var(--color-yellow);
      border-radius: 4px;
      font-size: 16px;
      
      &:focus {
        outline: none;
        border-color: var(--color-yellow);
      }
    }
  }
  
  .amenities-list {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    
    .amenity-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 224, 0, 0.1);
      border: 1px solid rgba(255, 224, 0, 0.3);
      color: var(--color-yellow);
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 224, 0, 0.2);
      }
      
      &.active {
        background: var(--color-yellow);
        color: var(--color-darkBrown);
        border-color: var(--color-yellow);
      }
    }
  }
  
  .clear-btn {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 1px solid rgba(255, 224, 0, 0.3);
    color: var(--color-yellow);
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 224, 0, 0.1);
    }
  }
}
</style>
```

---

## 🏢 CLUB DETAIL PAGE {#detail}

### Page Structure

```vue
<!-- pages/clubs/[slug].vue -->
<template>
  <div class="club-detail">
    <!-- Hero Section -->
    <section class="club-hero">
      <div class="hero-image">
        <img
          :src="getImageUrl(club.images[0], { width: 2400 })"
          :alt="getLocaleValue(club.name)"
        >
      </div>
      
      <div class="hero-content">
        <div class="row">
          <div class="col">
            <h1 class="club-name">{{ getLocaleValue(club.name) }}</h1>
            <p class="club-location">
              <Icon name="location" />
              {{ club.location.city }}
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Info Section -->
    <section class="club-info">
      <div class="row">
        <div class="col large-8">
          <!-- Description -->
          <div class="club-description">
            <h2>About This Club</h2>
            <p>{{ getLocaleValue(club.description) }}</p>
          </div>
          
          <!-- Amenities -->
          <div class="club-amenities">
            <h2>Amenities</h2>
            <ul class="amenities-grid">
              <li
                v-for="amenity in club.amenities"
                :key="amenity.icon"
                class="amenity-item"
              >
                <Icon :name="amenity.icon" />
                <span>{{ getLocaleValue(amenity.name) }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Schedule -->
          <div class="club-schedule">
            <h2>Opening Hours</h2>
            <dl>
              <dt>Monday - Friday</dt>
              <dd>{{ club.schedule.weekdays }}</dd>
              
              <dt>Saturday - Sunday</dt>
              <dd>{{ club.schedule.weekends }}</dd>
            </dl>
          </div>
        </div>
        
        <div class="col large-4">
          <!-- Contact Card -->
          <div class="contact-card">
            <h3>Visit Us</h3>
            
            <div class="contact-item">
              <Icon name="location" />
              <div>
                <p>{{ getLocaleValue(club.location.address) }}</p>
                <p>{{ club.location.city }}</p>
              </div>
            </div>
            
            <div class="contact-item">
              <Icon name="phone" />
              <a :href="`tel:${club.phone}`">{{ club.phone }}</a>
            </div>
            
            <div class="contact-item">
              <Icon name="email" />
              <a :href="`mailto:${club.email}`">{{ club.email }}</a>
            </div>
            
            <button class="cta-btn">
              Book a Tour
            </button>
          </div>
          
          <!-- Map -->
          <div class="club-map">
            <ClubMap :coordinates="club.location.coordinates" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Gallery Section -->
    <section class="club-gallery">
      <div class="row">
        <div class="col">
          <h2>Gallery</h2>
          <ClubGallery :images="club.images" />
        </div>
      </div>
    </section>
    
    <!-- Classes Section -->
    <section class="club-classes">
      <div class="row">
        <div class="col">
          <h2>Classes at {{ getLocaleValue(club.name) }}</h2>
          <ClassesCarousel :classes="club.classes" />
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="club-cta">
      <div class="row">
        <div class="col">
          <h2>Ready to start your journey?</h2>
          <p>Join {{ getLocaleValue(club.name) }} today</p>
          <button class="cta-btn-large">
            Get Started
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useSanityQuery } from '@nuxtjs/sanity/composables'

const route = useRoute()
const { getLocaleValue } = useLocaleContent()
const { getImageUrl } = useSanityImage()

// Fetch club data
const query = groq`*[_type == "club" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  "images": images[].asset->url,
  location {
    address,
    city,
    coordinates
  },
  amenities[] {
    name,
    icon
  },
  schedule {
    weekdays,
    weekends
  },
  description,
  phone,
  email,
  "classes": *[_type == "classType" && references(^._id)] {
    _id,
    name,
    slug,
    "image": image.asset->url,
    duration,
    level
  }
}`

const { data: club } = await useSanityQuery(query, {
  slug: route.params.slug
})

// SEO
useHead({
  title: `${getLocaleValue(club.value.name)} | FitCity`,
  meta: [
    {
      name: 'description',
      content: getLocaleValue(club.value.description)
    }
  ]
})

// Animations
onMounted(() => {
  // Parallax hero image
  gsap.to('.hero-image img', {
    y: -100,
    scrollTrigger: {
      trigger: '.club-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  
  // Fade in sections
  gsap.from('.club-info, .club-gallery, .club-classes', {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.3,
    scrollTrigger: {
      trigger: '.club-info',
      start: 'top 80%'
    }
  })
})
</script>

<style scoped lang="scss">
.club-detail {
  background: var(--color-yellow);
  color: var(--color-darkBrown);
}

.club-hero {
  position: relative;
  height: 80vh;
  overflow: hidden;
  
  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, rgba(22, 16, 3, 0.8), transparent);
    }
  }
  
  .hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 3rem 0;
    z-index: 2;
    color: var(--color-yellow);
    
    .club-name {
      font-size: clamp(48px, 39.654px + 100vw * .0214, 76px);
      margin-bottom: 1rem;
    }
    
    .club-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      opacity: 0.9;
    }
  }
}

.club-info {
  padding: 5rem 0;
  
  h2 {
    font-size: clamp(32px, 27.309px + 100vw * .012, 48px);
    margin-bottom: 2rem;
  }
  
  .club-description {
    margin-bottom: 4rem;
    
    p {
      font-size: 1.125rem;
      line-height: 1.8;
      opacity: 0.8;
    }
  }
  
  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    
    .amenity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(22, 16, 3, 0.05);
      border-radius: 8px;
      
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
  
  .club-schedule {
    margin-top: 4rem;
    
    dl {
      display: grid;
      gap: 1rem;
      
      dt {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      dd {
        opacity: 0.7;
        margin-bottom: 1rem;
      }
    }
  }
  
  .contact-card {
    position: sticky;
    top: 2rem;
    padding: 2rem;
    background: var(--color-darkBrown);
    color: var(--color-yellow);
    border-radius: 8px;
    margin-bottom: 2rem;
    
    h3 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .contact-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
      
      a {
        color: var(--color-yellow);
        text-decoration: underline;
        
        &:hover {
          opacity: 0.8;
        }
      }
    }
    
    .cta-btn {
      width: 100%;
      padding: 1rem;
      background: var(--color-yellow);
      color: var(--color-darkBrown);
      font-weight: 600;
      border-radius: 4px;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  .club-map {
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
  }
}

.club-gallery {
  padding: 5rem 0;
  background: var(--color-darkBrown);
  color: var(--color-yellow);
}

.club-classes {
  padding: 5rem 0;
}

.club-cta {
  padding: 5rem 0;
  text-align: center;
  background: var(--color-darkBrown);
  color: var(--color-yellow);
  
  h2 {
    font-size: clamp(48px, 39.654px + 100vw * .0214, 76px);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.25rem;
    opacity: 0.8;
    margin-bottom: 2rem;
  }
  
  .cta-btn-large {
    padding: 1.5rem 3rem;
    background: var(--color-yellow);
    color: var(--color-darkBrown);
    font-size: 1.25rem;
    font-weight: 600;
    border-radius: 4px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>
```

---

## 🗺️ MAP INTEGRATION {#map}

### Map Component

```vue
<!-- components/ClubsMap.vue -->
<template>
  <div class="clubs-map">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({
  clubs: Array,
  selectedClub: Object
})

const emit = defineEmits(['select'])

const mapContainer = ref(null)
let map = null
let markers = []

onMounted(() => {
  // Initialize map
  mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'
  
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-9.1393, 38.7223], // Lisbon
    zoom: 10
  })
  
  // Add markers
  addMarkers()
})

const addMarkers = () => {
  // Clear existing markers
  markers.forEach(marker => marker.remove())
  markers = []
  
  // Add new markers
  props.clubs.forEach(club => {
    if (!club.location.coordinates) return
    
    const el = document.createElement('div')
    el.className = 'custom-marker'
    el.innerHTML = `
      <div class="marker-content">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
        </svg>
      </div>
    `
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat([
        club.location.coordinates.lng,
        club.location.coordinates.lat
      ])
      .addTo(map)
    
    // Add click handler
    el.addEventListener('click', () => {
      emit('select', club)
    })
    
    markers.push(marker)
  })
}

watch(() => props.clubs, () => {
  addMarkers()
})

watch(() => props.selectedClub, (club) => {
  if (club && club.location.coordinates) {
    map.flyTo({
      center: [
        club.location.coordinates.lng,
        club.location.coordinates.lat
      ],
      zoom: 14,
      duration: 1000
    })
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped lang="scss">
.clubs-map {
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  
  .map-container {
    width: 100%;
    height: 100%;
  }
}

:deep(.custom-marker) {
  cursor: pointer;
  
  .marker-content {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-yellow);
    color: var(--color-darkBrown);
    border-radius: 50%;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
}
</style>
```

---

## 🚀 IMPLEMENTATION GUIDE {#implementation}

### Step 1: Set Up Routes

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  // Enable dynamic routes
  nitro: {
    prerender: {
      routes: ['/clubs']
    }
  }
})
```

### Step 2: Create Sanity Schemas

```javascript
// See 03_CMS_INTEGRATION.md for complete schemas
```

### Step 3: Build Components

```
Week 1:
├─ ClubCard component
├─ ClubFilters component
└─ ClubsMap component

Week 2:
├─ Club detail page
├─ ClubGallery component
└─ ClubMap component
```

### Step 4: Add Animations

```javascript
// Stagger grid items
gsap.from('.club-card', {
  opacity: 0,
  y: 50,
  stagger: 0.1
})

// Parallax hero
gsap.to('.hero-image', {
  y: -100,
  scrollTrigger: { scrub: true }
})
```

---

## 📊 BEST PRACTICES

### Performance
- Lazy load images
- Paginate results (if > 50 clubs)
- Cache map tiles
- Debounce filter changes

### UX
- Show loading states
- Provide empty states
- Add skeleton screens
- Implement smooth transitions

### Accessibility
- Keyboard navigation for filters
- ARIA labels for map markers
- Focus management
- Screen reader announcements

---

**Created by:** Clubs Page Analysis Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete  
**Next:** Classes page analysis
