# Architecture & Logic Analysis

This document maps the reverse-engineered logic from the obfuscated JS bundles to the specific Vue components of the FitCity (Phive) application.

## 1. Component to File Mapping

Based on the analysis of `CxIxbrMx.js` (PageBuilder Map) and inspection of individual chunks:

| HTML Component (Vue Name)                 | Logic Source File | Key Responsibilities                                      |
| ----------------------------------------- | ----------------- | --------------------------------------------------------- |
| `PageBuilder`                             | `CxIxbrMx.js`     | Dynamic component loader, route handling, props mapping.  |
| `HomeHeader`                              | `C6udHOap.js`     | Orchestrates the Slider logic. Imports `Ribbon`, `Background`. |
| `HomeHeader` (Inner Logic)                | `rj_TxuR3.js`     | **Critical**: Logic for `Ribbon`, `Bullets`, `Background` animations (GSAP). |
| `PhiveClubs`                              | `-2VY23FF.js`     | **Critical**: ScrollTrigger + GSAP Flip plugin logic for club cards. |
| `ThreeScene` (WebGL)                      | `CXL_xa40.js`     | Three.js scene setup, `InstancedMesh` for plates, animation loop. |
| `Wrapper` for WebGL                       | `D0yFpJzW.js`     | Vue wrapper for the Three.js scene logic.                 |
| `ClassesShowcase`                         | `DTUJ2v8n.js`     | Grid layout and specific showcase logic.                  |
| `ClubsShowcase`                           | `IArSrFNh.js`     | Logic for the club slider/carousel component.             |
| `Footer`                                  | `QyD6JhnX.js`     | Footer interactions (likely simplified in provided code). |

## 2. Animation Strategies Identified

### A. Home Header Slider (`rj_TxuR3.js`)
*   **Synchronized Timelines**: Uses separate GSAP timelines for `Ribbon`, `Background`, and `Content` but orchestrates them from a parent controller.
*   **Ribbon Animation**:
    *   Uses `SplitText` (inferred/custom implementation) for characters.
    *   Animates `clip-path` for the split reveal effect.
    *   Uses `xPercent` for the infinite marquee scrolling.
*   **Interaction**: The theme (`light`/`dark`) changes dynamically based on the active slide index.

### B. Phive Clubs Logic (`-2VY23FF.js`)
*   **Scroll-Driven Flip**:
    *   The component captures the state of elements (Club Cards).
    *   As the user scrolls (ScrollTrigger), it "Flips" the state from a grid/list to a sticky visual.
    *   This is highly performant as it avoids complex manual calculations for every frame, letting GSAP Handle the FLIP (First, Last, Invert, Play) updates.

### C. 3D "Plates" Scene (`CXL_xa40.js`)
*   **InstancedMesh**:
    *   Instead of creating ~40 separate mesh objects, it uses *one* geometry and material.
    *   `InstancedMesh` is used to render them all at different positions (`dummy.position.set`), rotations, and scales.
*   **Performance**: The animation loop updates `instanceMatrix` directly.
*   **Interaction**: Click events use a Raycaster (simplified in the code) to trigger a `rotationSpeed` increase on specific instances.

## 3. The "Missing" Pieces: Menu & Loader

Logic for `GlobalMenu` and `Preloader` was not found in a distinct, large JS chunk. This suggests they are either:
1.  **Bundled in Core**: Part of `Bhbjo-UN.js` (the huge vendor bundle).
2.  **Inline**: Small enough to be included directly in the `entry` CSS/JS handling.

### Reconstruction Strategy
Since identical code retrieval isn't possible, we will **replicate behavior** based on the DOM structure found in `en.html`:

*   **Menu (`data-component="menu-grid"`)**:
    *   **Structure**: Fixed overlay `div` with `z-index: 999`.
    *   **Animation**:
        *   Background: Fade in / opacity.
        *   Items (`.item`): GSAP `stagger.from(y: 50, autoAlpha: 0)`.
    *   **Trigger**: Button `[data-component="burger"]` toggles a specific class/data-attribute (`data-open="true"`).

*   **Curtain Loader (`data-component="curtain"`)**:
    *   **Structure**: Top half (`.top`), Bottom half (`.bottom`), Line (`.line`).
    *   **Animation**:
        *   On Load: `top` moves up (`yPercent: -100`), `bottom` moves down (`yPercent: 100`).
        *   Easing: `Power4.inOut` (signature ease of this site).
