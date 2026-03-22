# 🗄️ CMS INTEGRATION DEEP DIVE - PHIVE.PT

> Phân tích chi tiết cách Phive.pt tích hợp CMS (Sanity.io) và quản lý content

---

## 📋 TABLE OF CONTENTS

1. [CMS Architecture](#architecture)
2. [Content Modeling](#modeling)
3. [Dynamic Page Building](#dynamic-pages)
4. [Image Optimization](#images)
5. [Localization Strategy](#i18n)
6. [Implementation Guide](#implementation)

---

## 🏗️ CMS ARCHITECTURE {#architecture}

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CMS ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────┘

SANITY STUDIO (Admin)
├─ Content Schemas
├─ Custom Input Components
├─ Preview Functionality
└─ Media Management

↓ API (GraphQL/GROQ)

NUXT 3 APPLICATION
├─ Data Fetching (useSanityQuery)
├─ Dynamic Routing
├─ Component Mapping
└─ Image Optimization

↓ Build Time

STATIC SITE
├─ Pre-rendered Pages
├─ Optimized Assets
└─ CDN Distribution
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **CMS** | Sanity.io | Headless CMS |
| **Query Language** | GROQ | Content queries |
| **Client** | @nuxtjs/sanity | Nuxt integration |
| **Images** | Sanity Image URLs | Optimization |
| **Hosting** | Sanity Cloud | Content delivery |

---

## 📐 CONTENT MODELING {#modeling}

### Schema Structure

```javascript
// schemas/index.js
export default [
  // Document types
  page,
  club,
  classType,
  instructor,
  
  // Block types
  hero,
  clubsGrid,
  classesCarousel,
  appShowcase,
  textBlock,
  imageBlock,
  
  // Object types
  seo,
  localeString,
  localeText,
  link
]
```

### Page Schema

```javascript
// schemas/documents/page.js
export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    },
    {
      name: 'blocks',
      title: 'Page Blocks',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'clubsGrid' },
        { type: 'classesCarousel' },
        { type: 'appShowcase' },
        { type: 'textBlock' },
        { type: 'imageBlock' }
      ]
    },
    {
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Stream', value: 'stream' },
          { title: 'Pilates', value: 'pilates' },
          { title: 'Nutrition', value: 'nutrition' }
        ]
      },
      initialValue: 'light'
    }
  ],
  preview: {
    select: {
      title: 'title.en',
      slug: 'slug.current'
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug}`
      }
    }
  }
}
```

### Club Schema

```javascript
// schemas/documents/club.js
export default {
  name: 'club',
  title: 'Club',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'localeString',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Address',
          type: 'localeString'
        },
        {
          name: 'city',
          title: 'City',
          type: 'string'
        },
        {
          name: 'coordinates',
          title: 'Coordinates',
          type: 'geopoint'
        }
      ]
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'localeString'
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'localeText'
            }
          ]
        }
      ]
    },
    {
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'localeString'
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Pool', value: 'pool' },
                  { title: 'Sauna', value: 'sauna' },
                  { title: 'Classes', value: 'classes' },
                  { title: 'Parking', value: 'parking' }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'schedule',
      title: 'Schedule',
      type: 'object',
      fields: [
        {
          name: 'weekdays',
          title: 'Weekdays',
          type: 'string'
        },
        {
          name: 'weekends',
          title: 'Weekends',
          type: 'string'
        }
      ]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localeText'
    }
  ]
}
```

### Block Types

```javascript
// schemas/blocks/hero.js
export default {
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        {
          name: 'first',
          title: 'First Line',
          type: 'localeString'
        },
        {
          name: 'last',
          title: 'Last Line',
          type: 'localeString'
        }
      ]
    },
    {
      name: 'background',
      title: 'Background',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: ['image', 'video']
          }
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          hidden: ({ parent }) => parent?.type !== 'image'
        },
        {
          name: 'video',
          title: 'Video URL',
          type: 'url',
          hidden: ({ parent }) => parent?.type !== 'video'
        }
      ]
    },
    {
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'localeString'
        },
        {
          name: 'link',
          title: 'Link',
          type: 'reference',
          to: [{ type: 'page' }]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title.first.en'
    },
    prepare({ title }) {
      return {
        title: 'Hero Section',
        subtitle: title
      }
    }
  }
}
```

### Locale Types

```javascript
// schemas/objects/localeString.js
export default {
  name: 'localeString',
  title: 'Localized String',
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'string'
    },
    {
      name: 'pt',
      title: 'Portuguese',
      type: 'string'
    }
  ]
}

// schemas/objects/localeText.js
export default {
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'text'
    },
    {
      name: 'pt',
      title: 'Portuguese',
      type: 'text'
    }
  ]
}
```

---

## 🔄 DYNAMIC PAGE BUILDING {#dynamic-pages}

### Page Builder Pattern

```vue
<!-- pages/[...slug].vue -->
<template>
  <div class="page">
    <!-- Render blocks dynamically -->
    <component
      v-for="(block, index) in page.blocks"
      :key="index"
      :is="getBlockComponent(block._type)"
      v-bind="block"
    />
  </div>
</template>

<script setup>
import { useSanityQuery } from '@nuxtjs/sanity/composables'

const route = useRoute()
const { locale } = useI18n()

// Query page data
const query = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  slug,
  seo,
  theme,
  blocks[]{
    _type,
    _key,
    
    // Hero block
    _type == "hero" => {
      title {
        first,
        last
      },
      background {
        type,
        "imageUrl": image.asset->url,
        "videoUrl": video
      },
      cta {
        label,
        "link": link->slug.current
      }
    },
    
    // Clubs grid block
    _type == "clubsGrid" => {
      title,
      subtitle,
      "clubs": *[_type == "club"]{
        _id,
        name,
        slug,
        "image": images[0].asset->url,
        location {
          city
        }
      }
    },
    
    // Classes carousel block
    _type == "classesCarousel" => {
      title,
      subtitle,
      "classes": *[_type == "classType"]{
        _id,
        name,
        slug,
        "image": image.asset->url,
        duration,
        level
      }
    },
    
    // Text block
    _type == "textBlock" => {
      content,
      alignment
    },
    
    // Image block
    _type == "imageBlock" => {
      "imageUrl": image.asset->url,
      alt,
      caption
    }
  }
}`

const { data: page } = await useSanityQuery(query, {
  slug: route.params.slug || 'home'
})

// Component mapping
const getBlockComponent = (type) => {
  const components = {
    hero: 'BlockHero',
    clubsGrid: 'BlockClubsGrid',
    classesCarousel: 'BlockClassesCarousel',
    appShowcase: 'BlockAppShowcase',
    textBlock: 'BlockText',
    imageBlock: 'BlockImage'
  }
  
  return components[type] || 'div'
}

// Set page theme
onMounted(() => {
  document.body.setAttribute('data-theme', page.value.theme)
})
</script>
```

### GROQ Queries

```javascript
// composables/useSanityQueries.js
export const useSanityQueries = () => {
  // Get all clubs
  const getClubs = () => groq`
    *[_type == "club"] | order(name.en asc) {
      _id,
      name,
      slug,
      "image": images[0].asset->url,
      location {
        city,
        address
      },
      amenities[] {
        name,
        icon
      }
    }
  `
  
  // Get single club
  const getClub = (slug) => groq`
    *[_type == "club" && slug.current == "${slug}"][0] {
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
      schedule,
      description,
      "classes": *[_type == "classType" && references(^._id)] {
        _id,
        name,
        slug
      }
    }
  `
  
  // Get all classes
  const getClasses = () => groq`
    *[_type == "classType"] | order(name.en asc) {
      _id,
      name,
      slug,
      "image": image.asset->url,
      duration,
      level,
      description,
      "instructor": instructor->name
    }
  `
  
  // Get navigation
  const getNavigation = () => groq`
    *[_type == "navigation"][0] {
      items[] {
        label,
        "link": link->slug.current,
        subItems[] {
          label,
          "link": link->slug.current
        }
      }
    }
  `
  
  return {
    getClubs,
    getClub,
    getClasses,
    getNavigation
  }
}
```

### Data Fetching

```vue
<!-- components/BlockClubsGrid.vue -->
<template>
  <section class="clubs-grid">
    <div class="row">
      <div class="col">
        <h2 v-if="title">{{ title[locale] }}</h2>
        <p v-if="subtitle">{{ subtitle[locale] }}</p>
        
        <div class="grid">
          <ClubCard
            v-for="club in clubs"
            :key="club._id"
            :club="club"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: Object,
  subtitle: Object,
  clubs: Array
})

const { locale } = useI18n()
</script>
```

---

## 🖼️ IMAGE OPTIMIZATION {#images}

### Sanity Image URLs

```javascript
// composables/useSanityImage.js
import imageUrlBuilder from '@sanity/image-url'

export const useSanityImage = () => {
  const config = useSanityConfig()
  const builder = imageUrlBuilder(config)
  
  const urlFor = (source) => {
    return builder.image(source)
  }
  
  const getImageUrl = (source, options = {}) => {
    const {
      width = 800,
      height = null,
      quality = 80,
      format = 'webp',
      fit = 'max',
      auto = 'format'
    } = options
    
    let url = urlFor(source)
      .width(width)
      .quality(quality)
      .format(format)
      .fit(fit)
      .auto(auto)
    
    if (height) {
      url = url.height(height)
    }
    
    return url.url()
  }
  
  const getSrcSet = (source, widths = [400, 800, 1200, 1600]) => {
    return widths
      .map(width => {
        const url = getImageUrl(source, { width })
        return `${url} ${width}w`
      })
      .join(', ')
  }
  
  return {
    urlFor,
    getImageUrl,
    getSrcSet
  }
}
```

### Responsive Images

```vue
<template>
  <picture>
    <!-- WebP -->
    <source
      type="image/webp"
      :srcset="getSrcSet(image, [400, 800, 1200])"
      sizes="(max-width: 768px) 100vw, 50vw"
    >
    
    <!-- Fallback -->
    <img
      :src="getImageUrl(image, { width: 800 })"
      :alt="alt[locale]"
      loading="lazy"
      decoding="async"
    >
  </picture>
</template>

<script setup>
const props = defineProps({
  image: Object,
  alt: Object
})

const { locale } = useI18n()
const { getImageUrl, getSrcSet } = useSanityImage()
</script>
```

### Image Component

```vue
<!-- components/SanityImage.vue -->
<template>
  <div class="sanity-image" :style="{ aspectRatio }">
    <img
      v-if="!usePicture"
      :src="imageUrl"
      :srcset="srcset"
      :sizes="sizes"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      @load="handleLoad"
    >
    
    <picture v-else>
      <source
        v-for="format in formats"
        :key="format"
        :type="`image/${format}`"
        :srcset="getSrcSet(source, widths, format)"
        :sizes="sizes"
      >
      <img
        :src="imageUrl"
        :alt="alt"
        :loading="loading"
        :decoding="decoding"
        @load="handleLoad"
      >
    </picture>
  </div>
</template>

<script setup>
const props = defineProps({
  source: {
    type: [Object, String],
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: null
  },
  widths: {
    type: Array,
    default: () => [400, 800, 1200, 1600]
  },
  formats: {
    type: Array,
    default: () => ['webp', 'jpg']
  },
  sizes: {
    type: String,
    default: '100vw'
  },
  quality: {
    type: Number,
    default: 80
  },
  loading: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  decoding: {
    type: String,
    default: 'async',
    validator: (value) => ['async', 'sync', 'auto'].includes(value)
  },
  aspectRatio: {
    type: String,
    default: null
  },
  usePicture: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['load'])

const { getImageUrl, getSrcSet } = useSanityImage()

const imageUrl = computed(() => {
  return getImageUrl(props.source, {
    width: props.width,
    height: props.height,
    quality: props.quality
  })
})

const srcset = computed(() => {
  if (props.usePicture) return null
  return getSrcSet(props.source, props.widths)
})

const handleLoad = (event) => {
  emit('load', event)
}
</script>

<style scoped>
.sanity-image {
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
```

---

## 🌍 LOCALIZATION STRATEGY {#i18n}

### Nuxt i18n Setup

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/sanity'
  ],
  
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'pt',
        iso: 'pt-PT',
        name: 'Português',
        file: 'pt.json'
      }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
```

### Translation Files

```json
// locales/en.json
{
  "nav": {
    "home": "Home",
    "clubs": "Clubs",
    "classes": "Classes",
    "about": "About",
    "contact": "Contact"
  },
  "hero": {
    "cta": "Get Started"
  },
  "clubs": {
    "title": "Our Clubs",
    "subtitle": "Find your perfect location",
    "viewDetails": "View Details"
  },
  "classes": {
    "title": "Classes",
    "subtitle": "Find your rhythm",
    "duration": "Duration",
    "level": "Level"
  },
  "footer": {
    "newsletter": "Stay Updated",
    "subscribe": "Subscribe",
    "rights": "All rights reserved"
  }
}
```

```json
// locales/pt.json
{
  "nav": {
    "home": "Início",
    "clubs": "Clubes",
    "classes": "Aulas",
    "about": "Sobre",
    "contact": "Contacto"
  },
  "hero": {
    "cta": "Começar"
  },
  "clubs": {
    "title": "Nossos Clubes",
    "subtitle": "Encontre a sua localização perfeita",
    "viewDetails": "Ver Detalhes"
  },
  "classes": {
    "title": "Aulas",
    "subtitle": "Encontre o seu ritmo",
    "duration": "Duração",
    "level": "Nível"
  },
  "footer": {
    "newsletter": "Mantenha-se Atualizado",
    "subscribe": "Subscrever",
    "rights": "Todos os direitos reservados"
  }
}
```

### Locale Helper

```javascript
// composables/useLocaleContent.js
export const useLocaleContent = () => {
  const { locale } = useI18n()
  
  const getLocaleValue = (localeObject) => {
    if (!localeObject) return ''
    return localeObject[locale.value] || localeObject.en || ''
  }
  
  const getLocaleArray = (localeArray) => {
    if (!localeArray) return []
    return localeArray.map(item => ({
      ...item,
      name: getLocaleValue(item.name),
      description: getLocaleValue(item.description)
    }))
  }
  
  return {
    getLocaleValue,
    getLocaleArray
  }
}
```

### Usage in Components

```vue
<template>
  <div>
    <h1>{{ getLocaleValue(club.name) }}</h1>
    <p>{{ getLocaleValue(club.description) }}</p>
    
    <ul>
      <li v-for="amenity in localizedAmenities" :key="amenity.icon">
        {{ amenity.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  club: Object
})

const { getLocaleValue, getLocaleArray } = useLocaleContent()

const localizedAmenities = computed(() => {
  return getLocaleArray(props.club.amenities)
})
</script>
```

---

## 🚀 IMPLEMENTATION GUIDE {#implementation}

### Step 1: Setup Sanity Studio

```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Create new Sanity project
sanity init

# Choose options:
# - Create new project
# - Use default dataset configuration
# - Output path: ./studio
# - Select project template: Clean project

# Navigate to studio
cd studio

# Install dependencies
npm install

# Start studio
npm run dev
```

### Step 2: Configure Nuxt

```bash
# Install Sanity module
npm install @nuxtjs/sanity

# Install image URL builder
npm install @sanity/image-url
```

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  
  sanity: {
    projectId: 'your-project-id',
    dataset: 'production',
    apiVersion: '2023-05-03',
    useCdn: true,
    visualEditing: {
      studioUrl: 'http://localhost:3333',
      token: process.env.SANITY_API_TOKEN
    }
  }
})
```

### Step 3: Create Schemas

```javascript
// studio/schemas/index.js
import page from './documents/page'
import club from './documents/club'
import classType from './documents/classType'
import hero from './blocks/hero'
import clubsGrid from './blocks/clubsGrid'
import localeString from './objects/localeString'

export const schemaTypes = [
  // Documents
  page,
  club,
  classType,
  
  // Blocks
  hero,
  clubsGrid,
  
  // Objects
  localeString
]
```

### Step 4: Fetch Data

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <component
      v-for="(block, index) in page.blocks"
      :key="index"
      :is="getBlockComponent(block._type)"
      v-bind="block"
    />
  </div>
</template>

<script setup>
import { useSanityQuery } from '@nuxtjs/sanity/composables'

const query = groq`*[_type == "page" && slug.current == "home"][0]{
  blocks[]{
    _type,
    ...
  }
}`

const { data: page } = await useSanityQuery(query)
</script>
```

### Step 5: Deploy

```bash
# Build Nuxt app
npm run build

# Deploy Sanity Studio
cd studio
sanity deploy
```

---

## 📊 BEST PRACTICES

### Content Strategy

**DO ✅**
1. Use localeString/localeText for all user-facing content
2. Implement proper image alt text
3. Use references for relationships
4. Validate required fields
5. Add helpful field descriptions
6. Use preview functionality
7. Implement proper SEO fields

**DON'T ❌**
1. Hardcode content in components
2. Skip image optimization
3. Forget about accessibility
4. Ignore content validation
5. Mix content and presentation
6. Skip preview configuration
7. Forget about SEO

### Performance Tips

```javascript
// 1. Use CDN for images
const imageUrl = urlFor(image)
  .auto('format')
  .quality(80)
  .url()

// 2. Implement lazy loading
<img loading="lazy" decoding="async">

// 3. Use appropriate image sizes
const srcset = getSrcSet(image, [400, 800, 1200])

// 4. Cache queries
const { data } = await useSanityQuery(query, {}, {
  cache: 'force-cache',
  next: { revalidate: 3600 }
})

// 5. Use GROQ projections
const query = groq`*[_type == "club"]{
  _id,
  name,
  "image": images[0].asset->url
  // Only fetch what you need
}`
```

---

**Created by:** CMS Integration Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete  
**Next:** Implement for FitCity
