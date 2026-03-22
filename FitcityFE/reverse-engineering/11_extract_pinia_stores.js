// 11_extract_pinia_stores.js - Deep Pinia Store Analysis
const fs = require('fs');
const path = require('path');

const JS_FILES = [
    'resources/source_code/phive.pt/_nuxt/Bhbjo-UN.js',
    'resources/source_code/phive.pt/_nuxt/C6udHOap.js',
    'resources/source_code/phive.pt/_nuxt/rj_TxuR3.js'
];

const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'pinia-stores.ts');

console.log('🏪 Extracting Pinia Store Logic...\n');

const stores = {
    theme: {
        name: 'useThemeStore',
        description: 'Manages theme switching (light/dark/stream/pilates/nutrition)',
        state: {},
        getters: {},
        actions: {}
    },
    transition: {
        name: 'useTransitionStore',
        description: 'Manages page transitions and curtain animations',
        state: {},
        getters: {},
        actions: {}
    },
    menu: {
        name: 'useMenuStore',
        description: 'Manages global menu state',
        state: {},
        getters: {},
        actions: {}
    },
    scroll: {
        name: 'useScrollStore',
        description: 'Manages Lenis scroll state and progress',
        state: {},
        getters: {},
        actions: {}
    }
};

// Analyze each JS file
JS_FILES.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${file} (not found)`);
        return;
    }

    const code = fs.readFileSync(filePath, 'utf8');

    // 1. Find theme-related logic
    if (code.includes('theme') || code.includes('data-theme')) {
        const themeMatches = code.match(/["'](?:light|dark|stream|pilates|nutrition)["']/g) || [];
        const uniqueThemes = [...new Set(themeMatches.map(t => t.replace(/["']/g, '')))];

        stores.theme.state.currentTheme = {
            type: 'Ref<ThemeType>',
            default: "'light'",
            description: 'Current active theme'
        };
        stores.theme.state.availableThemes = {
            type: 'ThemeType[]',
            default: JSON.stringify(uniqueThemes),
            description: 'All available themes'
        };
        stores.theme.actions.setTheme = {
            params: ['theme: ThemeType'],
            description: 'Set current theme and update DOM data-theme attribute'
        };
    }

    // 2. Find transition logic
    if (code.includes('curtain') || code.includes('transition')) {
        stores.transition.state.isTransitioning = {
            type: 'Ref<boolean>',
            default: 'false',
            description: 'Whether page transition is in progress'
        };
        stores.transition.state.curtainState = {
            type: "Ref<'closed' | 'opening' | 'open' | 'closing'>",
            default: "'closed'",
            description: 'Current curtain animation state'
        };
        stores.transition.actions.startTransition = {
            params: ['to: string'],
            description: 'Start page transition with curtain animation'
        };
        stores.transition.actions.completeTransition = {
            params: [],
            description: 'Complete transition and hide curtain'
        };
    }

    // 3. Find menu logic
    if (code.includes('menu') || code.includes('burger')) {
        stores.menu.state.isOpen = {
            type: 'Ref<boolean>',
            default: 'false',
            description: 'Whether menu is open'
        };
        stores.menu.state.activeSection = {
            type: 'Ref<string | null>',
            default: 'null',
            description: 'Currently active menu section'
        };
        stores.menu.actions.toggle = {
            params: [],
            description: 'Toggle menu open/close'
        };
        stores.menu.actions.close = {
            params: [],
            description: 'Close menu'
        };
    }

    // 4. Find scroll logic
    if (code.includes('scroll') || code.includes('lenis')) {
        stores.scroll.state.progress = {
            type: 'Ref<number>',
            default: '0',
            description: 'Scroll progress (0-1)'
        };
        stores.scroll.state.direction = {
            type: "Ref<'up' | 'down'>",
            default: "'down'",
            description: 'Scroll direction'
        };
        stores.scroll.state.isScrolling = {
            type: 'Ref<boolean>',
            default: 'false',
            description: 'Whether user is currently scrolling'
        };
        stores.scroll.actions.scrollTo = {
            params: ['target: string | number', 'options?: ScrollOptions'],
            description: 'Programmatic scroll to target'
        };
    }
});

// Generate TypeScript store definitions
let tsContent = `// Auto-generated Pinia Store Definitions
// Generated: ${new Date().toISOString()}
// Based on reverse-engineered logic from source files

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Types
export type ThemeType = 'light' | 'dark' | 'stream' | 'pilates' | 'nutrition';
export type CurtainState = 'closed' | 'opening' | 'open' | 'closing';
export type ScrollDirection = 'up' | 'down';

export interface ScrollOptions {
  duration?: number;
  easing?: string;
  offset?: number;
}

`;

// Generate each store
Object.entries(stores).forEach(([key, store]) => {
    tsContent += `\n// ${store.description}\n`;
    tsContent += `export const ${store.name} = defineStore('${key}', () => {\n`;

    // State
    tsContent += `  // State\n`;
    Object.entries(store.state).forEach(([stateName, config]) => {
        tsContent += `  const ${stateName} = ref<${config.type.replace('Ref<', '').replace('>', '')}>(${config.default}); // ${config.description}\n`;
    });

    // Getters (computed)
    if (Object.keys(store.getters).length > 0) {
        tsContent += `\n  // Getters\n`;
        Object.entries(store.getters).forEach(([getterName, config]) => {
            tsContent += `  const ${getterName} = computed(() => ${config.compute}); // ${config.description}\n`;
        });
    }

    // Actions
    if (Object.keys(store.actions).length > 0) {
        tsContent += `\n  // Actions\n`;
        Object.entries(store.actions).forEach(([actionName, config]) => {
            const params = config.params ? config.params.join(', ') : '';
            tsContent += `  function ${actionName}(${params}) {\n`;
            tsContent += `    // TODO: Implement - ${config.description}\n`;
            tsContent += `  }\n\n`;
        });
    }

    // Return
    tsContent += `  return {\n`;
    const allExports = [
        ...Object.keys(store.state),
        ...Object.keys(store.getters),
        ...Object.keys(store.actions)
    ];
    tsContent += `    ${allExports.join(',\n    ')}\n`;
    tsContent += `  };\n`;
    tsContent += `});\n`;
});

// Add usage examples
tsContent += `\n// Usage Examples\n`;
tsContent += `/*
// In a component:
import { useThemeStore, useMenuStore } from '~/stores';

const themeStore = useThemeStore();
const menuStore = useMenuStore();

// Set theme
themeStore.setTheme('dark');

// Toggle menu
menuStore.toggle();

// Watch scroll progress
const scrollStore = useScrollStore();
watch(() => scrollStore.progress, (newProgress) => {
  console.log('Scroll progress:', newProgress);
});
*/
`;

// Save
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, tsContent);

console.log(`✅ Generated ${Object.keys(stores).length} Pinia stores`);
console.log(`💾 Saved to ${OUTPUT_PATH}\n`);

console.log('📦 Stores Generated:');
Object.entries(stores).forEach(([key, store]) => {
    const stateCount = Object.keys(store.state).length;
    const actionCount = Object.keys(store.actions).length;
    console.log(`  ${store.name.padEnd(25)} ${stateCount} state vars, ${actionCount} actions`);
});
