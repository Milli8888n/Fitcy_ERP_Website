# Implementation Plan - FitCity/Phive Reconstruction

# Goal Description
Reconstruct the FitCity/Phive homepage with 1:1 animation fidelity, using a high-quality, scalable architecture. This plan emphasizes a **Micro-Task + Visual Verification** workflow to ensure every component is battle-tested before moving to the next.

## User Review Required
> [!IMPORTANT]
> **Validation Strategy**: Every module includes a mandatory "Verify" step. We will not proceed to the next module until the current one passes visual and functional checks.
> **Assets**: We are using extracted assets (`assets/`) and the `animation-parameters.js` reference file as the source of truth.

## Proposed Changes

### 1. Project Scaffolding & Core Architecture
Establish the rock-solid foundation.
#### [NEW] `nuxt.config.ts`, `package.json`
- Setup Nuxt 3 with TypeScript.
- Install: `gsap`, `@studio-freight/lenis`, `@tresjs/core`, `three`, `pinia`, `@vue/test-utils`, `vitest`, `happy-dom`.
- Configure auto-imports for GSAP and Composables.

#### [NEW] `assets/css/design-system.css`
- Port extracted variables (Colors, Typography, Grid) into a global CSS layer.
- **Micro-Test**: Create a `DesignSystem.vue` page to visually verify all colors, fonts, and grid alignments.

### 2. Global Components (The "Shell")
The container that holds the experience.

#### [NEW] `components/global/Curtain.vue`
**Micro-Tasks:**
1.  **Skeleton**: Create HTML structure (top/bottom panels, center line).
2.  **Logic**: Import `TIMINGS` from `animation-parameters.js`. Implement `enter`, `transitionIn`, `transitionOut` methods using GSAP Timelines.
3.  **State**: Connect to a global `useTransition` composable.
4.  **TEST**:
    -   *Unit*: Verify Promise resolution timing.
    -   *Visual*: Create `/test/curtain` route. Click button -> Trigger animation. Compare frame-by-frame with original video.

#### [NEW] `components/global/MenuGrid.vue`
**Micro-Tasks:**
1.  **Structure**: layout grid, burger button, background overlay.
2.  **Animation**: Implement `rotationX` reveal for the bar and staggered item entry.
3.  **Interaction**: "Clubs" sub-menu slide logic.
4.  **TEST**:
    -   *Unit*: Verify state changes (open/close).
    -   *Visual*: Check 3D perspective effect on menu open. Verify Theme updates.

### 3. Home Page Core (The "Content")

#### [NEW] `components/home/HomeHeader.vue`
The complex slider.
**Micro-Tasks:**
1.  **Ribbon Component**: Create single slide component (`Ribbon.vue`) with internal `enter/leave` timelines.
2.  **Orchestrator**: Create main slider logic (index state, auto-play timer).
3.  **Sync**: Ensure Theme System updates *instantly* when slide index changes.
4.  **TEST**:
    -   *Visual*: Verify text staggering matches original (0.8s overlap). Verify no "flash" during slide transition.

#### [NEW] `components/home/PhiveClubs.vue`
The layout shifter.
**Micro-Tasks:**
1.  **Markup**: Render list of clubs.
2.  **FLIP**: Use `Flip.getState()` and `Flip.from()` to handle Row -> Grid transition on scroll.
3.  **ScrollTrigger**: Bind animations to scroll position.
4.  **TEST**:
    -   *Visual*: Scroll slowly. Verify cards move perfectly into grid slots without jumping.

### 4. Visual Polish (The "Wow Factor")

#### [NEW] `components/home/ThreeScene.vue`
**Micro-Tasks:**
1.  **Setup**: TresJS canvas with transparent background.
2.  **Mesh**: Load `.glb`. Create `InstancedMesh` for performance.
3.  **Loop**: Bind rotation logic to `useRenderLoop`.
4.  **TEST**:
    -   *Visual*: Verify plates appear at correct coordinates. Click interaction spins the plate.

## Verification Plan

### Automated Tests (Vitest)
-   **Logic**: Test `animation-parameters.js` helpers.
-   **State**: Test Pinia stores (ThemeStore, TransitionStore).

### Manual Verification (The "Micro-Task Loop")
For each component, we will:
1.  Build the isolated component.
2.  Create a temporary `test-[component].vue` page.
3.  **STOP & REVIEW**: I will ask you to verify the behavior (e.g., "Does the Menu Bar rotate exactly 120 degrees?").
4.  Only merge to main layout after approval.
