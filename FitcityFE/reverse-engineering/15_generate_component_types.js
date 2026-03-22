// 15_generate_component_types.js - Generate TypeScript Component Interfaces
const fs = require('fs');
const path = require('path');

const COMPONENT_TREE_PATH = path.join(process.cwd(), 'docs', 'analysis', 'component-tree.json');
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'component-types.ts');

console.log('🎨 Generating Component TypeScript Interfaces...\n');

// Read component tree
const componentTree = JSON.parse(fs.readFileSync(COMPONENT_TREE_PATH, 'utf8'));

// Define component interfaces based on extracted data
const componentInterfaces = {
    'home-header': {
        props: {
            slides: { type: 'HomeSlide[]', required: true, description: 'Array of slide data' },
            autoplay: { type: 'boolean', default: 'true', description: 'Enable auto-advance slides' },
            interval: { type: 'number', default: '5000', description: 'Autoplay interval in ms' }
        },
        emits: ['slide-change', 'theme-change'],
        slots: ['default']
    },
    'curtain': {
        props: {
            isOpen: { type: 'boolean', required: true, description: 'Curtain open state' },
            variant: { type: "'enter' | 'transition-in' | 'transition-out'", default: "'enter'", description: 'Animation variant' }
        },
        emits: ['complete'],
        slots: []
    },
    'menu-grid': {
        props: {
            isOpen: { type: 'boolean', required: true, description: 'Menu open state' },
            items: { type: 'MenuItem[]', required: true, description: 'Menu navigation items' }
        },
        emits: ['close', 'navigate'],
        slots: ['header', 'footer']
    },
    'phive-clubs': {
        props: {
            clubs: { type: 'Club[]', required: true, description: 'Array of club data' }
        },
        emits: ['club-click'],
        slots: []
    },
    'three-scene': {
        props: {
            modelUrl: { type: 'string', required: true, description: 'GLB model URL' },
            instanceCount: { type: 'number', default: '100', description: 'Number of instances' },
            interactive: { type: 'boolean', default: 'true', description: 'Enable click interactions' }
        },
        emits: ['model-loaded', 'instance-click'],
        slots: []
    },
    'background': {
        props: {
            imageUrl: { type: 'string', required: true, description: 'Background image URL' },
            parallax: { type: 'boolean', default: 'true', description: 'Enable parallax effect' }
        },
        emits: [],
        slots: []
    },
    'ribbon': {
        props: {
            text: { type: 'string', required: true, description: 'Ribbon text content' },
            variant: { type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant' }
        },
        emits: [],
        slots: []
    },
    'content-button': {
        props: {
            label: { type: 'string', required: true, description: 'Button label' },
            href: { type: 'string', description: 'Link URL' },
            variant: { type: "'primary' | 'secondary' | 'ghost'", default: "'primary'", description: 'Button style' },
            size: { type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Button size' }
        },
        emits: ['click'],
        slots: ['icon']
    },
    'image-asset': {
        props: {
            src: { type: 'string', required: true, description: 'Image source URL' },
            alt: { type: 'string', required: true, description: 'Alt text for accessibility' },
            lazy: { type: 'boolean', default: 'true', description: 'Enable lazy loading' },
            aspectRatio: { type: 'string', description: 'Aspect ratio (e.g., "16/9")' }
        },
        emits: ['load', 'error'],
        slots: []
    },
    'burger': {
        props: {
            isOpen: { type: 'boolean', required: true, description: 'Menu open state' }
        },
        emits: ['toggle'],
        slots: []
    }
};

// Generate TypeScript content
let tsContent = `// Auto-generated Component Type Definitions
// Generated: ${new Date().toISOString()}

import type { SanityImage } from './sanity-schema';

// ============================================================================
// Base Types
// ============================================================================

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface HomeSlide {
  title: string;
  subtitle?: string;
  backgroundImage: SanityImage;
  theme: 'light' | 'dark' | 'stream' | 'pilates' | 'nutrition';
  cta?: {
    label: string;
    url: string;
  };
}

export interface Club {
  _id: string;
  title: string;
  slug: { current: string };
  location: string;
  heroImage: SanityImage;
  description: string;
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

`;

Object.entries(componentInterfaces).forEach(([componentName, config]) => {
    const pascalName = componentName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

    // Props interface
    tsContent += `export interface ${pascalName}Props {\n`;
    Object.entries(config.props).forEach(([propName, propConfig]) => {
        const optional = propConfig.required ? '' : '?';
        const comment = propConfig.description ? ` // ${propConfig.description}` : '';
        const defaultValue = propConfig.default ? ` (default: ${propConfig.default})` : '';
        tsContent += `  ${propName}${optional}: ${propConfig.type};${comment}${defaultValue}\n`;
    });
    tsContent += `}\n\n`;

    // Emits interface (if any)
    if (config.emits.length > 0) {
        tsContent += `export interface ${pascalName}Emits {\n`;
        config.emits.forEach(emit => {
            tsContent += `  '${emit}': [];\n`;
        });
        tsContent += `}\n\n`;
    }

    // Slots interface (if any)
    if (config.slots.length > 0) {
        tsContent += `export interface ${pascalName}Slots {\n`;
        config.slots.forEach(slot => {
            tsContent += `  ${slot}?: () => any;\n`;
        });
        tsContent += `}\n\n`;
    }
});

// Add usage example
tsContent += `// ============================================================================
// Usage Examples
// ============================================================================

/*
// In a component:
<script setup lang="ts">
import type { HomeHeaderProps, HomeHeaderEmits } from '~/types/component-types';

const props = defineProps<HomeHeaderProps>();
const emit = defineEmits<HomeHeaderEmits>();

// TypeScript will now provide autocomplete and type checking!
</script>

<template>
  <div class="home-header">
    <Background
      v-for="slide in props.slides"
      :key="slide.title"
      :image-url="slide.backgroundImage.asset._ref"
      :parallax="true"
    />
  </div>
</template>
*/
`;

// Save
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, tsContent);

console.log(`✅ Generated TypeScript interfaces for ${Object.keys(componentInterfaces).length} components`);
console.log(`💾 Saved to ${OUTPUT_PATH}\n`);

console.log('📦 Components with Types:');
Object.keys(componentInterfaces).forEach(name => {
    const config = componentInterfaces[name];
    const propsCount = Object.keys(config.props).length;
    const emitsCount = config.emits.length;
    console.log(`  ${name.padEnd(20)} ${propsCount} props, ${emitsCount} emits`);
});
