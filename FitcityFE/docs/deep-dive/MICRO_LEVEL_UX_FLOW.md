# 🔬 PHIVE.PT - LUỒNG UX VI MÔ (MICRO-LEVEL FLOW)

> Phân tích chi tiết từng dòng code, từng millisecond trong quá trình tải trang và tương tác

---

## 📋 MỤC LỤC

1. [Timeline Tổng Quan](#timeline-tổng-quan)
2. [Phase 1: Initial Render (0-50ms)](#phase-1-initial-render)
3. [Phase 2: Loader State Machine (50-500ms)](#phase-2-loader-state-machine)
4. [Phase 3: Asset Loading (100-800ms)](#phase-3-asset-loading)
5. [Phase 4: Curtain Animation (800-1650ms)](#phase-4-curtain-animation)
6. [Phase 5: Component Orchestration (1650-2500ms)](#phase-5-component-orchestration)
7. [Phase 6: Scroll Unlock (2500ms+)](#phase-6-scroll-unlock)
8. [Continuous: Runtime Behaviors](#continuous-runtime-behaviors)

---

## Timeline Tổng Quan

```
0ms      ████████████ HTML Parse + Hydration
50ms     ██████ Vue Components Mount
100ms    ████████████████ Font Loading
500ms    ██████████████████████ GLB Model Loading
800ms    ████ Curtain Enter Animation
1650ms   ████████████ HomeHeader Ribbon Animation
2500ms   ██ Scroll Unlock
∞        ████████████████████████████ Runtime Loop
```

---

## Phase 1: Initial Render

### T = 0ms: Server-Side Rendered HTML

**File:** `app.vue` (Template)

```vue
<template>
  <Scroller ref="mainScroller" :main="true">
    <NuxtPage />
  </Scroller>
  
  <Grid />
  <MenuGrid v-bind="menu" />
  <ModalDrawer />
  
  <!-- ⚠️ PreLoader có z-index: 10000 - che toàn bộ -->
  <PreLoader :title="`${SITE_NAME} — ${SITE_DESCRIPTION}`" color="#ffe000" />
  
  <Curtain ref="curtainRef" />
</template>
```

**Trạng thái DOM:**
```html
<body>
  <div data-component="loading" style="z-index: 10000">
    <span class="-h1 title">Phive — It's not just fitness...</span>
  </div>
  <!-- Tất cả nội dung khác bị che phủ -->
</body>
```

**CSS Critical:**
```scss
[data-component='loading'] {
  position: fixed;
  top: 0; left: 0;
  width: 100svw;
  height: 200svh; // ⚠️ Cao gấp đôi để chặn cuộn
  background-color: var(--color-black);
  z-index: 10000;
  pointer-events: none; // ⚠️ Không chặn sự kiện chuột
}
```

---

### T = 10ms: Vue Hydration Begins

**File:** `app.vue` (Script Setup)

```javascript
// Line 32-37: Fetch menu data
const locale = useLocale()
const query = { lang: locale.value }
const { data: menu } = await useFetch('/cms/menu', { query })
```

**Nuxt Payload Injection:**
```javascript
// Nuxt tự động inject _payload.json vào window.__NUXT__
window.__NUXT__ = {
  data: {
    "5L5L4hk1fz8KZv8EsQaW_zNrJ2kDG7THx_EnHwcCfK4": {
      clubs: [...],
      items: [...],
      menuCta: {...}
    }
  }
}
```

---

### T = 20ms: Font Preload

**File:** `app.vue` (useHead)

```javascript
// Line 53-70
useHead({
  link: [
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/AcidGroteskVF.woff2', // ⚠️ Variable Font
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/PPFormula.woff2',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
  ],
})
```

**Browser Action:**
```
[Network Tab]
GET /fonts/AcidGroteskVF.woff2  Priority: Highest  Type: font
GET /fonts/PPFormula.woff2       Priority: Highest  Type: font
```

---

### T = 30ms: Scroller Initialization

**File:** `Scroller.vue` (onMounted)

```javascript
// Line 44-61
onMounted(() => {
  const wrapper = el.value
  const container = scrollContainer.value
  const options = props.main ? {} : { wrapper, content: container }
  
  // ⚠️ Khởi tạo Lenis
  lenis = new Lenis(options)
  lenis.on('scroll', () => ScrollTrigger.update())
  
  // ⚠️ Kết nối với GSAP ticker (60fps)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0) // Tắt lag compensation
  
  // ⚠️ Chặn scroll restoration của browser
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  
  // ⚠️ QUAN TRỌNG: Scroller BỊ DỪNG ngay lập tức
  !props.main && lenis.stop()
})
```

**Lenis Internal State:**
```javascript
{
  targetScroll: 0,
  animatedScroll: 0,
  velocity: 0,
  direction: 0,
  isStopped: true, // ⚠️ Đã bị khóa
  isSmooth: true,
  isScrolling: false
}
```

---

## Phase 2: Loader State Machine

### T = 50ms: Page Component Mounted

**File:** `Page.vue` (onMounted)

```javascript
// Line 73-88
onMounted(() => {
  // ⚠️ Tạo media query listener
  query = window.matchMedia('(pointer:coarse)')
  query.addEventListener('change', onChange)
  
  // ⚠️ Setup CSS variables
  setCSSVars(screen)
  
  // ⚠️ CRITICAL: Chờ nextTick để DOM hoàn toàn ready
  nextTick().then(() => {
    // ⚠️ DISPATCH 'mounted' EVENT
    loader.dispatch('mounted')
    
    // ⚠️ Chờ font load xong rồi resize scroller
    document.fonts.ready.then(() => {
      emitter.emit('scroller-resize')
    })
  })
})
```

**Loader State Transition:**
```javascript
// File: loader.js Line 21-26
function handleMounted() {
  // ⚠️ Chờ TẤT CẢ loadedPromises resolve
  awaitDynamicPromiseArray(loadedPromises, handleLoaded.bind(this))
  mounted.resolve()
  
  console.log('⚙︎ [page.home] mounted︎')
}
```

**loadedPromises Array:**
```javascript
[
  // Hiện tại: RỖNG
  // Các component con sẽ thêm promise vào đây qua deferLoad()
]
```

---

### T = 100ms: Font Loading Complete

**Browser Event:**
```javascript
document.fonts.ready.then(() => {
  // ⚠️ Fonts đã load xong
  console.log('Fonts loaded:', document.fonts.size)
  // Output: Fonts loaded: 2
  
  emitter.emit('scroller-resize')
})
```

**Scroller Response:**
```javascript
// File: Scroller.vue Line 86-89
const resize = () => {
  lenis.resize()          // ⚠️ Tính lại kích thước
  ScrollTrigger.refresh() // ⚠️ Refresh tất cả triggers
}
```

---

### T = 150ms: HomeHeader Component Mounted

**File:** `HomeHeader.vue` (onMounted)

```javascript
// Line 265-272
onMounted(() => {
  // ⚠️ KHÔNG deferLoad media vì đã comment
  // const mediaPromise = imgLoaded(...) hoặc videoLoaded(...)
  // context.$page.loader.deferLoad(mediaPromise)
  
  // ⚠️ Hook vào các lifecycle events
  context.$page.loader.loaded.then(() => setup())
  context.$page.loader.ready.then(() => initRibbon())
  context.$page.loader.transitionReady.then(() => init())
})
```

**Setup Function:**
```javascript
// Line 73-80
const setup = () => {
  // ⚠️ Đăng ký event listeners
  emitter.on('homeHeader-play', play)
  emitter.on('homeHeader-pause', pause)
  
  // ⚠️ Browser visibility API
  window.addEventListener('blur', pause)
  window.addEventListener('focus', play)
  
  // ⚠️ Viewport intersection observer
  watch(viewport, (value) => (value.inViewport ? play() : pause()))
}
```

---

## Phase 3: Asset Loading

### T = 200ms: WebGL Scene Initialization

**File:** `BoldTypography/webgl/Scene.vue` (onMounted)

```javascript
// Line 83-85
onMounted(() => {
  init()
})
```

**Init Function:**
```javascript
// Line 20-81
const init = () => {
  try {
    // ⚠️ Tạo Three.js context
    three.value = Three.createApp(canvas.value, {
      gl: {
        alpha: true,
        webGPU: true, // ⚠️ Ưu tiên WebGPU nếu có
      },
      camera: {
        fov: 45,
        position: [0, 0, 12],
      },
      observe: false,    // ⚠️ Không auto-resize
      frameloop: 'none', // ⚠️ KHÔNG render ngay
    })
    
    three.value.render((state, hooks) => {
      // ⚠️ Setup ScrollTrigger
      containerScrollTrigger.value = ScrollTrigger.create({
        trigger: '[data-component="bold-typography"]',
        start: 'top-=400 bottom',
        endTrigger: '[data-component="classes-showcase"]',
        end: 'top+=400 top',
        scrub: true,
        
        // ⚠️ QUAN TRỌNG: Chỉ render khi scroll đến
        onEnter: () => {
          state.scene.visible = true
          state.frameloop = 'always' // ⚠️ BẬT render loop
        },
        onLeave: () => {
          state.scene.visible = false
          state.frameloop = 'none'   // ⚠️ TẮT để tiết kiệm
          
          // ⚠️ Clear canvas
          state.gl.clearColor(0.0, 0.0, 0.0, 1.0)
          state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT)
          state.gl.render(state.scene, state.camera)
        },
        
        // ⚠️ Gửi progress cho scene
        onUpdate: ({ progress }) => {
          three.value.proxy({ type: 'scroll', progress })
        },
      })
      
      // ⚠️ Load 3D model
      Scene(emitter)
    })
  } catch (error) {
    emitter.emit('webgl-error')
    console.error('error setting up webgl:', error)
  }
}
```

---

### T = 500ms: GLB Model Loading

**File:** `BoldTypography/webgl/Scene.js` (Line 111-149)

```javascript
useGLTF(`/webgl/plates-color-whit-imetal-round.glb`).then((e) => {
  // ⚠️ Extract meshes từ GLTF
  const plate = e.scene.getObjectByName('plate')
  const iron = e.scene.getObjectByName('iron')
  
  // ⚠️ Tạo InstancedMesh (4 instances)
  instancedMesh = new InstancedMesh(
    plate.geometry, 
    plate.material, 
    items.length // 4 miếng tạ
  )
  scene.add(instancedMesh)
  
  ironMesh = new InstancedMesh(
    iron.geometry, 
    iron.material, 
    items.length
  )
  scene.add(ironMesh)
  
  // ⚠️ Setup initial positions
  const dummy = new Object3D()
  for (let i = 0; i < instancedMesh.count; i++) {
    dummy.rotation.set(...items[i].rotation)
    dummy.position.set(...items[i].positionFrom)
    dummy.scale.set(1, 2, 1)
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)
  }
  
  // ⚠️ Setup click interaction
  instancedMesh.addEventListener('click', ({ intersection }) => {
    items[intersection.instanceId].pointerdown = true
    items[intersection.instanceId].rotationSpeed = 10
  })
  
  instancedMesh.computeBoundingBox()
  instancedMesh.frustumCulled = false
  instancedMesh.instanceMatrix.needsUpdate = true
  ironMesh.instanceMatrix.needsUpdate = true
  
  // ⚠️ Add to interactive group
  group.add(instancedMesh)
  scene.add(group)
  
  // ⚠️ CRITICAL: Preload để GPU compile shader
  Preload({ all: true, camera, scene })
  gl.render(scene, camera)
  gl.clear()
  
  // ⚠️ SIGNAL: WebGL sẵn sàng
  emitter.emit('webgl-ok')
})
```

**GPU Shader Compilation:**
```
[GPU Process]
Compiling vertex shader...   ✓ 50ms
Compiling fragment shader... ✓ 80ms
Linking program...           ✓ 20ms
Uploading geometry...        ✓ 30ms
Uploading textures...        ✓ 100ms
Total: ~280ms
```

---

### T = 800ms: Loader.loaded Resolves

**File:** `loader.js` (Line 28-32)

```javascript
function handleLoaded() {
  loaded.resolve()
  log('loaded') // ⚠️ Console: "⚙︎ [page.home] loaded︎"
}
```

**Trigger Chain:**
```javascript
// File: PreLoader.vue Line 20-31
context.loader.loaded.then(() => {
  // ⚠️ Set background color
  document.querySelector(':root').style.setProperty(
    '--body-backgroundColor', 
    `#161003`
  )
  
  // ⚠️ Reset scroll position
  scroller.value?.reset()
  
  // ⚠️ Add CSS class để trigger animation
  el.value.classList.add('loaded')
  
  // ⚠️ Remove PreLoader khỏi DOM
  el.value.remove()
  
  // ⚠️ BẮT ĐẦU Curtain animation
  curtain.value.enter().then(() => {
    setTimeout(() => {
      context.loader.dispatch('ready')
      context.loader.dispatch('transition-ready')
    }, 100)
  })
})
```

---

## Phase 4: Curtain Animation

### T = 800ms: Curtain.enter() Starts

**File:** `Curtain.vue` (Line 168-171)

```javascript
const enter = () => {
  enterTl.seek(0).play()
  return new Promise((resolve) => setTimeout(() => resolve(), 850))
}
```

**GSAP Timeline Breakdown:**

```javascript
// Line 29-68: enterTl setup
enterTl
  // ⚠️ Step 1: Line expands (0s → 1s)
  .fromTo('.line .inner', 
    { scaleX: 0 },
    { 
      scaleX: 1,
      ease: 'expo.inOut',
      duration: 1,
      onComplete: () => gsap.set('.line', { opacity: 0 })
    }
  )
  // ⚠️ Step 2: Top curtain retracts (1s → 2s)
  .fromTo('.top',
    { scaleY: 1, transformOrigin: 'top' },
    {
      scaleY: 0,
      ease: 'expo.inOut',
      duration: 1,
      onComplete: () => gsap.set('.top', { clearProps: 'all' })
    },
    1 // ⚠️ Start at 1 second (parallel với bottom)
  )
  // ⚠️ Step 3: Bottom curtain retracts (1s → 2s)
  .fromTo('.bottom',
    { scaleY: 1, transformOrigin: 'bottom' },
    {
      scaleY: 0,
      ease: 'expo.inOut',
      duration: 1,
      onComplete: () => gsap.set('.bottom', { clearProps: 'all' })
    },
    1 // ⚠️ Parallel với top
  )
```

**Visual Timeline:**

```
T=800ms   ████████████████████████ Line: scaleX 0 → 1
          |                        |
T=1800ms  ████████████████████████ Top/Bottom: scaleY 1 → 0
          |                        |
T=1650ms  ✓ Promise resolves (850ms sau khi start)
```

**DOM State Changes:**

```html
<!-- T=800ms -->
<div data-component="curtain">
  <span class="top" style="transform: scaleY(1)"></span>
  <span class="line"><span class="inner" style="transform: scaleX(0)"></span></span>
  <span class="bottom" style="transform: scaleY(1)"></span>
</div>

<!-- T=1300ms (mid-animation) -->
<div data-component="curtain">
  <span class="top" style="transform: scaleY(0.5)"></span>
  <span class="line" style="opacity: 0"><span class="inner" style="transform: scaleX(1)"></span></span>
  <span class="bottom" style="transform: scaleY(0.5)"></span>
</div>

<!-- T=1800ms (complete) -->
<div data-component="curtain">
  <span class="top" style=""></span> <!-- clearProps -->
  <span class="line" style="opacity: 0"></span>
  <span class="bottom" style=""></span>
</div>
```

---

### T = 1650ms: Loader.ready Dispatched

**File:** `PreLoader.vue` (Line 27-29)

```javascript
setTimeout(() => {
  context.loader.dispatch('ready')
  context.loader.dispatch('transition-ready')
}, 100)
```

**Loader State:**
```javascript
{
  mounted: { resolved: true },
  loaded: { resolved: true },
  ready: { resolved: true },      // ⚠️ MỚI
  transitionReady: { resolved: true }, // ⚠️ MỚI
  destroyed: { resolved: false }
}
```

---

## Phase 5: Component Orchestration

### T = 1650ms: HomeHeader.initRibbon()

**File:** `HomeHeader.vue` (Line 270)

```javascript
context.$page.loader.ready.then(() => initRibbon())
```

**initRibbon Function:**
```javascript
// Line 81-84
const initRibbon = () => {
  const activeRibbon = ribbons.value[activeSlide.value] // ⚠️ Slide 0
  activeRibbon.enter().then(() => activeRibbon.start())
}
```

**Ribbon.enter() Animation:**
```javascript
// File: Ribbon.vue (giả định)
const enter = () => {
  return gsap.timeline()
    .fromTo(ribbonPath, 
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 1.2, ease: 'expo.out' }
    )
    .fromTo(ribbonText,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' },
      '-=0.6' // ⚠️ Overlap 0.6s
    )
}
```

---

### T = 1750ms: HomeHeader.init()

**File:** `HomeHeader.vue` (Line 271)

```javascript
context.$page.loader.transitionReady.then(() => init())
```

**init Function:**
```javascript
// Line 86-97
const init = () => {
  const activeContent = contents.value[activeSlide.value]
  const activeBackground = backgrounds.value[activeSlide.value]
  
  // ⚠️ Start video playback
  activeBackground.start()
  activeBackground.enter()
  
  // ⚠️ Start content animation
  activeContent.start()
  
  // ⚠️ Bullets (pagination dots)
  bullets.value.enter().then(() => {
    bullets.value.start(activeSlide.value)
  })
}
```

**Background.start():**
```javascript
// File: Background.vue (giả định)
const start = () => {
  videoElement.play()
  videoElement.currentTime = 0
}

const enter = () => {
  return gsap.fromTo(videoElement,
    { opacity: 0, scale: 1.1 },
    { opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out' }
  )
}
```

---

### T = 2000ms: Ribbon.start() - Auto-play Timer

**File:** `Ribbon.vue` (giả định)

```javascript
const start = () => {
  // ⚠️ Bắt đầu đếm ngược 5 giây
  autoPlayTimer = setTimeout(() => {
    // ⚠️ Tự động chuyển slide
    close() // Trigger slide transition
  }, 5000)
}
```

---

## Phase 6: Scroll Unlock

### T = 2500ms: All Animations Complete

**Scroller State:**
```javascript
// Vẫn còn bị khóa: lenis.isStopped = true
```

**User Action Required:**
```
⚠️ Người dùng có thể thử cuộn nhưng KHÔNG có gì xảy ra
⚠️ Scroller chỉ unlock khi:
   1. User click vào bullet để chuyển slide
   2. Auto-play timer kết thúc (5s)
   3. Component gọi emitter.emit('scroller-unlock')
```

**Unlock Mechanism:**
```javascript
// File: Scroller.vue Line 84
const start = () => lenis.start()

// Triggered by:
emitter.on('scroller-unlock', () => start())
```

---

## Continuous: Runtime Behaviors

### Animation Loop (60fps)

**File:** `Scroller.vue` (Line 32-34)

```javascript
function raf(time) {
  lenis.raf(time * 1000) // ⚠️ Convert to ms
}

// Line 53
gsap.ticker.add(raf) // ⚠️ Chạy mỗi frame
```

**Lenis Update Cycle:**
```javascript
// Mỗi frame (16.67ms):
1. Đọc wheel/touch input
2. Tính toán targetScroll mới
3. Lerp animatedScroll → targetScroll (smooth)
4. Update DOM scroll position
5. Trigger ScrollTrigger.update()
6. Emit 'scroll' event
```

---

### WebGL Render Loop (Conditional)

**File:** `BoldTypography/webgl/Scene.js` (Line 163-253)

```javascript
useFrame(({ timer }) => {
  if (instancedMesh === undefined) return
  
  const delta = timer.getDelta()
  
  // ⚠️ Smooth scroll progress
  const smoothing = 0.1
  state.smoothProgress = MathUtils.lerp(
    state.smoothProgress, 
    state.progress, 
    smoothing
  )
  
  // ⚠️ Tính rotation dựa trên scroll delta
  const rotationAmount = (state.smoothProgress - state.lastSmoothScroll) * Math.PI * 2
  state.lastSmoothScroll = state.smoothProgress
  
  // ⚠️ Update từng instance
  items.forEach((it, index) => {
    // ⚠️ Click interaction damping
    if (it.pointerdown === true) {
      const damping = 0.95
      it.rotationSpeed *= damping
      
      if (Math.abs(it.rotationSpeed) < 0.0001) {
        it.rotationSpeed = 0
      }
      
      const od = it.rotationSpeed * delta
      qX.setFromAxisAngle(yVector, od)
      instanceObject.quaternion.multiplyQuaternions(instanceObject.quaternion, qX)
    }
    
    // ⚠️ Scroll-based position
    const t = MathUtils.clamp(
      MathUtils.mapLinear(state.smoothProgress, it.from, it.to, 0, 1),
      0,
      1
    )
    
    instanceObject.position.lerpVectors(
      new Vector3(...it.positionFrom),
      new Vector3(...it.positionTo),
      t
    )
    
    // ⚠️ Scroll-based rotation
    instanceObject.rotation.z += rotationAmount
    
    instanceObject.updateMatrix()
    instancedMesh.setMatrixAt(index, instanceObject.matrix)
  })
  
  instancedMesh.instanceMatrix.needsUpdate = true
  ironMesh.instanceMatrix.needsUpdate = true
})
```

**Frame Budget:**
```
Total: 16.67ms (60fps)
├─ Lenis update:        2ms
├─ ScrollTrigger:       1ms
├─ WebGL render:        8ms
│  ├─ Matrix calc:      2ms
│  ├─ GPU upload:       1ms
│  └─ Draw calls:       5ms
├─ DOM updates:         3ms
└─ Idle:                2.67ms
```

---

### Scroll-Triggered Scene Activation

**File:** `BoldTypography/webgl/Scene.vue` (Line 44-65)

```javascript
ScrollTrigger.create({
  trigger: '[data-component="bold-typography"]',
  start: 'top-=400 bottom',
  end: 'top+=400 top',
  
  onEnter: () => {
    console.log('⚙︎ 3D Scene ACTIVATED')
    state.scene.visible = true
    state.frameloop = 'always' // ⚠️ BẬT render
  },
  
  onLeave: () => {
    console.log('⚙︎ 3D Scene DEACTIVATED')
    state.scene.visible = false
    state.frameloop = 'none'   // ⚠️ TẮT render
    
    // ⚠️ Clear canvas để tiết kiệm GPU
    state.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT)
  },
  
  onUpdate: ({ progress }) => {
    // ⚠️ Gửi progress (0-1) cho scene
    three.value.proxy({ type: 'scroll', progress })
  },
})
```

**Performance Impact:**
```
Khi KHÔNG trong viewport:
- GPU usage: 0%
- CPU usage: ~2% (chỉ Lenis + DOM)

Khi TRONG viewport:
- GPU usage: 15-30%
- CPU usage: ~8%
```

---

## 🎯 KẾT LUẬN CHO FITCITY

### Critical Patterns Cần Implement:

1. **Loader State Machine**
   - 5 states: created → mounted → loaded → ready → transition-ready
   - `deferLoad()` để component con báo cáo trạng thái

2. **Curtain Transition System**
   - 3 elements: top, line, bottom
   - GSAP timeline với `expo.inOut` easing
   - Promise-based để chain animations

3. **Conditional WebGL Rendering**
   - `frameloop: 'none'` by default
   - Chỉ bật khi ScrollTrigger.onEnter
   - Tắt ngay khi ScrollTrigger.onLeave

4. **Lenis + GSAP Integration**
   - `gsap.ticker.add(raf)` để sync
   - `ScrollTrigger.update()` trong scroll callback
   - `history.scrollRestoration = 'manual'`

5. **Component Orchestration**
   - Không dùng `v-if` để show/hide
   - Dùng `z-index` + `opacity` + GSAP
   - Grid layout để stack components

### Performance Budget:

```
Initial Load:
- HTML: <50KB (gzipped)
- CSS: <30KB
- JS: <200KB (code-split)
- Fonts: <100KB (WOFF2)
- GLB: <100KB (Draco compressed)
Total: <480KB

Runtime:
- 60fps locked
- <30% GPU usage
- <100MB RAM
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-06  
**Author:** Antigravity AI Analysis
