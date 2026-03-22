# 📚 CLASSES PAGE ANALYSIS - PHIVE.PT

> Deep dive into Classes listing, detail, and booking system

---

## 📋 TABLE OF CONTENTS

1. [Page Structure](#structure)
2. [Classes Listing](#listing)
3. [Class Detail Page](#detail)
4. [Schedule & Booking](#booking)
5. [Instructor Profiles](#instructors)
6. [Implementation Guide](#implementation)

---

## 🏗️ PAGE STRUCTURE {#structure}

### URL Pattern

```
/en/classes                    → Classes listing
/en/classes/yoga-flow          → Class detail
/en/classes/hiit-training      → Class detail
/en/schedule                   → Weekly schedule
/en/instructors                → Instructors listing
/en/instructors/maria-silva    → Instructor profile
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   CLASSES PAGE FLOW                          │
└─────────────────────────────────────────────────────────────┘

USER REQUEST
    ↓
NUXT ROUTER
    ↓
FETCH CLASSES DATA (Sanity CMS)
    ↓
FETCH SCHEDULE DATA (API)
    ↓
RENDER LISTING/DETAIL
    ↓
APPLY FILTERS (Level, Duration, Type)
    ↓
DISPLAY RESULTS
```

---

## 📋 CLASSES LISTING PAGE {#listing}

### Page Layout

```vue
<!-- pages/classes/index.vue -->
<template>
  <div class="classes-page">
    <!-- Hero Section -->
    <section class="classes-hero">
      <div class="row">
        <div class="col">
          <h1 class="hero-title">
            <span class="first">Find your</span>
            <span class="last">rhythm</span>
          </h1>
          
          <p class="hero-subtitle">
            {{ totalClasses }} classes to choose from
          </p>
        </div>
      </div>
    </section>
    
    <!-- Filter Bar -->
    <section class="classes-filters">
      <div class="row">
        <div class="col">
          <ClassFilters
            v-model:category="selectedCategory"
            v-model:level="selectedLevel"
            v-model:duration="selectedDuration"
            :categories="categories"
          />
        </div>
      </div>
    </section>
    
    <!-- Classes Carousel/Grid -->
    <section class="classes-content">
      <div class="row">
        <div class="col">
          <!-- View Toggle -->
          <div class="view-toggle">
            <button
              :class="{ active: viewMode === 'carousel' }"
              @click="viewMode = 'carousel'"
            >
              Carousel
            </button>
            <button
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              Grid
            </button>
          </div>
          
          <!-- Carousel View -->
          <ClassesCarousel
            v-if="viewMode === 'carousel'"
            :classes="filteredClasses"
          />
          
          <!-- Grid View -->
          <div v-else class="classes-grid">
            <ClassCard
              v-for="classItem in filteredClasses"
              :key="classItem._id"
              :class-item="classItem"
              @click="navigateToClass(classItem.slug)"
            />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Schedule CTA -->
    <section class="schedule-cta">
      <div class="row">
        <div class="col">
          <h2>View Full Schedule</h2>
          <p>See all classes across all clubs</p>
          <NuxtLink to="/schedule" class="cta-btn">
            View Schedule
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useSanityQuery } from '@nuxtjs/sanity/composables'

// SEO
useHead({
  title: 'Classes | FitCity',
  meta: [
    {
      name: 'description',
      content: 'Discover our wide range of fitness classes. From yoga to HIIT, find the perfect workout for you.'
    }
  ]
})

// Fetch classes data
const query = groq`*[_type == "classType"] | order(name.en asc) {
  _id,
  name,
  slug,
  "image": image.asset->url,
  category,
  duration,
  level,
  description,
  "instructor": instructor->{
    _id,
    name,
    "image": image.asset->url
  },
  benefits[]
}`

const { data: classes } = await useSanityQuery(query)

// State
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const selectedDuration = ref('all')
const viewMode = ref('carousel')

// Computed
const categories = computed(() => {
  const uniqueCategories = [...new Set(classes.value.map(c => c.category))]
  return ['all', ...uniqueCategories]
})

const filteredClasses = computed(() => {
  let filtered = classes.value
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(c => c.category === selectedCategory.value)
  }
  
  // Filter by level
  if (selectedLevel.value !== 'all') {
    filtered = filtered.filter(c => c.level === selectedLevel.value)
  }
  
  // Filter by duration
  if (selectedDuration.value !== 'all') {
    const [min, max] = selectedDuration.value.split('-').map(Number)
    filtered = filtered.filter(c => {
      const duration = parseInt(c.duration)
      return duration >= min && duration <= max
    })
  }
  
  return filtered
})

const totalClasses = computed(() => classes.value.length)

// Methods
const navigateToClass = (slug) => {
  navigateTo(`/classes/${slug.current}`)
}

// Animations
onMounted(() => {
  // Fade in on scroll
  gsap.from('.class-card', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.classes-content',
      start: 'top 80%'
    }
  })
})
</script>

<style scoped lang="scss">
.classes-page {
  background: var(--color-yellow);
  color: var(--color-darkBrown);
}

.classes-hero {
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

.classes-filters {
  padding: 2rem 0;
  border-bottom: 1px solid rgba(22, 16, 3, 0.1);
}

.classes-content {
  padding: 5rem 0;
  
  .view-toggle {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
    justify-content: center;
    
    button {
      padding: 0.75rem 1.5rem;
      background: transparent;
      border: 1px solid rgba(22, 16, 3, 0.3);
      color: var(--color-darkBrown);
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(22, 16, 3, 0.05);
      }
      
      &.active {
        background: var(--color-darkBrown);
        color: var(--color-yellow);
        border-color: var(--color-darkBrown);
      }
    }
  }
  
  .classes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    
    @media (max-width: 743px) {
      grid-template-columns: 1fr;
    }
  }
}

.schedule-cta {
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
  
  .cta-btn {
    display: inline-block;
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

### Class Card Component

```vue
<!-- components/ClassCard.vue -->
<template>
  <article class="class-card" @click="handleClick">
    <!-- Image -->
    <div class="card-image">
      <img
        :src="getImageUrl(classItem.image, { width: 600 })"
        :alt="getLocaleValue(classItem.name)"
        loading="lazy"
      >
      
      <!-- Category Badge -->
      <span class="category-badge">{{ classItem.category }}</span>
      
      <!-- Level Badge -->
      <span class="level-badge" :data-level="classItem.level">
        {{ classItem.level }}
      </span>
    </div>
    
    <!-- Content -->
    <div class="card-content">
      <h3 class="card-title">{{ getLocaleValue(classItem.name) }}</h3>
      
      <!-- Meta Info -->
      <div class="card-meta">
        <span class="duration">
          <Icon name="clock" />
          {{ classItem.duration }} min
        </span>
        
        <span v-if="classItem.instructor" class="instructor">
          <Icon name="user" />
          {{ getLocaleValue(classItem.instructor.name) }}
        </span>
      </div>
      
      <!-- Description -->
      <p class="card-description">
        {{ truncate(getLocaleValue(classItem.description), 100) }}
      </p>
    </div>
    
    <!-- Hover Overlay -->
    <div class="card-overlay">
      <span class="cta">Learn More</span>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  classItem: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const { getLocaleValue } = useLocaleContent()
const { getImageUrl } = useSanityImage()

const handleClick = () => {
  emit('click', props.classItem)
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped lang="scss">
.class-card {
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    
    .card-overlay {
      opacity: 1;
    }
    
    .card-image img {
      transform: scale(1.05);
    }
  }
  
  .card-image {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .category-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.5rem 1rem;
      background: var(--color-yellow);
      color: var(--color-darkBrown);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 4px;
    }
    
    .level-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 1rem;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 4px;
      
      &[data-level="Beginner"] {
        background: #4CAF50;
        color: white;
      }
      
      &[data-level="Intermediate"] {
        background: #FF9800;
        color: white;
      }
      
      &[data-level="Advanced"] {
        background: #F44336;
        color: white;
      }
    }
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: clamp(20px, 17.036px + 100vw * .0076, 30px);
    margin-bottom: 1rem;
  }
  
  .card-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    font-size: 14px;
    opacity: 0.7;
    
    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
  
  .card-description {
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.8;
  }
  
  .card-overlay {
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
      font-weight: 600;
    }
  }
}
</style>
```

---

## 📖 CLASS DETAIL PAGE {#detail}

### Page Structure

```vue
<!-- pages/classes/[slug].vue -->
<template>
  <div class="class-detail">
    <!-- Hero Section -->
    <section class="class-hero">
      <div class="hero-image">
        <img
          :src="getImageUrl(classItem.image, { width: 2400 })"
          :alt="getLocaleValue(classItem.name)"
        >
      </div>
      
      <div class="hero-content">
        <div class="row">
          <div class="col">
            <span class="category-badge">{{ classItem.category }}</span>
            <h1 class="class-name">{{ getLocaleValue(classItem.name) }}</h1>
            
            <div class="class-meta">
              <span class="duration">
                <Icon name="clock" />
                {{ classItem.duration }} min
              </span>
              <span class="level" :data-level="classItem.level">
                <Icon name="trending-up" />
                {{ classItem.level }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Info Section -->
    <section class="class-info">
      <div class="row">
        <div class="col large-8">
          <!-- Description -->
          <div class="class-description">
            <h2>About This Class</h2>
            <p>{{ getLocaleValue(classItem.description) }}</p>
          </div>
          
          <!-- Benefits -->
          <div class="class-benefits">
            <h2>Benefits</h2>
            <ul>
              <li
                v-for="(benefit, index) in classItem.benefits"
                :key="index"
              >
                <Icon name="check" />
                <span>{{ getLocaleValue(benefit) }}</span>
              </li>
            </ul>
          </div>
          
          <!-- What to Bring -->
          <div class="class-requirements">
            <h2>What to Bring</h2>
            <ul>
              <li>Comfortable workout clothes</li>
              <li>Water bottle</li>
              <li>Towel</li>
              <li v-if="classItem.category === 'Yoga'">Yoga mat (or use ours)</li>
            </ul>
          </div>
        </div>
        
        <div class="col large-4">
          <!-- Instructor Card -->
          <div v-if="classItem.instructor" class="instructor-card">
            <img
              :src="getImageUrl(classItem.instructor.image, { width: 400 })"
              :alt="getLocaleValue(classItem.instructor.name)"
            >
            
            <h3>Your Instructor</h3>
            <h4>{{ getLocaleValue(classItem.instructor.name) }}</h4>
            <p>{{ getLocaleValue(classItem.instructor.bio) }}</p>
            
            <NuxtLink
              :to="`/instructors/${classItem.instructor.slug.current}`"
              class="view-profile"
            >
              View Profile
            </NuxtLink>
          </div>
          
          <!-- Book CTA -->
          <div class="book-card">
            <h3>Ready to join?</h3>
            <p>Book your spot now</p>
            <button class="book-btn" @click="openBookingModal">
              Book This Class
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Schedule Section -->
    <section class="class-schedule">
      <div class="row">
        <div class="col">
          <h2>Upcoming Sessions</h2>
          <ClassScheduleTable
            :class-id="classItem._id"
            :sessions="upcomingSessions"
          />
        </div>
      </div>
    </section>
    
    <!-- Related Classes -->
    <section class="related-classes">
      <div class="row">
        <div class="col">
          <h2>You Might Also Like</h2>
          <ClassesCarousel :classes="relatedClasses" />
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

// Fetch class data
const query = groq`*[_type == "classType" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  "image": image.asset->url,
  category,
  duration,
  level,
  description,
  benefits[],
  "instructor": instructor->{
    _id,
    name,
    slug,
    "image": image.asset->url,
    bio
  }
}`

const { data: classItem } = await useSanityQuery(query, {
  slug: route.params.slug
})

// Fetch upcoming sessions
const { data: upcomingSessions } = await useFetch('/api/sessions', {
  query: {
    classId: classItem.value._id,
    from: new Date().toISOString(),
    limit: 10
  }
})

// Fetch related classes
const relatedQuery = groq`*[_type == "classType" && category == $category && _id != $id][0...4] {
  _id,
  name,
  slug,
  "image": image.asset->url,
  duration,
  level
}`

const { data: relatedClasses } = await useSanityQuery(relatedQuery, {
  category: classItem.value.category,
  id: classItem.value._id
})

// SEO
useHead({
  title: `${getLocaleValue(classItem.value.name)} | FitCity`,
  meta: [
    {
      name: 'description',
      content: getLocaleValue(classItem.value.description)
    }
  ]
})

// Methods
const openBookingModal = () => {
  // Open booking modal
  console.log('Open booking modal')
}

// Animations
onMounted(() => {
  // Parallax hero
  gsap.to('.hero-image img', {
    y: -100,
    scrollTrigger: {
      trigger: '.class-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  
  // Fade in sections
  gsap.from('.class-info, .class-schedule, .related-classes', {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.3,
    scrollTrigger: {
      trigger: '.class-info',
      start: 'top 80%'
    }
  })
})
</script>

<style scoped lang="scss">
.class-detail {
  background: var(--color-darkBrown);
  color: var(--color-yellow);
}

.class-hero {
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
      background: linear-gradient(to top, rgba(22, 16, 3, 0.9), transparent);
    }
  }
  
  .hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 3rem 0;
    z-index: 2;
    
    .category-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--color-yellow);
      color: var(--color-darkBrown);
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .class-name {
      font-size: clamp(48px, 39.654px + 100vw * .0214, 76px);
      margin-bottom: 1rem;
    }
    
    .class-meta {
      display: flex;
      gap: 2rem;
      font-size: 1.125rem;
      
      span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}

.class-info {
  padding: 5rem 0;
  
  h2 {
    font-size: clamp(32px, 27.309px + 100vw * .012, 48px);
    margin-bottom: 2rem;
  }
  
  .class-description {
    margin-bottom: 4rem;
    
    p {
      font-size: 1.125rem;
      line-height: 1.8;
      opacity: 0.8;
    }
  }
  
  .class-benefits {
    margin-bottom: 4rem;
    
    ul {
      display: grid;
      gap: 1rem;
      
      li {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        font-size: 1.125rem;
        
        svg {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          color: var(--color-yellow);
        }
      }
    }
  }
  
  .instructor-card {
    position: sticky;
    top: 2rem;
    padding: 2rem;
    background: var(--color-yellow);
    color: var(--color-darkBrown);
    border-radius: 8px;
    margin-bottom: 2rem;
    
    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    
    h3 {
      font-size: 14px;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 0.5rem;
    }
    
    h4 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 14px;
      line-height: 1.6;
      opacity: 0.8;
      margin-bottom: 1.5rem;
    }
    
    .view-profile {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: var(--color-darkBrown);
      color: var(--color-yellow);
      border-radius: 4px;
      font-weight: 600;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  .book-card {
    padding: 2rem;
    background: rgba(255, 224, 0, 0.1);
    border: 2px solid var(--color-yellow);
    border-radius: 8px;
    text-align: center;
    
    h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    p {
      opacity: 0.8;
      margin-bottom: 1.5rem;
    }
    
    .book-btn {
      width: 100%;
      padding: 1rem;
      background: var(--color-yellow);
      color: var(--color-darkBrown);
      font-size: 1.125rem;
      font-weight: 600;
      border-radius: 4px;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.class-schedule {
  padding: 5rem 0;
  background: var(--color-yellow);
  color: var(--color-darkBrown);
}

.related-classes {
  padding: 5rem 0;
}
</style>
```

---

## 📅 SCHEDULE & BOOKING {#booking}

### Schedule Table Component

```vue
<!-- components/ClassScheduleTable.vue -->
<template>
  <div class="schedule-table">
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Club</th>
          <th>Instructor</th>
          <th>Spots</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="session in sessions"
          :key="session.id"
          :class="{ 'fully-booked': session.spotsLeft === 0 }"
        >
          <td>{{ formatDate(session.date) }}</td>
          <td>{{ session.time }}</td>
          <td>{{ session.club.name }}</td>
          <td>{{ session.instructor.name }}</td>
          <td>
            <span class="spots-badge" :data-available="session.spotsLeft > 0">
              {{ session.spotsLeft }} / {{ session.totalSpots }}
            </span>
          </td>
          <td>
            <button
              v-if="session.spotsLeft > 0"
              class="book-btn"
              @click="bookSession(session)"
            >
              Book
            </button>
            <span v-else class="fully-booked-label">Full</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  classId: String,
  sessions: Array
})

const emit = defineEmits(['book'])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const bookSession = (session) => {
  emit('book', session)
}
</script>

<style scoped lang="scss">
.schedule-table {
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    thead {
      background: rgba(22, 16, 3, 0.05);
      
      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
      }
    }
    
    tbody {
      tr {
        border-bottom: 1px solid rgba(22, 16, 3, 0.1);
        
        &:hover {
          background: rgba(22, 16, 3, 0.02);
        }
        
        &.fully-booked {
          opacity: 0.5;
        }
        
        td {
          padding: 1rem;
          font-size: 14px;
        }
      }
    }
    
    .spots-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      
      &[data-available="true"] {
        background: #4CAF50;
        color: white;
      }
      
      &[data-available="false"] {
        background: #F44336;
        color: white;
      }
    }
    
    .book-btn {
      padding: 0.5rem 1.5rem;
      background: var(--color-darkBrown);
      color: var(--color-yellow);
      border-radius: 4px;
      font-weight: 600;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
    
    .fully-booked-label {
      font-size: 12px;
      opacity: 0.5;
    }
  }
}
</style>
```

---

## 👨‍🏫 INSTRUCTOR PROFILES {#instructors}

### Instructor Card

```vue
<!-- components/InstructorCard.vue -->
<template>
  <article class="instructor-card" @click="handleClick">
    <div class="card-image">
      <img
        :src="getImageUrl(instructor.image, { width: 400 })"
        :alt="getLocaleValue(instructor.name)"
        loading="lazy"
      >
    </div>
    
    <div class="card-content">
      <h3 class="card-name">{{ getLocaleValue(instructor.name) }}</h3>
      <p class="card-specialty">{{ instructor.specialty }}</p>
      
      <div class="card-stats">
        <span>
          <Icon name="award" />
          {{ instructor.yearsExperience }}+ years
        </span>
        <span>
          <Icon name="users" />
          {{ instructor.classesCount }} classes
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  instructor: Object
})

const emit = defineEmits(['click'])

const { getLocaleValue } = useLocaleContent()
const { getImageUrl } = useSanityImage()

const handleClick = () => {
  emit('click', props.instructor)
}
</script>

<style scoped lang="scss">
.instructor-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    
    .card-image img {
      transform: scale(1.05);
    }
  }
  
  .card-image {
    aspect-ratio: 1;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .card-name {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .card-specialty {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 1rem;
  }
  
  .card-stats {
    display: flex;
    gap: 1.5rem;
    font-size: 14px;
    
    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
```

---

## 🚀 IMPLEMENTATION GUIDE {#implementation}

### API Endpoints

```javascript
// server/api/sessions.get.js
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Fetch sessions from database
  const sessions = await db.sessions.find({
    classId: query.classId,
    date: { $gte: new Date(query.from) }
  })
    .limit(parseInt(query.limit) || 10)
    .populate('club instructor')
    .exec()
  
  return sessions
})

// server/api/sessions/book.post.js
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = event.context.user
  
  // Check if session has spots
  const session = await db.sessions.findById(body.sessionId)
  
  if (session.spotsLeft === 0) {
    throw createError({
      statusCode: 400,
      message: 'Session is fully booked'
    })
  }
  
  // Create booking
  const booking = await db.bookings.create({
    user: user.id,
    session: body.sessionId,
    status: 'confirmed'
  })
  
  // Update session spots
  await db.sessions.findByIdAndUpdate(body.sessionId, {
    $inc: { spotsLeft: -1 }
  })
  
  return booking
})
```

### Best Practices

**Performance:**
- Cache class listings
- Lazy load images
- Paginate schedule
- Debounce filters

**UX:**
- Show loading states
- Provide empty states
- Add skeleton screens
- Implement optimistic UI

**Accessibility:**
- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader support

---

**Created by:** Classes Page Analysis Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete  
**Next:** Edge cases & error handling
