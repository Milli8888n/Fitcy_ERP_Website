// Auto-generated Component Type Definitions
// Generated: 2026-02-05T15:42:02.511Z

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

export interface HomeHeaderProps {
  slides: HomeSlide[]; // Array of slide data
  autoplay?: boolean; // Enable auto-advance slides (default: true)
  interval?: number; // Autoplay interval in ms (default: 5000)
}

export interface HomeHeaderEmits {
  'slide-change': [];
  'theme-change': [];
}

export interface HomeHeaderSlots {
  default?: () => any;
}

export interface CurtainProps {
  isOpen: boolean; // Curtain open state
  variant?: 'enter' | 'transition-in' | 'transition-out'; // Animation variant (default: 'enter')
}

export interface CurtainEmits {
  'complete': [];
}

export interface MenuGridProps {
  isOpen: boolean; // Menu open state
  items: MenuItem[]; // Menu navigation items
}

export interface MenuGridEmits {
  'close': [];
  'navigate': [];
}

export interface MenuGridSlots {
  header?: () => any;
  footer?: () => any;
}

export interface PhiveClubsProps {
  clubs: Club[]; // Array of club data
}

export interface PhiveClubsEmits {
  'club-click': [];
}

export interface ThreeSceneProps {
  modelUrl: string; // GLB model URL
  instanceCount?: number; // Number of instances (default: 100)
  interactive?: boolean; // Enable click interactions (default: true)
}

export interface ThreeSceneEmits {
  'model-loaded': [];
  'instance-click': [];
}

export interface BackgroundProps {
  imageUrl: string; // Background image URL
  parallax?: boolean; // Enable parallax effect (default: true)
}

export interface RibbonProps {
  text: string; // Ribbon text content
  variant?: 'primary' | 'secondary'; // Visual variant (default: 'primary')
}

export interface ContentButtonProps {
  label: string; // Button label
  href?: string; // Link URL
  variant?: 'primary' | 'secondary' | 'ghost'; // Button style (default: 'primary')
  size?: 'small' | 'medium' | 'large'; // Button size (default: 'medium')
}

export interface ContentButtonEmits {
  'click': [];
}

export interface ContentButtonSlots {
  icon?: () => any;
}

export interface ImageAssetProps {
  src: string; // Image source URL
  alt: string; // Alt text for accessibility
  lazy?: boolean; // Enable lazy loading (default: true)
  aspectRatio?: string; // Aspect ratio (e.g., "16/9")
}

export interface ImageAssetEmits {
  'load': [];
  'error': [];
}

export interface BurgerProps {
  isOpen: boolean; // Menu open state
}

export interface BurgerEmits {
  'toggle': [];
}

// ============================================================================
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
