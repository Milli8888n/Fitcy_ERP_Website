# 🛠️ FITCITY RECONSTRUCTION PLAN

> Lộ trình chi tiết để tái tạo dự án FitCity dựa trên phân tích Phive.pt

---

## 📅 PHASE 1: INFRASTRUCTURE & FOUNDATION (Day 1-3)

### 1.1 Project Initialization
- [ ] Initialize Nuxt 3 project (pnpm init)
- [ ] Setup SCSS architecture (`assets/scss/main.scss`)
- [ ] Integrate Design Tokens from `design-system.css`
- [ ] Configure `nuxt.config.ts` (Modules, CSS, Build settings)

### 1.2 Core Libraries Setup
- [ ] **GSAP:** Setup plugins (ScrollTrigger, SplitText, MorphSVG)
- [ ] **Lenis:** Create smooth scroll provider/plugin
- [ ] **Sanity:** Connect Sanity Client and Image Builder

---

## 🗄️ PHASE 2: CMS & DATA MODELING (Day 4-6)

### 2.1 Sanity Schemas
- [ ] Document types: `page`, `club`, `class`, `instructor`
- [ ] Array-based "Page Builder" with section objects
- [ ] Localized fields (EN/PT)

### 2.2 Data Ingestion
- [ ] Import assets (images/videos) to Sanity
- [ ] Create initial content for Homepage, 3 Clubs, and 5 Classes

---

## 🎨 PHASE 3: COMPONENT SYSTEM (Day 7-12)

### 3.1 Basic UI (Atoms)
- [ ] `AppButton.vue` (Variable fonts + Variants)
- [ ] `AppIcon.vue` (SVG management)
- [ ] `AppHeading.vue` (Fluid typography)

### 3.2 Feature Components (Organisms)
- [ ] `ClubCard.vue` (Hover effects, localized data)
- [ ] `ClassCard.vue` (Category badges, instructor meta)
- [ ] `TheNavigation.vue` (Sticky + Burger menu logic)
- [ ] `TheFooter.vue`

---

## 🎬 PHASE 4: MOTION & INTERACTION (Day 13-18)

### 4.1 Global Transitions
- [ ] Implement Lenis globally
- [ ] Create page transition animations (GSAP)

### 4.2 Section Animations
- [ ] **Hero:** Rolling text effect + background video parallax
- [ ] **Reveal:** ScrollTrigger fade-stagger for all grid items
- [ ] **Custom:** Magnetic cursor/button effects

---

## 🔗 PHASE 5: DYNAMIC PAGES & LOGIC (Day 19-24)

### 5.1 Route Handling
- [ ] Implementation of `[...slug].vue` to fetch data from CMS
- [ ] Custom layouts for Listing vs Detail pages

### 5.2 Business Logic
- [ ] Clubs filter logic (City/Amenities)
- [ ] Classes carousel implementation (Draggable + Progress bar)
- [ ] Booking form modal & placeholder API integration

---

## 💎 PHASE 6: POLISH & OPTIMIZATION (Day 25-30)

### 6.1 Performance
- [ ] Image optimization (WebP, dynamic sizing)
- [ ] Code splitting (Lazy load non-critical components)
- [ ] Critical CSS extraction

### 6.2 Quality Control
- [ ] Accessibility audit (ARIA, Key nav)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, iOS, Android)
- [ ] Final Lighthouse Audit (Aiming for 95+)

---

## 🎯 ĐỘI NGŨ THỰC THI (TEAM SETUP)

| Vai trò | Nhiệm vụ chính |
| :--- | :--- |
| **Lead Developer** | Architecture, Nuxt Setup, CMS Integration |
| **Creative Dev** | GSAP Animations, Three.js, Canvas, Motion |
| **Frontend Dev** | UI Components, SCSS, Layouts, Forms |
| **Content Strategist** | Sanity Management, Seeding, SEO |

---

**Bạn đã sẵn sàng để bắt đầu Giai đoạn 1 chưa?** 🚀
