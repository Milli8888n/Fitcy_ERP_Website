# Complete Component Mapping - FitCity/Phive Architecture

## Mission Accomplished ✅

All major animation components have been successfully reverse-engineered and their source code located.

---

## 1. Home Header & Ribbons

### Files
- **Logic**: `rj_TxuR3.js` (Ribbon, Bullets, Background components)
- **Orchestrator**: `C6udHOap.js` (HomeHeader main component)
- **CSS**: `HomeHeader.B3E9vJRS.css`

### Key Features
- GSAP-based slider with synchronized animations
- Theme switching based on active slide
- Components: Ribbon, Background, Content, Bullets
- Auto-play/pause functionality
- Responsive design with viewport detection

### Animation Strategy
```javascript
// Ribbon animation (from rj_TxuR3.js)
- openCloseTl: Timeline for slide transitions
- enter(): Initial reveal animation
- start(): Start auto-play
- close(): Exit animation
- cleanup(): Reset state

// Theme management (from C6udHOap.js)
- setMenuTheme() based on slide index
- Color mapping: light, stream, pilates, nutrition, subduedYellow
```

---

## 2. Phive Clubs Section

### Files
- **Logic**: `-2VY23FF.js`
- **CSS**: `PhiveClubs.Bk6pxCoi.css`

### Key Features
- GSAP Flip Plugin for layout transitions
- ScrollTrigger for scroll-based animations
- Dynamic card repositioning on scroll

### Animation Strategy
```javascript
// From -2VY23FF.js
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"

- Flip.getState() to capture initial layout
- Flip.from() to animate layout changes
- ScrollTrigger for triggering animations
```

---

## 3. Three.js 3D Scene

### Files
- **Logic**: `CXL_xa40.js`
- **Framework**: TresJS (Three.js wrapper for Vue)

### Key Features
- InstancedMesh for performance (multiple "plates")
- GLB model loading (`/webgl/plates-color-whit-imetal-round.glb`)
- GSAP integration for 3D object animations
- Click interactions on instances
- Continuous rotation animation loop

### Implementation Details
```javascript
// From CXL_xa40.js
- Scene setup with environment map
- InstancedMesh for 6 plate instances
- Each instance has:
  - positionFrom: [x, y, z]
  - rotation: [rx, ry, rz]
  - rotationSpeed: number (for click interaction)
- requestAnimationFrame loop for continuous animation
```

---

## 4. Global Menu (MenuGrid) ✅ FOUND

### Files
- **Logic**: `Bhbjo-UN.js` (extracted to `extracted_menu_code.js`)
- **CSS**: `entry.DAmVvGQ9.css` (scope: `data-v-0398f266`)

### Component Structure
```javascript
// Main component: MenuGrid (T3 in extracted code)
__name: "MenuGrid"
props: {
  menuCta: Boolean|Object,
  items: Array,
  clubs: Array,
  theme: String (default: "dark")
}

// Sub-components:
- Bar (WB): Top navigation bar with burger button
- Items (u3): Main menu items with pages/links
- SubItems: Secondary menu for clubs
- Anchors (g3): Horizontal anchor navigation
- Cta (y3): Call-to-action button
```

### Animation Logic
```javascript
// Open/Close Timeline
const f = gsap.timeline({ paused: true })

// Bar animation
gsap.set(el.querySelector(".bar-container"), {
  transformOrigin: "bottom",
  rotationX: 120
})
gsap.to(el.querySelector(".bar-container"), {
  y: 0,
  rotationX: 0,
  duration: 1,
  ease: "expo.out",
  delay: 1
})

// Background overlay
.background {
  background-color: rgba(from var(--color-darkBrown) r g b / 0.8);
  opacity: 0 -> 1 (on open)
  transition: opacity 1s cubic-bezier(.19,1,.22,1)
}

// Items reveal
- Items use backface-visibility: hidden
- Perspective: 1000px for 3D transforms
- Opacity: 0 -> 1 with pointer-events toggle
```

### Theme System
```css
[data-theme="light"] {
  --menu-color: var(--color-darkBrown);
  --menu-backgroundColor: var(--color-yellow);
}
[data-theme="dark"] {
  --menu-color: var(--color-yellow);
  --menu-backgroundColor: var(--color-darkBrown);
}
/* Additional themes: stream, pilates, nutrition, subduedYellow */
```

### Key Features
- Keyboard support (ESC to close)
- Scroll integration (hide CTA on scroll)
- Responsive layout (mobile vs desktop)
- Multi-level navigation (main items + sub-items for clubs)
- Language switcher with animated underline
- Anchor navigation for long pages

---

## 5. Page Loader/Curtain ✅ FOUND

### Files
- **Logic**: `Bhbjo-UN.js` (extracted to `extracted_curtain_code.js`)
- **CSS**: `entry.DAmVvGQ9.css` (scope: `data-v-981fb7ae`)

### Component Structure
```javascript
// Component: Curtain (LF in extracted code)
__name: "Curtain"

// DOM Structure:
<div data-component="curtain">
  <span class="top" data-transition="in|out"></span>
  <span class="line">
    <span class="inner"></span>
  </span>
  <span class="bottom" data-transition="in|out"></span>
  <span class="full" data-state="active"></span>
</div>
```

### Animation Timelines
```javascript
// 4 GSAP Timelines:
const o = gsap.timeline({ paused: true }) // Enter animation
const l = gsap.timeline({ paused: true }) // Transition In
const u = gsap.timeline({ paused: true }) // Transition Out
const s = gsap.timeline({ paused: true }) // Full overlay
const a = gsap.timeline({ paused: true }) // Exit fade

// Enter Animation (o)
- .top: scaleY(1 -> 0) from top
- .bottom: scaleY(1 -> 0) from bottom
- Duration: 1s, ease: "expo.inOut"

// Transition In (l)
- .line .inner: scaleX(0 -> 1)
- .top: scaleY(0 -> 1)
- .bottom: scaleY(0 -> 1)
- Duration: 1s, ease: "expo.inOut"

// Transition Out (u)
- .line .inner: scaleX(1 -> 0)
- .top: scaleY(1 -> 0)
- .bottom: scaleY(1 -> 0)
- Duration: 1s, ease: "expo.inOut"

// Full Overlay (s)
- Sets all elements to backgroundColor: #161003 (darkBrown)
- Curtain opacity: 0 -> 1
- zIndex: 9

// Exit Fade (a)
- Curtain opacity: 1 -> 0
- Duration: 0.25s
```

### Event System
```javascript
// Global event bus (f)
f.on("curtain-enter", () => enter())
f.on("curtain-transitionIn", () => transitionIn())
f.on("curtain-transitionOut", () => transitionOut())

// Exposed methods
expose({
  enter: () => Promise (resolves after 850ms),
  transitionIn: () => Promise (resolves after 900ms),
  transitionOut: () => Promise (resolves after 900ms)
})
```

### CSS Structure
```css
[data-component="curtain"] {
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index: 999;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top, .bottom {
  flex-grow: 1;
  transform: scaleY(0);
  background-color: var(--curtain-backgroundColor, var(--color-yellow));
}

.line {
  height: 1px;
  background-color: var(--curtain-backgroundColor, var(--color-yellow));
}

.line .inner {
  background-color: var(--curtain-color, var(--color-darkBrown));
  transform: scaleX(0);
}

.full {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-color: var(--curtain-color, var(--color-darkBrown));
  opacity: 0;
}
```

---

## 6. Other Components

### ClassesShowcase & Grid
- **Logic**: `DTUJ2v8n.js`
- Scroll-triggered animations

### ClubSlider & ClubsShowcase
- **Logic**: `IArSrFNh.js`
- Carousel/slider functionality

### CommonHeader (Static)
- **Logic**: `DyvHlvpR.js`
- **CSS**: `CommonHeader.B-AfJqOJ.css`
- Used on sub-pages (not homepage)

---

## 7. PageBuilder System

### File
- **Logic**: `CxIxbrMx.js`

### Component Map
```javascript
const componentMap = {
  "HomeHeader": () => import("./C6udHOap.js"),
  "CommonHeader": () => import("./DyvHlvpR.js"),
  "ThreeScene": () => import("./CXL_xa40.js"),
  "PhiveClubs": () => import("./-2VY23FF.js"),
  "ClassesShowcase": () => import("./DTUJ2v8n.js"),
  "ClubsShowcase": () => import("./IArSrFNh.js"),
  // ... many more
}
```

### Usage
- Dynamically loads components based on CMS data
- Splits components into header, main, footer sections
- Lazy loading for performance

---

## 8. Core Dependencies

### GSAP Plugins Used
1. **Core** (`gsap`)
2. **ScrollTrigger** (`gsap/ScrollTrigger`)
3. **Flip** (`gsap/Flip`)

### Other Libraries
1. **Lenis** - Smooth scroll
2. **Three.js** - 3D rendering
3. **TresJS** - Three.js Vue wrapper
4. **Vue 3** - Framework
5. **Nuxt 3** - Meta-framework

---

## 9. Animation Patterns Summary

### Pattern 1: Timeline-based Slider (HomeHeader)
```javascript
const timeline = gsap.timeline({ paused: true })
timeline.to(element, { ... })
timeline.play() / timeline.pause()
```

### Pattern 2: ScrollTrigger (PhiveClubs)
```javascript
ScrollTrigger.create({
  trigger: element,
  start: "top center",
  onEnter: () => { ... }
})
```

### Pattern 3: Flip Plugin (PhiveClubs)
```javascript
const state = Flip.getState(elements)
// Change DOM/CSS
Flip.from(state, { duration: 1, ease: "power2.inOut" })
```

### Pattern 4: Event Bus (Global Components)
```javascript
const eventBus = useEventBus()
eventBus.on("event-name", handler)
eventBus.emit("event-name", data)
```

### Pattern 5: Promise-based Animations (Curtain)
```javascript
const animate = () => new Promise(resolve => {
  gsap.to(element, {
    ...,
    onComplete: () => resolve()
  })
})
```

---

## 10. Reconstruction Strategy

### Phase 1: Core Setup ✅
1. Initialize Nuxt 3 project
2. Install dependencies: `gsap`, `lenis`, `@tresjs/core`, `three`
3. Setup design system CSS
4. Configure Nuxt plugins for GSAP

### Phase 2: Global Components
1. **Curtain Component**
   - Implement 4 timelines (enter, transitionIn, transitionOut, full)
   - Event bus integration
   - CSS with scoped variables

2. **MenuGrid Component**
   - Bar with burger animation
   - Items with multi-level navigation
   - Anchors for page sections
   - Theme system with CSS variables
   - Keyboard/scroll integration

### Phase 3: Page Components
1. **HomeHeader**
   - Ribbon slider logic from `rj_TxuR3.js`
   - Theme switching orchestration
   - Auto-play/pause system

2. **PhiveClubs**
   - Flip plugin integration
   - ScrollTrigger setup
   - Card layout transitions

3. **ThreeScene**
   - TresJS setup
   - GLB model loading
   - InstancedMesh with GSAP animations

### Phase 4: Integration
1. PageBuilder system
2. Smooth scroll with Lenis
3. Route transitions with Curtain
4. Global state management

---

## 11. File Size Analysis

| File | Size | Purpose |
|------|------|---------|
| `Bhbjo-UN.js` | 846 KB | Vue runtime + Global components (Menu, Curtain, etc.) |
| `entry.DAmVvGQ9.css` | 89 KB | Global styles + All component styles |
| `C6udHOap.js` | ~3 KB | HomeHeader orchestrator |
| `rj_TxuR3.js` | ~3 KB | Ribbon slider logic |
| `-2VY23FF.js` | ~11 KB | PhiveClubs with Flip plugin |
| `CXL_xa40.js` | ~3 KB | Three.js scene |

---

## 12. Next Steps

1. ✅ **Analysis Complete** - All components mapped
2. 🔄 **Create Vue Components** - Reconstruct from extracted code
3. 🔄 **Setup Project Structure** - Nuxt 3 with proper organization
4. 🔄 **Implement Animations** - GSAP timelines and transitions
5. 🔄 **Test & Refine** - Match original behavior

---

## Notes

- All code is minified but readable after extraction
- Component naming follows Vue 3 Composition API patterns
- Heavy use of GSAP for all animations (no CSS transitions for complex animations)
- Event bus pattern for global communication
- CSS variables for theming system
- Scoped styles with `data-v-*` attributes
- Responsive design with viewport-based calculations
- Performance optimizations: InstancedMesh, lazy loading, timeline reuse

---

**Status**: 🎉 **COMPLETE** - All major components successfully reverse-engineered and documented.
