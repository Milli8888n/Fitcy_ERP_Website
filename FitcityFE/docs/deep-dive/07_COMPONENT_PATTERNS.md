# 🧩 COMPONENT PATTERNS - PHIVE.PT

> Advanced Vue component patterns và best practices

---

## 📋 PATTERNS

### 1. Compound Components

```vue
<!-- Parent component provides context -->
<Accordion>
  <AccordionItem title="Item 1">
    Content 1
  </AccordionItem>
  <AccordionItem title="Item 2">
    Content 2
  </AccordionItem>
</Accordion>
```

### 2. Renderless Components

```vue
<!-- Logic component -->
<script setup>
const { data, loading, error } = useFetch('/api/data')

defineExpose({ data, loading, error })
</script>

<!-- Usage -->
<DataProvider v-slot="{ data, loading }">
  <div v-if="loading">Loading...</div>
  <div v-else>{{ data }}</div>
</DataProvider>
```

### 3. Provide/Inject Pattern

```vue
<!-- Parent -->
<script setup>
const theme = ref('light')
provide('theme', theme)
</script>

<!-- Child (any level) -->
<script setup>
const theme = inject('theme')
</script>
```

### 4. Composables

```javascript
// composables/useCounter.js
export const useCounter = (initialValue = 0) => {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  }
}
```

### 5. Slot Patterns

```vue
<!-- Named slots -->
<template>
  <div class="card">
    <header v-if="$slots.header">
      <slot name="header" />
    </header>
    
    <main>
      <slot />
    </main>
    
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<!-- Scoped slots -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="index">
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>
```

---

**Created by:** Component Patterns Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete
