// 19_performance_guide.js - Performance Optimization Guide
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'performance-guide.json');

console.log('⚡ Generating Performance Optimization Guide...\n');

const performanceGuide = {
    lazyLoading: {
        images: {
            strategy: 'Native lazy loading + Intersection Observer',
            implementation: `
<img 
  :src="imageUrl" 
  loading="lazy" 
  decoding="async"
  :alt="altText"
/>

// Or with Intersection Observer for more control
const { stop } = useIntersectionObserver(
  imageRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadImage();
      stop();
    }
  }
);
      `.trim()
        },
        components: {
            strategy: 'Vue defineAsyncComponent + Suspense',
            implementation: `
// Lazy load heavy components
const ThreeScene = defineAsyncComponent(() => 
  import('~/components/ThreeScene.vue')
);

// In template
<Suspense>
  <template #default>
    <ThreeScene />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>
      `.trim()
        },
        routes: {
            strategy: 'Nuxt automatic code splitting',
            implementation: 'Nuxt automatically splits routes. No config needed.'
        }
    },

    imageOptimization: {
        formats: {
            webp: 'Primary format (80% smaller than JPEG)',
            avif: 'Future format (50% smaller than WebP)',
            fallback: 'JPEG for old browsers'
        },
        sizes: {
            mobile: '640w, 768w',
            tablet: '1024w, 1280w',
            desktop: '1920w, 2560w'
        },
        implementation: `
// Use Sanity CDN optimization
const imageUrl = buildImageUrl(image.asset._ref, {
  width: 1920,
  height: 1080,
  quality: 80,
  format: 'webp',
  fit: 'crop'
});

// Or use Nuxt Image
<NuxtImg
  :src="imageUrl"
  sizes="mobile:640px tablet:1024px desktop:1920px"
  format="webp"
  quality="80"
  loading="lazy"
/>
    `.trim()
    },

    bundleSplitting: {
        vendors: {
            gsap: 'Separate chunk (large library)',
            three: 'Separate chunk (3D library)',
            lenis: 'Inline (small library)'
        },
        strategy: 'Split by route + manual chunks for large libraries',
        implementation: `
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap', '@gsap/shockingly'],
            'three': ['three', '@tresjs/core']
          }
        }
      }
    }
  }
});
    `.trim()
    },

    caching: {
        staticAssets: {
            strategy: 'Cache-Control headers',
            duration: '1 year for fonts/images, 1 hour for HTML/CSS/JS',
            implementation: `
// In server config (Vercel, Netlify, etc.)
/_nuxt/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=3600, must-revalidate
      `.trim()
        },
        apiData: {
            strategy: 'Stale-while-revalidate with Nuxt useFetch',
            implementation: `
// Fetch with caching
const { data: clubs } = await useFetch('/api/clubs', {
  key: 'clubs',
  getCachedData: (key) => useNuxtApp().payload.data[key],
  transform: (data) => data.clubs
});

// Or with manual cache control
const cachedClubs = useState('clubs', () => null);
if (!cachedClubs.value) {
  cachedClubs.value = await $fetch('/api/clubs');
}
      `.trim()
        }
    },

    animations: {
        performance: {
            useWillChange: 'Add will-change for animated properties',
            useTransform: 'Prefer transform over top/left',
            useGPU: 'Use translateZ(0) to force GPU acceleration'
        },
        implementation: `
// Good: GPU-accelerated
gsap.to(element, {
  x: 100,
  y: 50,
  rotation: 45,
  scale: 1.2,
  force3D: true
});

// Bad: CPU-bound
gsap.to(element, {
  left: '100px',
  top: '50px'
});

// CSS will-change
.animated-element {
  will-change: transform, opacity;
}
    `.trim()
    },

    metrics: {
        targets: {
            FCP: '< 1.8s (First Contentful Paint)',
            LCP: '< 2.5s (Largest Contentful Paint)',
            FID: '< 100ms (First Input Delay)',
            CLS: '< 0.1 (Cumulative Layout Shift)',
            TTI: '< 3.8s (Time to Interactive)'
        },
        tools: [
            'Lighthouse (Chrome DevTools)',
            'WebPageTest',
            'Vercel Analytics',
            'Google PageSpeed Insights'
        ]
    },

    recommendations: [
        'Lazy load images below the fold',
        'Preload critical fonts (AcidGrotesk, PPFormula)',
        'Use webp/avif for images',
        'Split GSAP into separate chunk',
        'Conditionally load 3D scene on mobile (check device performance)',
        'Use CSS containment for isolated components',
        'Implement virtual scrolling for long lists',
        'Defer non-critical JavaScript',
        'Use resource hints (preconnect, dns-prefetch)',
        'Minimize main thread work (use Web Workers for heavy computations)'
    ]
};

// Save
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(performanceGuide, null, 2));

console.log(`✅ Generated performance optimization guide`);
console.log(`💾 Saved to ${OUTPUT_PATH}\n`);

console.log('⚡ Performance Strategies:');
console.log('   3 lazy loading strategies');
console.log('   2 caching strategies');
console.log('   1 bundle splitting config');
console.log('   5 Core Web Vitals targets');
console.log('   10 optimization recommendations');
