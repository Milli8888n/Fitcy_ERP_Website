// Auto-generated Pinia Store Definitions
// Generated: 2026-02-05T15:42:02.275Z
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


// Manages theme switching (light/dark/stream/pilates/nutrition)
export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<ThemeType>('light'); // Current active theme
  const availableThemes = ref<ThemeType[]>(["stream","dark","light"]); // All available themes

  // Actions
  function setTheme(theme: ThemeType) {
    // TODO: Implement - Set current theme and update DOM data-theme attribute
  }

  return {
    currentTheme,
    availableThemes,
    setTheme
  };
});

// Manages page transitions and curtain animations
export const useTransitionStore = defineStore('transition', () => {
  // State
  const isTransitioning = ref<boolean>(false); // Whether page transition is in progress
  const curtainState = ref<'closed' | 'opening' | 'open' | 'closing'>('closed'); // Current curtain animation state

  // Actions
  function startTransition(to: string) {
    // TODO: Implement - Start page transition with curtain animation
  }

  function completeTransition() {
    // TODO: Implement - Complete transition and hide curtain
  }

  return {
    isTransitioning,
    curtainState,
    startTransition,
    completeTransition
  };
});

// Manages global menu state
export const useMenuStore = defineStore('menu', () => {
  // State
  const isOpen = ref<boolean>(false); // Whether menu is open
  const activeSection = ref<string | null>(null); // Currently active menu section

  // Actions
  function toggle() {
    // TODO: Implement - Toggle menu open/close
  }

  function close() {
    // TODO: Implement - Close menu
  }

  return {
    isOpen,
    activeSection,
    toggle,
    close
  };
});

// Manages Lenis scroll state and progress
export const useScrollStore = defineStore('scroll', () => {
  // State
  const progress = ref<number>(0); // Scroll progress (0-1)
  const direction = ref<'up' | 'down'>('down'); // Scroll direction
  const isScrolling = ref<boolean>(false); // Whether user is currently scrolling

  // Actions
  function scrollTo(target: string | number, options?: ScrollOptions) {
    // TODO: Implement - Programmatic scroll to target
  }

  return {
    progress,
    direction,
    isScrolling,
    scrollTo
  };
});

// Usage Examples
/*
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
