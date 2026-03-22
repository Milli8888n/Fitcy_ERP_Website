# 🚀 FITCITY - QUICK START GUIDE

## Bước 1: Initialize Nuxt 3 Project

### 1.1 Tạo project mới
```bash
# Navigate to parent directory
cd f:\

# Create new Nuxt 3 project
npx nuxi@latest init fitcity

# Chọn options:
# - Package manager: npm
# - Initialize git: Yes
```

### 1.2 Install dependencies
```bash
cd fitcity

# Core dependencies
npm install

# Animation libraries
npm install gsap @studio-freight/lenis

# CMS (choose one)
npm install @nuxtjs/strapi
# OR
npm install @nuxtjs/sanity

# Styling
npm install -D sass

# Utilities
npm install @vueuse/core
```

### 1.3 Project structure
```bash
# Create folder structure
mkdir -p components/core
mkdir -p components/blocks
mkdir -p components/fragments
mkdir -p components/primitives
mkdir -p composables
mkdir -p assets/css
mkdir -p assets/fonts
mkdir -p assets/images
mkdir -p public/fonts
mkdir -p public/images
```

---

## Bước 2: Setup Design System (1 giờ)

### 2.1 Copy design system
```bash
# Copy design-system.css từ analysis
cp ../FitcityFE/design-system.css ./assets/css/
```

### 2.2 Customize cho FitCity
```css
/* assets/css/design-system.css */
:root {
  /* FitCity Brand Colors (thay vì Phive) */
  --color-primary: #FF6B35;      /* Orange - Energy */
  --color-secondary: #004E89;    /* Blue - Trust */
  --color-accent: #F7B801;       /* Yellow - Motivation */
  
  /* Keep the rest of the system */
}
```

### 2.3 Create main SCSS
```scss
// assets/css/main.scss
@import './design-system.css';

// Global styles
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  color: var(--color-dark);
  background: var(--color-light);
}
```

### 2.4 Configure Nuxt
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  css: [
    '~/assets/css/main.scss'
  ],
  
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/main.scss" as *;'
        }
      }
    }
  },
  
  app: {
    head: {
      title: 'FitCity - Premium Fitness Club',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Transform your body, elevate your life' }
      ]
    }
  }
})
```

---

## Bước 3: Build First Component (1 giờ)

### 3.1 Button Component
```vue
<!-- components/primitives/Button.vue -->
<template>
  <button 
    :class="['btn', `btn-${variant}`, `btn-${size}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="btn-content">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  label: String,
  disabled: Boolean
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius-full);
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // Variants
  &-primary {
    background: var(--color-primary);
    color: white;
    
    &:hover:not(:disabled) {
      background: darken(#FF6B35, 10%);
    }
  }
  
  &-secondary {
    background: var(--color-secondary);
    color: white;
    
    &:hover:not(:disabled) {
      background: darken(#004E89, 10%);
    }
  }
  
  &-outline {
    background: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    
    &:hover:not(:disabled) {
      background: var(--color-primary);
      color: white;
    }
  }
  
  // Sizes
  &-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  &-md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  &-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
}
</style>
```

### 3.2 Test Button
```vue
<!-- pages/index.vue -->
<template>
  <div class="home">
    <h1>FitCity Button Test</h1>
    
    <div class="button-grid">
      <Button variant="primary" size="sm" @click="handleClick">
        Small Primary
      </Button>
      
      <Button variant="primary" size="md" @click="handleClick">
        Medium Primary
      </Button>
      
      <Button variant="primary" size="lg" @click="handleClick">
        Large Primary
      </Button>
      
      <Button variant="secondary" size="md" @click="handleClick">
        Secondary
      </Button>
      
      <Button variant="outline" size="md" @click="handleClick">
        Outline
      </Button>
      
      <Button variant="primary" size="md" :disabled="true">
        Disabled
      </Button>
    </div>
  </div>
</template>

<script setup>
const handleClick = () => {
  console.log('Button clicked!')
}
</script>

<style scoped lang="scss">
.home {
  padding: 2rem;
  
  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
  
  .button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>
```

---

## Bước 4: Run Development Server

```bash
npm run dev
```

Open: http://localhost:3000

---

## Bước 5: Next Components (This Week)

### Priority Order:
1. ✅ Button (Done)
2. ⏭️ Card
3. ⏭️ Input
4. ⏭️ Navigation Bar
5. ⏭️ Footer

---

## 📊 TIMELINE

### Week 1 (This Week)
- [x] Analysis complete
- [ ] Project setup
- [ ] Design system
- [ ] First 3 components

### Week 2
- [ ] Navigation
- [ ] Layout
- [ ] Scroller system

### Week 3-4
- [ ] Homepage blocks
- [ ] Hero section
- [ ] Features grid

---

## 🎯 SUCCESS CRITERIA

After Step 3, you should have:
- ✅ Nuxt 3 project running
- ✅ Design system imported
- ✅ Button component working
- ✅ Dev server running
- ✅ Ready to build more components

---

**Bắt đầu với Step 1! 🚀**
