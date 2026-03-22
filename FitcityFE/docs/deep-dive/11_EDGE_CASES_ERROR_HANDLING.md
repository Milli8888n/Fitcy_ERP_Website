# ⚠️ EDGE CASES & ERROR HANDLING

> Comprehensive guide to handling edge cases, errors, and exceptional scenarios

---

## 📋 TABLE OF CONTENTS

1. [Common Edge Cases](#edge-cases)
2. [Error Handling Patterns](#error-handling)
3. [Loading States](#loading)
4. [Empty States](#empty)
5. [Network Errors](#network)
6. [Form Validation](#validation)
7. [Implementation Guide](#implementation)

---

## 🔍 COMMON EDGE CASES {#edge-cases}

### 1. No Data Available

```vue
<template>
  <div class="clubs-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <Spinner />
      <p>Loading clubs...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <Icon name="alert-circle" />
      <h2>Oops! Something went wrong</h2>
      <p>{{ error.message }}</p>
      <button @click="retry">Try Again</button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="clubs.length === 0" class="empty-state">
      <Icon name="inbox" />
      <h2>No clubs found</h2>
      <p>We couldn't find any clubs matching your criteria.</p>
      <button @click="clearFilters">Clear Filters</button>
    </div>
    
    <!-- Success State -->
    <div v-else class="clubs-grid">
      <ClubCard
        v-for="club in clubs"
        :key="club._id"
        :club="club"
      />
    </div>
  </div>
</template>

<script setup>
const { data: clubs, pending: loading, error, refresh } = await useFetch('/api/clubs')

const retry = () => {
  refresh()
}

const clearFilters = () => {
  // Clear filter logic
}
</script>
```

### 2. Slow Network

```vue
<script setup>
// Show loading after 300ms delay
const showLoading = ref(false)
const loadingTimeout = ref(null)

onMounted(() => {
  loadingTimeout.value = setTimeout(() => {
    showLoading.value = true
  }, 300)
})

watch(() => data.value, () => {
  clearTimeout(loadingTimeout.value)
  showLoading.value = false
})
</script>

<template>
  <div v-if="showLoading" class="loading-skeleton">
    <SkeletonCard v-for="i in 6" :key="i" />
  </div>
</template>
```

### 3. Image Load Failures

```vue
<template>
  <div class="image-wrapper">
    <img
      :src="imageSrc"
      :alt="alt"
      @error="handleImageError"
      @load="handleImageLoad"
    >
    
    <!-- Fallback -->
    <div v-if="imageError" class="image-fallback">
      <Icon name="image-off" />
      <span>Image unavailable</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  src: String,
  alt: String,
  fallback: {
    type: String,
    default: '/images/placeholder.jpg'
  }
})

const imageSrc = ref(props.src)
const imageError = ref(false)
const imageLoaded = ref(false)

const handleImageError = () => {
  if (imageSrc.value !== props.fallback) {
    imageSrc.value = props.fallback
  } else {
    imageError.value = true
  }
}

const handleImageLoad = () => {
  imageLoaded.value = true
}
</script>
```

### 4. Offline Mode

```vue
<script setup>
const isOnline = ref(navigator.onLine)

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

const handleOnline = () => {
  isOnline.value = true
  // Retry failed requests
  retryFailedRequests()
}

const handleOffline = () => {
  isOnline.value = false
}
</script>

<template>
  <!-- Offline Banner -->
  <Transition name="slide-down">
    <div v-if="!isOnline" class="offline-banner">
      <Icon name="wifi-off" />
      <span>You're offline. Some features may be unavailable.</span>
    </div>
  </Transition>
</template>
```

### 5. Session Expiry

```vue
<script setup>
const { $auth } = useNuxtApp()

// Check session on mount
onMounted(async () => {
  try {
    await $auth.check()
  } catch (error) {
    if (error.statusCode === 401) {
      // Session expired
      await $auth.logout()
      navigateTo('/login?expired=true')
    }
  }
})

// Refresh token before expiry
const refreshInterval = setInterval(async () => {
  try {
    await $auth.refresh()
  } catch (error) {
    clearInterval(refreshInterval)
    await $auth.logout()
    navigateTo('/login?expired=true')
  }
}, 15 * 60 * 1000) // Every 15 minutes

onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script>
```

---

## 🚨 ERROR HANDLING PATTERNS {#error-handling}

### Global Error Handler

```javascript
// plugins/error-handler.js
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Global error:', error)
    console.error('Component:', instance)
    console.error('Error info:', info)
    
    // Send to error tracking service
    if (process.client) {
      // Sentry, LogRocket, etc.
      window.$errorTracker?.captureException(error, {
        extra: { info }
      })
    }
    
    // Show user-friendly error
    nuxtApp.$toast.error('Something went wrong. Please try again.')
  }
  
  // Handle promise rejections
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      window.$errorTracker?.captureException(event.reason)
    })
  }
})
```

### API Error Handling

```javascript
// composables/useApi.js
export const useApi = () => {
  const handleError = (error) => {
    const statusCode = error.response?.status
    
    switch (statusCode) {
      case 400:
        return {
          title: 'Invalid Request',
          message: error.response.data.message || 'Please check your input and try again.'
        }
      
      case 401:
        return {
          title: 'Unauthorized',
          message: 'Please log in to continue.',
          action: () => navigateTo('/login')
        }
      
      case 403:
        return {
          title: 'Forbidden',
          message: 'You don\'t have permission to access this resource.'
        }
      
      case 404:
        return {
          title: 'Not Found',
          message: 'The requested resource could not be found.'
        }
      
      case 429:
        return {
          title: 'Too Many Requests',
          message: 'Please slow down and try again in a moment.'
        }
      
      case 500:
      case 502:
      case 503:
        return {
          title: 'Server Error',
          message: 'Our servers are experiencing issues. Please try again later.'
        }
      
      default:
        return {
          title: 'Error',
          message: 'An unexpected error occurred. Please try again.'
        }
    }
  }
  
  const request = async (url, options = {}) => {
    try {
      const response = await $fetch(url, options)
      return { data: response, error: null }
    } catch (error) {
      const errorInfo = handleError(error)
      return { data: null, error: errorInfo }
    }
  }
  
  return {
    request,
    handleError
  }
}
```

### Component Error Boundary

```vue
<!-- components/ErrorBoundary.vue -->
<template>
  <div>
    <div v-if="error" class="error-boundary">
      <Icon name="alert-triangle" />
      <h2>{{ errorTitle }}</h2>
      <p>{{ errorMessage }}</p>
      <button @click="reset">Try Again</button>
    </div>
    
    <slot v-else />
  </div>
</template>

<script setup>
const error = ref(null)
const errorTitle = ref('Something went wrong')
const errorMessage = ref('An error occurred while loading this component.')

const reset = () => {
  error.value = null
}

onErrorCaptured((err, instance, info) => {
  error.value = err
  console.error('Error captured:', err, info)
  
  // Prevent error from propagating
  return false
})
</script>
```

---

## ⏳ LOADING STATES {#loading}

### Skeleton Screens

```vue
<!-- components/SkeletonCard.vue -->
<template>
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-title"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text short"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  
  .skeleton-image {
    aspect-ratio: 4 / 3;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  .skeleton-content {
    padding: 1.5rem;
  }
  
  .skeleton-title {
    height: 24px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .skeleton-text {
    height: 16px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    
    &.short {
      width: 60%;
    }
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

### Progressive Loading

```vue
<script setup>
const items = ref([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  
  try {
    const { data } = await $fetch('/api/items', {
      query: {
        page: page.value,
        limit: 20
      }
    })
    
    items.value.push(...data.items)
    hasMore.value = data.hasMore
    page.value++
  } catch (error) {
    console.error('Failed to load more:', error)
  } finally {
    loading.value = false
  }
}

// Infinite scroll
const observer = ref(null)
const sentinel = ref(null)

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMore()
    }
  })
  
  if (sentinel.value) {
    observer.value.observe(sentinel.value)
  }
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
  <div>
    <div class="items-grid">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </div>
    
    <!-- Sentinel for infinite scroll -->
    <div ref="sentinel" class="sentinel"></div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-more">
      <Spinner />
      <span>Loading more...</span>
    </div>
    
    <!-- End message -->
    <div v-if="!hasMore && items.length > 0" class="end-message">
      <p>You've reached the end!</p>
    </div>
  </div>
</template>
```

---

## 📭 EMPTY STATES {#empty}

### No Results

```vue
<template>
  <div class="empty-state">
    <div class="empty-icon">
      <Icon name="search" size="64" />
    </div>
    
    <h2>No results found</h2>
    <p>We couldn't find any {{ resourceType }} matching "{{ searchQuery }}"</p>
    
    <div class="empty-actions">
      <button @click="clearSearch">Clear Search</button>
      <button @click="resetFilters">Reset Filters</button>
    </div>
    
    <!-- Suggestions -->
    <div v-if="suggestions.length > 0" class="suggestions">
      <p>Try searching for:</p>
      <ul>
        <li
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  
  .empty-icon {
    margin-bottom: 2rem;
    opacity: 0.3;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.125rem;
    opacity: 0.7;
    margin-bottom: 2rem;
  }
  
  .empty-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
    
    button {
      padding: 0.75rem 1.5rem;
      border: 1px solid currentColor;
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &:hover {
        background: currentColor;
        color: white;
      }
    }
  }
  
  .suggestions {
    ul {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      
      li {
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>
```

---

## 🌐 NETWORK ERRORS {#network}

### Retry Logic

```javascript
// composables/useRetry.js
export const useRetry = (fn, options = {}) => {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    onRetry = () => {}
  } = options
  
  const execute = async (...args) => {
    let lastError
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries) {
          const waitTime = delay * Math.pow(backoff, attempt)
          onRetry(attempt + 1, waitTime)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
    }
    
    throw lastError
  }
  
  return execute
}

// Usage
const fetchWithRetry = useRetry(
  async () => {
    const response = await $fetch('/api/data')
    return response
  },
  {
    maxRetries: 3,
    delay: 1000,
    onRetry: (attempt, delay) => {
      console.log(`Retry attempt ${attempt} after ${delay}ms`)
    }
  }
)
```

### Request Timeout

```javascript
// composables/useTimeout.js
export const useTimeout = (fn, timeout = 10000) => {
  return async (...args) => {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'))
        }, timeout)
      })
    ])
  }
}

// Usage
const fetchWithTimeout = useTimeout(
  async () => {
    const response = await $fetch('/api/data')
    return response
  },
  10000 // 10 seconds
)
```

---

## ✅ FORM VALIDATION {#validation}

### Client-Side Validation

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Email Field -->
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        :class="{ error: errors.email }"
        @blur="validateEmail"
      >
      <span v-if="errors.email" class="error-message">
        {{ errors.email }}
      </span>
    </div>
    
    <!-- Password Field -->
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        :class="{ error: errors.password }"
        @blur="validatePassword"
      >
      <span v-if="errors.password" class="error-message">
        {{ errors.password }}
      </span>
    </div>
    
    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="!isValid || submitting"
    >
      <Spinner v-if="submitting" />
      <span v-else>Submit</span>
    </button>
  </form>
</template>

<script setup>
const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const submitting = ref(false)

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else {
    errors.password = ''
  }
}

const isValid = computed(() => {
  return form.email && form.password && !errors.email && !errors.password
})

const handleSubmit = async () => {
  // Validate all fields
  validateEmail()
  validatePassword()
  
  if (!isValid.value) return
  
  submitting.value = true
  
  try {
    await $fetch('/api/submit', {
      method: 'POST',
      body: form
    })
    
    // Success
    navigateTo('/success')
  } catch (error) {
    // Handle error
    console.error('Submission failed:', error)
  } finally {
    submitting.value = false
  }
}
</script>
```

---

## 🚀 IMPLEMENTATION CHECKLIST {#implementation}

### Error Handling
- [ ] Global error handler configured
- [ ] API error handling implemented
- [ ] Error boundaries in place
- [ ] User-friendly error messages
- [ ] Error tracking service integrated

### Loading States
- [ ] Skeleton screens for slow loads
- [ ] Loading indicators for actions
- [ ] Progressive loading for lists
- [ ] Optimistic UI updates

### Empty States
- [ ] No results state
- [ ] No data state
- [ ] Filtered results empty state
- [ ] Helpful suggestions provided

### Network Handling
- [ ] Retry logic implemented
- [ ] Timeout handling
- [ ] Offline mode detection
- [ ] Failed request queue

### Form Validation
- [ ] Client-side validation
- [ ] Server-side validation
- [ ] Real-time feedback
- [ ] Accessible error messages

---

**Created by:** Error Handling Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete  
**Next:** Testing & QA
