# 🏗️ FITCITY SYSTEM ARCHITECTURE & PROJECT STRUCTURE

> Document này định nghĩa kiến trúc phần mềm cho FitCity, dựa trên kết quả reverse engineering Phive.pt và các Best Practices của Nuxt 3.

---

## 1. DIRECTORY STRUCTURE (NUXT 3)

```
f:\FitcityFE\fitcity-app\
├── .output/                 # Production build
├── assets/
│   ├── css/
│   │   ├── main.css         # Global styles imports
│   │   ├── tokens.css       # Extracted CSS Variables (from css-data.json)
│   │   ├── typography.css   # Font faces & sizes
│   │   └── reset.css        # CSS Reset
│   ├── fonts/               # Local font files (PP Formula, etc.)
│   └── images/              # Static assets
├── components/
│   ├── base/                # Atomic components (Buttons, Inputs)
│   │   ├── ContentButton.vue
│   │   └── VariableLabel.vue
│   ├── layout/              # Structural components
│   │   ├── SiteHeader.vue
│   │   ├── SiteFooter.vue
│   │   └── GridContainer.vue
│   ├── media/               # Media handling
│   │   ├── ImageAsset.vue   # Wrapper for responsive images
│   │   └── VideoAsset.vue
│   ├── sections/            # Page sections
│   │   ├── HeroSection.vue
│   │   └── ClubsList.vue
│   └── features/            # Business logic components
│       ├── booking/
│       └── schedule/
├── composables/             # Shared logic (Auto-imported)
│   ├── useClubs.ts          # Clubs logic
│   ├── useClasses.ts        # Classes logic
│   └── useAnimation.ts      # GSAP integration
├── layouts/
│   ├── default.vue          # Standard layout
│   └── clean.vue            # No header/footer (for modals/auth)
├── middleware/
│   └── auth.ts              # Route protection
├── pages/
│   ├── index.vue            # Homepage
│   ├── clubs/
│   │   ├── index.vue        # Listing
│   │   └── [id].vue         # Detail
│   └── classes/
│       ├── index.vue
│       └── [id].vue
├── plugins/
│   ├── gsap.client.ts       # GSAP setup
│   └── lenis.client.ts      # Smooth scroll
├── public/                  # Public static files
├── server/                  # Server API routes (Nitro)
│   └── api/
├── stores/                  # Pinia State Stores
│   ├── user.ts
│   └── app.ts
├── types/                   # TypeScript interfaces
│   └── index.d.ts
├── utils/                   # Helper functions
├── app.vue                  # Root component
├── nuxt.config.ts           # Nuxt configuration
└── package.json             # Dependencies
```

---

## 2. COMPONENT ARCHITECTURE STRATEGY

Dựa trên `components.txt`, chúng ta sẽ map các components gốc sang kiến trúc mới:

| Phive Component | FitCity Component | Path | Type |
|-----------------|-------------------|------|------|
| `image-asset` | `BaseImage.vue` | `@/components/base/media` | Atom |
| `content-button` | `AppButton.vue` | `@/components/base/ui` | Atom |
| `variable-label` | `AppLabel.vue` | `@/components/base/ui` | Atom |
| `home-header` | `TheHeader.vue` | `@/components/layout` | Organism |
| `phive-clubs` | `ClubsGrid.vue` | `@/components/sections` | Organism |
| `scroller` | `ScrollContainer.vue`| `@/components/base/layout`| Molecule |

### Base Component Design Pattern

Sử dụng **Props** để map với extracted data attributes:

```vue
<!-- components/base/media/BaseImage.vue -->
<template>
  <div class="image-asset" :class="{ 'is-loaded': loaded }">
    <img 
      :src="src" 
      :srcset="srcset" 
      :sizes="sizes" 
      :alt="alt"
      loading="lazy"
      @load="loaded = true"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  srcset?: string
  alt?: string
  sizes?: string
}>()
const loaded = ref(false)
</script>

<style scoped>
/* CSS extracted from Phive will go here */
</style>
```

---

## 3. DESIGN SYSTEM INTEGRATION

Chúng ta sẽ tạo file `assets/css/tokens.css` chứa 83 biến CSS đã extract.

### Strategy:
1.  **Global Tokens**: Import vào `nuxt.config.ts` để available toàn app.
2.  **Scoped Overrides**: Sử dụng tính năng CSS Scoping của Vue để override biến cục bộ (giống cách Phive làm với `--ribbon-backgroundColor`).

```css
/* assets/css/tokens.css snippet */
:root {
  /* Colors */
  --color-yellow: #ffe000;
  --color-darkBrown: #161003;
  
  /* Grid */
  --grid-num-cols: 16;
  --grid-padding: clamp(8px, 3.242px + 100vw * .0122, 24px);
  
  /* Typography */
  --font-primary: 'PP Formula';
}
```

---

## 4. NEXT STEPS (EXECUTION)

1.  **Init Project**: Tạo folder và files cấu trúc.
2.  **Import Assets**: Copy extracted CSS và Images vào đúng chỗ.
3.  **Setup Core**: Config `nuxt.config.ts` với modules cần thiết (Pinia, Nuxt Image).
4.  **Dev Phase 1**: Xây dựng `Base components` trước.

---
**Document Status**: Ready for implementation.
