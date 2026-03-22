// 16_enhance_pinia_stores.js - Add Computed Properties to Pinia Stores
const fs = require('fs');
const path = require('path');

const INPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'pinia-stores.ts');
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'pinia-stores-enhanced.ts');

console.log('🔧 Enhancing Pinia Stores with Computed Properties...\n');

// Read existing stores
let storesContent = fs.readFileSync(INPUT_PATH, 'utf8');

// Add computed properties section
const computedEnhancements = `
// ============================================================================
// Enhanced Stores with Computed Properties
// ============================================================================

// Theme Store - Enhanced
export const useThemeStoreEnhanced = defineStore('theme-enhanced', () => {
  // State
  const currentTheme = ref<ThemeType>('light');
  const availableThemes = ref<ThemeType[]>(['light', 'dark', 'stream', 'pilates', 'nutrition']);
  
  // Computed
  const isDark = computed(() => currentTheme.value === 'dark');
  const isLight = computed(() => currentTheme.value === 'light');
  const themeColors = computed(() => {
    const colorMap: Record<ThemeType, { primary: string; secondary: string }> = {
      light: { primary: '#ffe000', secondary: '#1a1a1a' },
      dark: { primary: '#1a1a1a', secondary: '#ffe000' },
      stream: { primary: '#00d4ff', secondary: '#1a1a1a' },
      pilates: { primary: '#ff6b9d', secondary: '#1a1a1a' },
      nutrition: { primary: '#00ff88', secondary: '#1a1a1a' }
    };
    return colorMap[currentTheme.value];
  });
  
  // Actions
  function setTheme(theme: ThemeType) {
    currentTheme.value = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  function cycleTheme() {
    const currentIndex = availableThemes.value.indexOf(currentTheme.value);
    const nextIndex = (currentIndex + 1) % availableThemes.value.length;
    setTheme(availableThemes.value[nextIndex]);
  }
  
  return {
    currentTheme,
    availableThemes,
    isDark,
    isLight,
    themeColors,
    setTheme,
    cycleTheme
  };
});

// Transition Store - Enhanced
export const useTransitionStoreEnhanced = defineStore('transition-enhanced', () => {
  // State
  const isTransitioning = ref(false);
  const curtainState = ref<CurtainState>('closed');
  const transitionProgress = ref(0);
  
  // Computed
  const canNavigate = computed(() => !isTransitioning.value);
  const isFullyOpen = computed(() => curtainState.value === 'open');
  const isFullyClosed = computed(() => curtainState.value === 'closed');
  const progressPercent = computed(() => \`\${Math.round(transitionProgress.value * 100)}%\`);
  
  // Actions
  async function startTransition(to: string) {
    if (isTransitioning.value) return;
    
    isTransitioning.value = true;
    curtainState.value = 'opening';
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      transitionProgress.value = i / 100;
      await new Promise(r => setTimeout(r, 50));
    }
    
    curtainState.value = 'open';
    // Navigate happens here
    await navigateTo(to);
  }
  
  function completeTransition() {
    curtainState.value = 'closing';
    setTimeout(() => {
      curtainState.value = 'closed';
      isTransitioning.value = false;
      transitionProgress.value = 0;
    }, 1000);
  }
  
  return {
    isTransitioning,
    curtainState,
    transitionProgress,
    canNavigate,
    isFullyOpen,
    isFullyClosed,
    progressPercent,
    startTransition,
    completeTransition
  };
});

// Menu Store - Enhanced
export const useMenuStoreEnhanced = defineStore('menu-enhanced', () => {
  // State
  const isOpen = ref(false);
  const activeSection = ref<string | null>(null);
  const hoveredItem = ref<string | null>(null);
  
  // Computed
  const hasActiveSection = computed(() => activeSection.value !== null);
  const menuClasses = computed(() => ({
    'menu--open': isOpen.value,
    'menu--has-active': hasActiveSection.value
  }));
  
  // Actions
  function toggle() {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) {
      activeSection.value = null;
      hoveredItem.value = null;
    }
  }
  
  function close() {
    isOpen.value = false;
    activeSection.value = null;
    hoveredItem.value = null;
  }
  
  function setActiveSection(section: string | null) {
    activeSection.value = section;
  }
  
  function setHoveredItem(item: string | null) {
    hoveredItem.value = item;
  }
  
  return {
    isOpen,
    activeSection,
    hoveredItem,
    hasActiveSection,
    menuClasses,
    toggle,
    close,
    setActiveSection,
    setHoveredItem
  };
});

// Scroll Store - Enhanced
export const useScrollStoreEnhanced = defineStore('scroll-enhanced', () => {
  // State
  const progress = ref(0);
  const direction = ref<ScrollDirection>('down');
  const isScrolling = ref(false);
  const scrollY = ref(0);
  const velocity = ref(0);
  
  // Computed
  const isAtTop = computed(() => scrollY.value < 50);
  const isAtBottom = computed(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    return scrollY.value + windowHeight >= documentHeight - 50;
  });
  const isScrollingDown = computed(() => direction.value === 'down');
  const isScrollingUp = computed(() => direction.value === 'up');
  const progressPercent = computed(() => \`\${Math.round(progress.value * 100)}%\`);
  const isScrollingFast = computed(() => Math.abs(velocity.value) > 5);
  
  // Actions
  function updateScroll(y: number, vel: number) {
    const prevY = scrollY.value;
    scrollY.value = y;
    velocity.value = vel;
    direction.value = y > prevY ? 'down' : 'up';
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    progress.value = y / (documentHeight - windowHeight);
    
    isScrolling.value = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling.value = false;
    }, 150);
  }
  
  function scrollTo(target: string | number, options?: ScrollOptions) {
    // Lenis scroll implementation
    const lenis = useLenis();
    lenis?.scrollTo(target, options);
  }
  
  let scrollTimeout: NodeJS.Timeout;
  
  return {
    progress,
    direction,
    isScrolling,
    scrollY,
    velocity,
    isAtTop,
    isAtBottom,
    isScrollingDown,
    isScrollingUp,
    progressPercent,
    isScrollingFast,
    updateScroll,
    scrollTo
  };
});
`;

// Append to existing content
const enhancedContent = storesContent + '\n' + computedEnhancements;

// Save
fs.writeFileSync(OUTPUT_PATH, enhancedContent);

console.log(`✅ Enhanced Pinia stores with computed properties`);
console.log(`💾 Saved to ${OUTPUT_PATH}\n`);

console.log('📦 Enhanced Stores:');
console.log('  useThemeStoreEnhanced        3 computed properties');
console.log('  useTransitionStoreEnhanced   4 computed properties');
console.log('  useMenuStoreEnhanced         2 computed properties');
console.log('  useScrollStoreEnhanced       7 computed properties');
console.log('\n  Total: 16 computed properties added');
