# Deep Dive: Animation & Interaction Architecture
**Target Project:** Phive.pt Replica
**Status:** Ready for Implementation

This document breaks down the advanced interaction models required to achieve the "Premium" feel of the original site. Instead of guessing, we define specific implementation strategies using **GSAP** and **Vue**.

---

## 1. Global Interactions

### A. The "Curtain Reveal" (Page Load)
*   **Behavior:**
    1.  User enters site / Hard refresh.
    2.  Screen is covered by a solid yellow layer (`#ffe000`, z-index: 9999).
    3.  Browser loads critical assets (fonts, scripts).
    4.  **Vue App Mounts.**
    5.  The yellow curtain scales down vertically (`scaleY: 0`) from `transform-origin: top`.
    6.  The content beneath is revealed.
*   **Implementation Specs:**
    *   **Component:** `ThePageLoader.vue`
    *   **Tool:** GSAP Timeline.
    *   **Properties:** `scaleY: 1` -> `0`, `duration: 1s`, `ease: 'power3.inOut'`.
    *   **State:** Use a global Pinia store `useAppStore().isReady` to trigger this.

### B. Smooth Scrolling (The Foundation)
*   **Behavior:** The native browser scroll is hijacked and replaced with a momentum-based scrolling physics (makes the site feel "heavy" and smooth).
*   **Implementation Specs:**
    *   **Tool:** `lenis` (Modern, lightweight replacement for Locomotive Scroll).
    *   **Config:** `lerp: 0.1` (Softness).
    *   **Integration:** Wrap the entire app in a wrapper, update ScrollTrigger on every frame.

---

## 2. Component-Level Animations

### A. Home Hero: The "Stacked Layers" System
*   **Visual Logic:** The hero is NOT a slider. It is a stack of layers.
*   **Interaction:**
    *   **Background Layer:** Crossfades opacity (0->1) when active slide changes.
    *   **Marquee Text Layer (Ribbons):**
        *   Text moves horizontally infinitely (`translateX`).
        *   **Interaction:** Pauses when cursor hovers over *any* interactive element in the hero.
        *   **Tech:** CSS Animation `keyframes scroll { to { transform: translateX(-100%) } }` is best for performance here. GSAP `horizontalLoop` helper is the backup if CSS jitters.
    *   **Content Layer:**
        *   Text appears with a "staggered reveal" (Lines slide up from opacity 0).

### B. Clubs Section: Sticky Parallax (The Complex Part)
*   **Behavior:**
    1.  User scrolls down to "Clubs" section.
    2.  The section **Sticks** (`position: sticky`) and locks the viewport for a distance of roughly `400vh`.
    3.  As user continues scrolling, the inner content (Photo Grid) translates strictly horizontally or vertically (Scrubbing).
    4.  Based on observation: The grid moves **Vertically** but at a different speed than scroll (Parallax).
*   **Implementation Specs:**
    *   **Structure:**
        ```html
        <div class="track" style="height: 400vh">
          <div class="sticky-view" style="position: sticky; top: 0; height: 100vh">
             <div class="photo-grid" ref="grid">...</div>
          </div>
        </div>
        ```
    *   **Logic (GSAP ScrollTrigger):**
        ```javascript
        gsap.to(grid, {
          y: -window.innerHeight * 2, // Move grid up by 2 screen heights
          scrollTrigger: {
            trigger: ".track",
            start: "top top",
            end: "bottom bottom",
            scrub: 1 // Link animation progress directly to scrollbar
          }
        })
        ```

### C. Hover Effects: "Rolling Text"
*   **Behavior:** Hovering over the "Choose your club" title or buttons triggers a text roll.
*   **Technique:**
    *   Duplicate the text:
        ```html
        <div class="roll-container">
           <span class="original">Lisbon</span>
           <span class="clone">Lisbon</span>
        </div>
        ```
    *   **On Hover:** `translateY` the container by `-100%`. The clone replaces the original.

### D. Footer: Physics Bubbles
*   **Behavior:** The social media circles (Instagram, FB, etc.) feel like physical objects.
*   **Tech:** This is likely **Matter.js** in the original, but for V1 we can simulate using CSS Physics (Bouncing) or simple SVGs to save bundle size. We will use **CSS Spring Animations** for the hover states (Scaling up elastically).

---

## 3. Data-Animation Bonding
*   **Strategy:** Animations must wait for Data.
*   **Logic:**
    *   `v-if="!loading"` on logic-heavy components.
    *   Use `<ClientOnly>` for GSAP components to avoid Server-Side Rendering hydration mismatches (Nuxt specific).

## 4. Implementation Priority
1.  **Core:** `ThePageLoader` + `TheSmoothScroller` (Sets the "feeling").
2.  **Hero:** `TextRibbon` (Visual impact).
3.  **Complex:** `HomeClubsSection` (The tricky Sticky logic).
