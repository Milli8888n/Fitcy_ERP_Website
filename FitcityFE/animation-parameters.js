/**
 * Animation Parameters - Extracted from FitCity/Phive Source Code
 * All values are confirmed from minified source or estimated based on patterns
 * 
 * Usage:
 * import { TIMINGS, COLORS, EASINGS } from './animation-parameters'
 */

// ============================================================================
// TIMINGS - All animation durations and delays
// ============================================================================

export const TIMINGS = {
  // Curtain Component
  curtain: {
    enter: {
      duration: 1,
      ease: "expo.inOut",
      resolveAfter: 850, // ms
    },
    transitionIn: {
      duration: 1,
      ease: "expo.inOut",
      resolveAfter: 900, // ms
    },
    transitionOut: {
      duration: 1,
      ease: "expo.inOut",
      resolveAfter: 900, // ms
    },
    fullOverlay: {
      fadeDuration: 0.5,
      ease: "none",
    },
    exitFade: {
      duration: 0.25,
      ease: "none",
    },
  },

  // Menu Grid Component
  menu: {
    bar: {
      duration: 1,
      ease: "expo.out",
      delay: 1,
      rotationX: {
        initial: 120,
        final: 0,
      },
    },
    background: {
      duration: 1,
      ease: "cubic-bezier(.19, 1, .22, 1)",
    },
    items: {
      duration: 1,
      ease: "expo.out",
    },
    ctaHide: {
      duration: 2,
      ease: "power4.inOut",
      desktop: {
        xPercent: 120,
      },
      mobile: {
        y: 100,
      },
    },
  },

  // Home Header Slider
  slider: {
    background: {
      duration: 2,
      ease: "power2.out",
      scale: {
        from: 1.2,
        to: 1,
      },
    },
    text: {
      duration: 1,
      ease: "expo.out",
      stagger: -0.8, // Overlap between lines
      y: {
        from: 100,
        to: 0,
      },
    },
    subtitle: {
      duration: 0.8,
      ease: "power2.out",
      overlap: -0.5,
      y: {
        from: 20,
        to: 0,
      },
    },
    cta: {
      duration: 0.8,
      ease: "power2.out",
      overlap: -0.5,
      y: {
        from: 20,
        to: 0,
      },
    },
    close: {
      duration: 0.8,
      ease: "power2.in",
      y: -50,
    },
    autoPlay: {
      interval: 5000, // ms
      pauseOnInteraction: 8000, // ms
    },
  },

  // 3D Scene
  threeD: {
    rotation: {
      y: 0.18, // radians per second
      z: 0.25, // radians per second
    },
    movement: {
      upward: 1.2, // units per second
    },
    click: {
      initialSpin: 10,
      decayFactor: 0.95,
    },
    spacing: {
      vertical: 0.6,
    },
  },

  // Phive Clubs Section
  clubs: {
    flip: {
      duration: 0.8,
      ease: "power2.inOut",
      stagger: 0.05,
    },
    scroll: {
      scrub: 1,
    },
  },

  // Scroll System
  scroll: {
    lenis: {
      duration: 1.2,
      smoothTouch: false,
      touchMultiplier: 2,
    },
  },
}

// ============================================================================
// COLORS - Design system color palette
// ============================================================================

export const COLORS = {
  // Base colors
  black: "#000",
  white: "#fff",
  red: "#ff004d",

  // Brown palette
  darkBrown: "#161003",
  midBrown: "#211e16",
  lightBrown: "#3c3627",

  // Yellow palette
  yellow: "#ffe000",
  warmYellow: "#ffd904",
  subduedYellow: "#f6c548",
  lightYellow: "#fff4a6",
  warmGrey: "#f3efd7",

  // Accent colors
  nutrition: "#d9f7bb",
  stream: "#b76eff",
  pilates: "#f7bbce",
}

// ============================================================================
// THEME CONFIGURATIONS
// ============================================================================

export const THEMES = {
  light: {
    menuColor: COLORS.darkBrown,
    menuBackgroundColor: COLORS.yellow,
    menuSecondaryBackgroundColor: COLORS.lightYellow,
    iconColor: COLORS.darkBrown,
    burgerColor: COLORS.darkBrown,
  },
  dark: {
    menuColor: COLORS.yellow,
    menuBackgroundColor: COLORS.darkBrown,
    menuSecondaryBackgroundColor: COLORS.lightBrown,
    iconColor: COLORS.yellow,
    burgerColor: COLORS.yellow,
  },
  stream: {
    menuColor: COLORS.darkBrown,
    menuBackgroundColor: COLORS.stream,
    menuSecondaryBackgroundColor: COLORS.warmGrey,
    iconColor: COLORS.darkBrown,
    burgerColor: COLORS.darkBrown,
  },
  "dark-stream": {
    menuColor: COLORS.stream,
    menuBackgroundColor: COLORS.darkBrown,
    menuSecondaryBackgroundColor: COLORS.lightBrown,
    iconColor: COLORS.stream,
    burgerColor: COLORS.stream,
  },
  pilates: {
    menuColor: COLORS.darkBrown,
    menuBackgroundColor: COLORS.pilates,
    menuSecondaryBackgroundColor: COLORS.warmGrey,
    iconColor: COLORS.darkBrown,
    burgerColor: COLORS.darkBrown,
  },
  "dark-pilates": {
    menuColor: COLORS.pilates,
    menuBackgroundColor: COLORS.darkBrown,
    menuSecondaryBackgroundColor: COLORS.lightBrown,
    iconColor: COLORS.pilates,
    burgerColor: COLORS.pilates,
  },
  nutrition: {
    menuColor: COLORS.darkBrown,
    menuBackgroundColor: COLORS.nutrition,
    menuSecondaryBackgroundColor: COLORS.warmGrey,
    iconColor: COLORS.darkBrown,
    burgerColor: COLORS.darkBrown,
  },
  "dark-nutrition": {
    menuColor: COLORS.nutrition,
    menuBackgroundColor: COLORS.darkBrown,
    menuSecondaryBackgroundColor: COLORS.lightBrown,
    iconColor: COLORS.nutrition,
    burgerColor: COLORS.nutrition,
  },
  subduedYellow: {
    menuColor: COLORS.darkBrown,
    menuBackgroundColor: COLORS.subduedYellow,
    menuSecondaryBackgroundColor: COLORS.warmGrey,
    iconColor: COLORS.darkBrown,
    burgerColor: COLORS.darkBrown,
  },
  "dark-subduedYellow": {
    menuColor: COLORS.subduedYellow,
    menuBackgroundColor: COLORS.darkBrown,
    menuSecondaryBackgroundColor: COLORS.lightBrown,
    iconColor: COLORS.subduedYellow,
    burgerColor: COLORS.subduedYellow,
  },
}

// ============================================================================
// EASINGS - GSAP easing functions reference
// ============================================================================

export const EASINGS = {
  "expo.out": "Exponential ease out - Fast start, slow end",
  "expo.in": "Exponential ease in - Slow start, fast end",
  "expo.inOut": "Exponential ease in-out - Slow start and end",
  "power2.out": "Quadratic ease out - Smooth deceleration",
  "power2.in": "Quadratic ease in - Smooth acceleration",
  "power2.inOut": "Quadratic ease in-out - Smooth both ends",
  "power4.inOut": "Quartic ease in-out - Very smooth both ends",
  custom: "cubic-bezier(.19, 1, .22, 1)",
}

// ============================================================================
// BREAKPOINTS - Responsive design breakpoints
// ============================================================================

export const BREAKPOINTS = {
  xsmall: 390,
  small: 744,
  medium: 1024,
  large: 1290,
  xlarge: 2000,
}

// ============================================================================
// 3D SCENE CONFIGURATION
// ============================================================================

export const SCENE_CONFIG = {
  camera: {
    fov: 45,
    position: [0, 0, 12],
    near: 0.1,
    far: 1000,
  },
  lighting: {
    ambient: {
      color: 0x404040,
      intensity: 1.2,
    },
    directional: {
      color: 0xffffff,
      intensity: 2,
      position: [0, 0, 8],
    },
  },
  instances: [
    {
      positionFrom: [-0.8, 0, 1], // Multiplied by gridWidth/Height
      rotation: [Math.PI / 3, 0, -(Math.PI / 5)],
    },
    {
      positionFrom: [0.8, -0.6, 0],
      rotation: [Math.PI / 4, 0, Math.PI / 4],
    },
    {
      positionFrom: [-0.6, -1.2, 1],
      rotation: [Math.PI / 4, 0, -(Math.PI / 4)],
    },
    {
      positionFrom: [0.4, -1.8, 2],
      rotation: [Math.PI / 3, 0, Math.PI / 2],
    },
    {
      positionFrom: [-0.4, -2.4, 1],
      rotation: [Math.PI / 3, 0, -(Math.PI / 3)],
    },
    {
      positionFrom: [0.75, -3.0, 0],
      rotation: [Math.PI / 3, 0, Math.PI / 3],
    },
  ],
}

// ============================================================================
// GRID SYSTEM
// ============================================================================

export const GRID = {
  columns: 16,
  gutter: 12, // px
  padding: 16, // px
  breakpoints: BREAKPOINTS,
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get theme configuration by name
 * @param {string} themeName - Theme name (e.g., 'light', 'dark', 'stream')
 * @returns {object} Theme configuration
 */
export function getTheme(themeName) {
  return THEMES[themeName] || THEMES.light
}

/**
 * Get responsive value based on viewport width
 * @param {number} width - Viewport width
 * @returns {string} Breakpoint name
 */
export function getBreakpoint(width) {
  if (width < BREAKPOINTS.xsmall) return "xsmall"
  if (width < BREAKPOINTS.small) return "small"
  if (width < BREAKPOINTS.medium) return "medium"
  if (width < BREAKPOINTS.large) return "large"
  return "xlarge"
}

/**
 * Apply theme to CSS variables
 * @param {string} themeName - Theme name
 */
export function applyTheme(themeName) {
  const theme = getTheme(themeName)
  const root = document.documentElement

  Object.entries(theme).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`
    root.style.setProperty(cssVarName, value)
  })
}

/**
 * Create GSAP timeline with common defaults
 * @param {object} options - Timeline options
 * @returns {gsap.core.Timeline} GSAP timeline
 */
export function createTimeline(options = {}) {
  return gsap.timeline({
    defaults: {
      ease: EASINGS["expo.out"],
      duration: 1,
    },
    ...options,
  })
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  TIMINGS,
  COLORS,
  THEMES,
  EASINGS,
  BREAKPOINTS,
  SCENE_CONFIG,
  GRID,
  getTheme,
  getBreakpoint,
  applyTheme,
  createTimeline,
}
