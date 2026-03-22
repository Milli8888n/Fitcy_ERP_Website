# 📊 Phân Tích Chi Tiết HomeHeader (Hero Banner)

## 🎯 Tổng Quan

**HomeHeader** là component hero banner phức tạp với hệ thống slider tự động, animations GSAP, và nhiều lớp visual effects. Component này được thiết kế cho trang chủ của Phive Fitness.

---

## 🏗️ Cấu Trúc Component

### 📁 File Structure
```
HomeHeader/
├── HomeHeader.vue          # Component chính (396 dòng)
└── components/
    ├── Background.vue      # Background images/videos (181 dòng)
    ├── Ribbon.vue          # Animated text ribbon (511 dòng)
    ├── Content.vue         # Rich text content (152 dòng)
    └── Bullets.vue         # Progress bullets (199 dòng)
```

---

## 🎨 Các Thành Phần Chính

### 1️⃣ **Background Component**
**Chức năng**: Hiển thị background image/video với animations

**Props**:
- `media`: Boolean | Array | Object - Background media chính
- `contentMedia`: Boolean | Array | Object - Background media cho content layer
- `priority`: Boolean - Ưu tiên load (cho slide đầu tiên)

**Cấu trúc DOM**:
```html
<div data-component="background">
  <!-- Main background media -->
  <MediaAsset :media="media" class="media" />
  
  <!-- Content background media (overlay) -->
  <div class="content-media-wrapper">
    <MediaAsset :media="contentMedia || media" class="content-media" />
  </div>
</div>
```

**Animations**:
- **Enter**: Scale từ 1.2 → 1, fade in
- **Open/Close**: ClipPath animation để split background
  - Open: Background clip từ full → horizontal center line
  - Close: Content background clip từ center → full

**Exposed Methods**:
- `play()` / `pause()`: Control video playback
- `enter()`: Enter animation
- `open()` / `close()`: Open/close animations
- `start()`: Activate background
- `cleanup()`: Reset state

---

### 2️⃣ **Ribbon Component** ⭐ (Component phức tạp nhất)
**Chức năng**: Animated text ribbon với looping horizontal scroll và typewriter effect

**Props**:
- `title`: String - Tiêu đề chính
- `subtitle`: String - Phụ đề
- `mainCta`: Boolean | Object - Call-to-action button
- `playFunc` / `pauseFunc`: Functions - Control callbacks

**Cấu trúc DOM** (3 layers):
```html
<div data-component="ribbon">
  <!-- Loop 3 lần để tạo infinite scroll -->
  <div v-for="index in 3" class="ribbon-inner">
    
    <!-- Full container (hiển thị khi chưa split) -->
    <div class="full-container container">
      <h2 class="title">
        <span class="first">{{ title }}</span>  <!-- Typewriter effect -->
        <span class="last">{{ title }}</span>   <!-- Typewriter effect -->
      </h2>
      <div class="ctas-container">
        <h3 class="subtitle">{{ subtitle }}</h3>
        <ContentButton v-bind="mainCta" />
      </div>
    </div>
    
    <!-- Top half (hiển thị khi split) -->
    <div class="half-container top-half container">
      <!-- Same structure -->
    </div>
    
    <!-- Bottom half (hiển thị khi split) -->
    <div class="half-container bottom-half container">
      <!-- Same structure -->
    </div>
    
  </div>
</div>
```

**Animations Timeline**:

1. **`typeTl`** (Timeline cho typewriter effect):
   - Split text thành từng ký tự bằng GSAP SplitText
   - Animate scaleY của từng char: 1 → 0 (first) và 0 → 1 (last)
   - Repeat: -1, yoyo: true
   - Duration: 2s per cycle, stagger: 0.1s

2. **`ribbonTl`** (Timeline cho horizontal scroll):
   - Animate xPercent: 0 → -100%
   - Duration: 12s
   - Repeat: -1, ease: linear
   - Tạo infinite scroll effect

3. **`openCloseTl`** (Timeline cho split animation):
   - **Open**: Move top-half lên trên, bottom-half xuống dưới
   - Sử dụng `topOffset` và `bottomOffset` để tính toán vị trí
   - Duration: 1s, ease: expo.inOut

4. **`enterNextTl`** (Timeline cho slide transition):
   - ClipPath animation cho top và bottom halves
   - Top: 0% height → 50% height
   - Bottom: 0% height → 50% height
   - Duration: 1s, ease: expo.inOut

**Color System** (5 themes lặp lại):
```scss
&:nth-child(5n + 1) { --ribbon-backgroundColor: var(--color-yellow); }
&:nth-child(5n + 2) { --ribbon-backgroundColor: var(--color-stream); }
&:nth-child(5n + 3) { --ribbon-backgroundColor: var(--color-pilates); }
&:nth-child(5n + 4) { --ribbon-backgroundColor: var(--color-nutrition); }
&:nth-child(5n + 5) { --ribbon-backgroundColor: var(--color-subduedYellow); }
```

**Exposed Methods**:
- `enter()`: Enter animation
- `open()` / `close()`: Split/unsplit ribbon
- `start()` / `stop()`: Start/stop animations
- `play()` / `pause()`: Play/pause với smooth timeScale transition
- `enterNext()`: Animation cho slide tiếp theo
- `cleanup()`: Reset state

---

### 3️⃣ **Content Component**
**Chức năng**: Hiển thị rich text content với CTA buttons

**Props**:
- `blocks`: Boolean | Array - Rich text blocks
- `club`: Boolean | Object - Club info (để modify CTA links)
- `playFunc` / `pauseFunc`: Functions - Control callbacks

**Cấu trúc DOM**:
```html
<div data-component="content">
  <RichText :blocks="computedBlocks" />
</div>
```

**Logic đặc biệt**:
- Modify CTA links để thêm `?club=` query parameter nếu có club info
- Add event listeners cho links: mouseenter → pause, mouseleave → play

**Animations**:
- **Open/Close**: ClipPath animation
  - Initial: `polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)` (horizontal line)
  - Open: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)` (full)

**Exposed Methods**:
- `open()` / `close()`: Open/close animations
- `start()`: Activate content
- `cleanup()`: Reset state

---

### 4️⃣ **Bullets Component**
**Chức năng**: Progress indicators và navigation controls

**Props**:
- `slidesNumber`: Number - Số lượng slides
- `openFunc` / `closeFunc`: Functions - Callbacks
- `clickFunc`: Function - Click handler

**Cấu trúc DOM**:
```html
<ul data-component="bullets">
  <li v-for="(_, i) in slidesNumber" class="bullet" @click="handleClick">
    <span class="progress" />
  </li>
</ul>
```

**Animation System**:

1. **`startTls[]`** (Array of timelines - 1 per bullet):
   ```javascript
   - Set progress bar to scaleX: 0
   - Call openFunc() at 25% (SLIDE_DURATION / 4000)
   - Animate scaleX: 0 → 1 over SLIDE_DURATION (10s)
   - Call closeFunc() at end
   ```

2. **`stopTls[]`** (Array of timelines - 1 per bullet):
   ```javascript
   - Animate scaleX: current → 0
   - Duration: 0.5s, ease: power4.out
   - Transform origin: right
   ```

**Click Handling**:
- Debounce: 1000ms (prevent rapid clicks)
- Call `clickFunc(index)` để change slide

**Exposed Methods**:
- `enter()`: Enter animation (fade in + slide up)
- `start(slide)`: Start progress animation cho slide
- `stop(slide)`: Stop và reverse progress animation
- `play(slide)` / `pause(slide)`: Resume/pause current animation

---

## 🎬 HomeHeader Main Component

### Props
```javascript
{
  highlights: Array // Array of slide objects
}
```

### Slide Object Structure
```javascript
{
  background: Array|Object,        // Background media
  contentBackground: Array|Object, // Content background media
  title: String,                   // Ribbon title
  subtitle: String,                // Ribbon subtitle
  mainCta: Object,                 // CTA button config
  richText: Array,                 // Rich text blocks
  club: Object                     // Club info (optional)
}
```

### DOM Structure
```html
<div data-component="home-header">
  <!-- Layer 1: Backgrounds (z-index: 1) -->
  <div class="backgrounds-container">
    <Background v-for="item in highlights" />
  </div>

  <!-- Layer 2: Contents (z-index: 3) -->
  <div class="contents-container">
    <Content v-for="item in highlights" />
  </div>

  <!-- Layer 3: Ribbons (z-index: 4) -->
  <div class="ribbons-container">
    <Ribbon v-for="item in highlights" />
  </div>

  <!-- Layer 4: Bullets (z-index: 5) -->
  <div class="bullets-container">
    <Bullets />
  </div>

  <!-- Audio element -->
  <audio src="..." />
</div>
```

**Lưu ý về z-index layers**:
- Background (1) → Content (3) → Ribbon (4) → Bullets (5)
- Ribbons có `pointer-events: none` trừ CTA buttons

---

## 🔄 Lifecycle & Animation Flow

### 1. **Initialization** (onMounted)
```javascript
context.$page.loader.loaded.then(() => setup())
context.$page.loader.ready.then(() => initRibbon())
context.$page.loader.transitionReady.then(() => init())
```

**Setup Phase**:
- Register event listeners (blur, focus, viewport)
- Setup emitter listeners (homeHeader-play, homeHeader-pause)

**InitRibbon Phase**:
- Active ribbon: `enter()` → `start()`

**Init Phase**:
- Active background: `start()` → `enter()`
- Active content: `start()`
- Bullets: `enter()` → `start(activeSlide)`

### 2. **Auto-Play System**
```javascript
SLIDE_DURATION = 10000ms (10 seconds)

Timeline:
0ms     → Bullet progress starts
2500ms  → openFunc() called (open animations)
10000ms → closeFunc() called (transition to next slide)
```

### 3. **Slide Transition Flow** (`close()` function)

**Current Slide (Closing)**:
```javascript
1. activeContent.close()
2. activeBackground.close()
3. activeRibbon.close()
4. bullets.stop(activeSlide)
5. Cleanup: activeRibbon.cleanup(), activeBackground.cleanup(), activeContent.cleanup()
```

**Next Slide (Opening)**:
```javascript
1. nextRibbon.enterNext()
2. changeSlideAnimation(nextSlide)
3. nextBackground.enterNext()
4. startSlider() → start all components
```

**Z-index Management**:
```javascript
// Keep current background on top during transition
gsap.set(backgrounds[activeSlide], { zIndex: 99 })

// Show next ribbon and modules
gsap.set(ribbons[nextSlide], { zIndex: 99, autoAlpha: 1 })
gsap.set(modules[nextSlide], { autoAlpha: 1 })
```

### 4. **Menu Theme System**
Mỗi slide có theme riêng (5 themes lặp lại):

```javascript
Theme 1: dark / light (mobile)
Theme 2: dark-stream / stream (mobile)
Theme 3: dark-pilates / pilates (mobile)
Theme 4: dark-nutrition / nutrition (mobile)
Theme 5: dark-subduedYellow / subduedYellow (mobile)
```

Theme được set qua `setMenuTheme()` và data attributes:
```html
:data-section-intersect="menuTheme"
:data-section-intersect-mobile="menuThemeMobile"
```

---

## 🎮 User Interactions

### 1. **Play/Pause Controls**

**Auto Pause Triggers**:
- Window blur (user switches tab)
- Scroll out of viewport
- Hover over CTA buttons
- Hover over content links
- Emitter event: `homeHeader-pause`

**Auto Play Triggers**:
- Window focus
- Scroll into viewport
- Mouse leave CTA/links
- Emitter event: `homeHeader-play`

**Implementation**:
```javascript
pause() {
  activeBackground.pause()  // Pause video
  activeRibbon.pause()      // Smooth timeScale: 1 → 0
  bullets.pause()           // Pause progress bar
}

play() {
  activeBackground.play()   // Play video
  activeRibbon.play()       // Smooth timeScale: 0 → 1
  bullets.play()            // Resume progress bar
}
```

### 2. **Manual Navigation**
- Click bullets → `changeSlide(index)`
- Debounced 1000ms để prevent spam clicks

---

## 🎨 Animation Techniques

### 1. **GSAP Timelines**
- **Paused by default**: Tất cả timelines start paused để có full control
- **Chaining**: Sử dụng promises để chain animations
- **Cleanup**: Kill timelines trong `onBeforeUnmount()`

### 2. **ClipPath Animations**
Sử dụng rộng rãi cho reveal effects:
```scss
// Horizontal line
clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)'

// Full reveal
clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

// Top half
clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)'

// Bottom half
clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)'
```

### 3. **SplitText Plugin**
Ribbon component sử dụng GSAP SplitText để:
- Split text thành individual characters
- Animate từng character riêng biệt
- Tạo typewriter effect với stagger

### 4. **Infinite Scroll**
Ribbon horizontal scroll:
- Render 3 copies của content
- Animate xPercent: 0 → -100%
- Loop infinitely với ease: linear

### 5. **Smooth TimeScale Transitions**
```javascript
// Pause with smooth slowdown
gsap.to(timeScaleValue, {
  x: 0,
  duration: 2,
  ease: 'expo.out',
  onUpdate: () => ribbonTl.timeScale(timeScaleValue.x)
})

// Play with smooth speedup
gsap.to(timeScaleValue, {
  x: 1,
  duration: 2,
  ease: 'expo.out',
  onUpdate: () => ribbonTl.timeScale(timeScaleValue.x)
})
```

---

## 📱 Responsive Behavior

### Breakpoints
```javascript
small: 768px
xxlarge: 1920px
```

### Adaptive Features

**Ribbon Loop Duration**:
```javascript
loopDuration = screen.width <= xxlarge ? 12s : 20s
```

**Menu Theme**:
- Desktop: dark variants (dark, dark-stream, etc.)
- Mobile: light variants (light, stream, etc.)

**Layout**:
```scss
@include max-screen($small) {
  height: calc(var(--computed-100vh) - var(--menu-gap));
}
```

---

## 🔧 Technical Details

### Performance Optimizations

1. **Lazy Loading**:
   - First slide có `priority: true`
   - Other slides load on demand

2. **GPU Acceleration**:
   - Sử dụng `transform` và `opacity` cho animations
   - Avoid layout thrashing

3. **Timeline Reuse**:
   - Timelines được setup once, reuse nhiều lần
   - Sử dụng `.restart()`, `.reverse()` thay vì recreate

4. **Event Cleanup**:
   - Remove event listeners trong `onBeforeUnmount()`
   - Kill all timelines

### Browser Compatibility

**Required Features**:
- CSS Grid
- CSS ClipPath
- GSAP 3.x
- Vue 3 Composition API
- CSS Custom Properties
- CSS `rgb(from ...)` syntax (modern browsers)

---

## 🐛 Common Issues & Solutions

### Issue 1: Props Type Mismatch
**Problem**: CMS returns Object but component expects Array
**Solution**: Accept multiple types `[Boolean, Array, Object]` và convert to Array

### Issue 2: Null querySelector
**Problem**: `querySelector('a')` returns null
**Solution**: Add null checks before addEventListener

### Issue 3: Animation Timing
**Problem**: Animations overlap hoặc out of sync
**Solution**: Sử dụng timeline positions và callbacks

### Issue 4: Memory Leaks
**Problem**: Timelines không được cleanup
**Solution**: Kill tất cả timelines trong `onBeforeUnmount()`

---

## 📊 Data Flow Diagram

```
HomeHeader (Parent)
    ↓ highlights prop
    ├─→ Background (v-for)
    │   ├─ media prop
    │   └─ contentMedia prop
    │
    ├─→ Ribbon (v-for)
    │   ├─ title, subtitle, mainCta props
    │   └─ playFunc, pauseFunc callbacks
    │
    ├─→ Content (v-for)
    │   ├─ blocks, club props
    │   └─ playFunc, pauseFunc callbacks
    │
    └─→ Bullets (single)
        ├─ slidesNumber prop
        └─ openFunc, closeFunc, clickFunc callbacks

Event Flow:
User Click Bullet
    → clickFunc(index)
    → changeSlide(index)
    → close(index)
    → Transition animations
    → startSlider()
```

---

## 🎯 Key Takeaways

1. **Modular Design**: Mỗi component có responsibility rõ ràng
2. **Animation Orchestration**: Parent component điều phối animations của children
3. **Performance**: Sử dụng GPU-accelerated properties
4. **Flexibility**: Support nhiều data types, responsive
5. **User Experience**: Smooth transitions, auto-play/pause, manual controls

---

## 📝 Notes for Recreation

Khi tái tạo component này, cần chú ý:

1. ✅ **GSAP Plugins**: Đảm bảo import SplitText plugin
2. ✅ **Timeline Management**: Setup tất cả timelines trong init phase
3. ✅ **Z-index Layers**: Maintain đúng thứ tự layers
4. ✅ **Cleanup**: Always cleanup timelines và event listeners
5. ✅ **Responsive**: Test trên nhiều screen sizes
6. ✅ **Data Structure**: Ensure CMS data matches expected structure
7. ✅ **Color System**: Implement 5-color rotation system
8. ✅ **Menu Integration**: Connect với menu theme system

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-06  
**Author**: AI Analysis
