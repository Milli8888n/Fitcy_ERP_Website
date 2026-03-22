// 13_document_error_states.js - Document Error Handling Patterns
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'error-handling.json');

console.log('🚨 Documenting Error Handling Patterns...\n');

const errorStates = {
    loading: [
        {
            component: 'Curtain',
            state: 'page-loading',
            trigger: 'Route navigation',
            ui: 'Full-screen curtain with animated lines',
            duration: '1-2 seconds',
            fallback: 'Show curtain for max 5s, then force complete'
        },
        {
            component: 'ThreeScene',
            state: '3d-model-loading',
            trigger: 'GLB file loading',
            ui: 'Placeholder geometry or loading spinner',
            duration: 'Until model loads',
            fallback: 'Show simple colored spheres if model fails'
        },
        {
            component: 'ImageAsset',
            state: 'image-loading',
            trigger: 'Image fetch',
            ui: 'Blur placeholder or skeleton',
            duration: 'Until image loads',
            fallback: 'Show solid color background'
        },
        {
            component: 'SanityContent',
            state: 'data-fetching',
            trigger: 'CMS API call',
            ui: 'Skeleton loaders for text/images',
            duration: 'Until data arrives',
            fallback: 'Show cached data or static fallback'
        }
    ],

    errors: [
        {
            type: 'network-error',
            trigger: 'API timeout or offline',
            ui: 'Toast notification: "Connection lost. Please check your internet."',
            action: 'Retry button',
            recovery: 'Auto-retry after 5s, max 3 attempts'
        },
        {
            type: '404-not-found',
            trigger: 'Invalid route',
            ui: 'Custom 404 page with navigation back to home',
            action: 'Redirect to home after 5s',
            recovery: 'Show recent pages or sitemap'
        },
        {
            type: 'model-load-error',
            trigger: '3D model fails to load',
            ui: 'Show fallback geometry (colored spheres)',
            action: 'Log error to console',
            recovery: 'Continue without 3D, show 2D alternative'
        },
        {
            type: 'image-load-error',
            trigger: 'Image 404 or CORS error',
            ui: 'Show placeholder with icon',
            action: 'Retry once, then show placeholder',
            recovery: 'Use solid color background'
        },
        {
            type: 'sanity-error',
            trigger: 'CMS API error',
            ui: 'Show cached content or static fallback',
            action: 'Log error, show user-friendly message',
            recovery: 'Use stale-while-revalidate pattern'
        },
        {
            type: 'animation-error',
            trigger: 'GSAP timeline fails',
            ui: 'Skip animation, show final state',
            action: 'Log error to console',
            recovery: 'Disable animations for session'
        }
    ],

    validation: [
        {
            form: 'contact-form',
            field: 'email',
            validation: 'Email format',
            error: 'Please enter a valid email address',
            trigger: 'onBlur or onSubmit'
        },
        {
            form: 'contact-form',
            field: 'message',
            validation: 'Required, min 10 chars',
            error: 'Message must be at least 10 characters',
            trigger: 'onBlur or onSubmit'
        },
        {
            form: 'schedule-visit',
            field: 'phone',
            validation: 'Phone format',
            error: 'Please enter a valid phone number',
            trigger: 'onBlur'
        }
    ],

    accessibility: [
        {
            scenario: 'keyboard-navigation',
            requirement: 'All interactive elements must be keyboard accessible',
            implementation: 'Add tabindex, focus styles, aria-labels',
            test: 'Tab through entire page without mouse'
        },
        {
            scenario: 'screen-reader',
            requirement: 'All images must have alt text',
            implementation: 'Add alt attributes to all <img> tags',
            test: 'Use NVDA/JAWS to navigate'
        },
        {
            scenario: 'reduced-motion',
            requirement: 'Respect prefers-reduced-motion',
            implementation: '@media (prefers-reduced-motion: reduce) { /* disable animations */ }',
            test: 'Enable reduced motion in OS settings'
        },
        {
            scenario: 'color-contrast',
            requirement: 'WCAG AA contrast ratio (4.5:1)',
            implementation: 'Use design system colors with sufficient contrast',
            test: 'Use axe DevTools or Lighthouse'
        }
    ]
};

// Implementation recommendations
const implementation = {
    errorBoundaries: {
        library: 'Vue 3 onErrorCaptured',
        pattern: `
// In App.vue or layout
import { onErrorCaptured } from 'vue';

onErrorCaptured((err, instance, info) => {
  console.error('Component error:', err, info);
  // Log to error tracking service (Sentry, etc.)
  return false; // Prevent error propagation
});
        `.trim()
    },

    loadingStates: {
        library: 'Suspense + async components',
        pattern: `
// In component
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <LoadingSkeleton />
  </template>
</Suspense>
        `.trim()
    },

    toastNotifications: {
        library: 'vue-toastification or custom',
        pattern: `
// Install: npm install vue-toastification
import { useToast } from 'vue-toastification';

const toast = useToast();
toast.error('Connection lost. Please check your internet.');
        `.trim()
    },

    retryLogic: {
        library: 'Custom composable',
        pattern: `
// composables/useRetry.ts
export function useRetry(fn, maxAttempts = 3) {
  let attempts = 0;
  
  async function retry() {
    try {
      return await fn();
    } catch (error) {
      if (++attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 1000 * attempts));
        return retry();
      }
      throw error;
    }
  }
  
  return retry;
}
        `.trim()
    }
};

// Save
const output = {
    summary: {
        timestamp: new Date().toISOString(),
        totalStates: Object.values(errorStates).flat().length,
        breakdown: {
            loading: errorStates.loading.length,
            errors: errorStates.errors.length,
            validation: errorStates.validation.length,
            accessibility: errorStates.accessibility.length
        }
    },
    errorStates,
    implementation,
    recommendations: [
        'Use Sentry or similar for error tracking in production',
        'Implement stale-while-revalidate for CMS data',
        'Add retry logic for all network requests',
        'Show user-friendly error messages (avoid technical jargon)',
        'Test all error states manually before deployment',
        'Add E2E tests for critical error scenarios (Playwright)',
        'Implement graceful degradation (site works without JS)',
        'Use progressive enhancement for animations'
    ]
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

console.log(`✅ Documented error handling patterns:`);
console.log(`   ${errorStates.loading.length} loading states`);
console.log(`   ${errorStates.errors.length} error scenarios`);
console.log(`   ${errorStates.validation.length} validation rules`);
console.log(`   ${errorStates.accessibility.length} a11y requirements`);
console.log(`\n💾 Saved to ${OUTPUT_PATH}`);

console.log(`\n📚 Implementation Patterns:`);
console.log(`   Error Boundaries → Vue 3 onErrorCaptured`);
console.log(`   Loading States  → Suspense + async components`);
console.log(`   Notifications   → vue-toastification`);
console.log(`   Retry Logic     → Custom composable`);
