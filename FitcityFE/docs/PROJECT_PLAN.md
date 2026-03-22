# 📋 FITCITY HOMEPAGE RECONSTRUCTION - PROJECT PLAN
**Version**: 1.0  
**Date**: 2026-02-05  
**PM**: Antigravity AI  
**Status**: Ready to Execute

---

## 📊 PROJECT OVERVIEW

### **Scope**
Reconstruct FitCity/Phive homepage using reverse-engineered assets and specifications to achieve 99%+ visual fidelity with the original site.

### **Timeline**
- **Start Date**: 2026-02-06 (Thursday)
- **Launch Date**: 2026-03-06 (Friday)
- **Duration**: 4 weeks (20 working days)
- **Sprints**: 4 x 1-week sprints

### **Team Structure**
| Role | Responsibility | FTE |
|------|---------------|-----|
| **Tech Lead** | Architecture, code review, deployment | 1.0 |
| **Frontend Developer** | Component implementation, animations | 1.0 |
| **QA Engineer** | Testing, accessibility audit | 0.5 |

### **Budget Estimate**
| Item | Cost | Notes |
|------|------|-------|
| Development (3 devs x 4 weeks) | $24,000 | $2,000/week per dev |
| Sanity CMS Setup | $500 | One-time |
| Vercel Hosting (Pro) | $20/month | Production + preview |
| Testing Tools | $200 | Lighthouse, axe DevTools |
| **Total** | **$24,720** | |

---

## 🎯 SUCCESS METRICS (KPIs)

### **Technical KPIs**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Visual Fidelity | 99%+ | Manual QA comparison |
| Lighthouse Performance | 90+ | Chrome DevTools |
| Lighthouse Accessibility | 95+ | Chrome DevTools |
| Core Web Vitals (LCP) | < 2.5s | Real User Monitoring |
| Core Web Vitals (FID) | < 100ms | Real User Monitoring |
| Core Web Vitals (CLS) | < 0.1 | Real User Monitoring |
| Animation Accuracy | 95%+ | Side-by-side comparison |
| Mobile Responsiveness | 100% | Cross-device testing |

### **Project KPIs**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Sprint Velocity | 100% | Story points completed |
| Code Coverage | 80%+ | Vitest reports |
| Bug Density | < 5 bugs/sprint | Jira tracking |
| On-Time Delivery | 100% | Sprint completion |

---

## 📅 SPRINT BREAKDOWN

### **Sprint 1: Foundation (Week 1) - Feb 6-12**
**Goal**: Setup project infrastructure and implement global components

#### **Day 1-2 (Thu-Fri): Project Setup**
- [ ] Initialize Nuxt 3 project
- [ ] Install dependencies (GSAP, Lenis, TresJS, Pinia)
- [ ] Setup TypeScript configuration
- [ ] Configure ESLint + Prettier
- [ ] Setup Git repository + CI/CD (GitHub Actions)
- [ ] Copy extracted assets to project
- [ ] Configure Vercel deployment

**Deliverables**:
- ✅ Working dev environment
- ✅ Deployed to Vercel (preview)
- ✅ CI/CD pipeline active

**Story Points**: 8  
**Risk**: Low

---

#### **Day 3-4 (Mon-Tue): Design System & Stores**
- [ ] Implement `design-system.css` (CSS variables, grid)
- [ ] Setup Pinia stores from `pinia-stores-enhanced.ts`
  - [ ] useThemeStore
  - [ ] useTransitionStore
  - [ ] useMenuStore
  - [ ] useScrollStore
- [ ] Create `useResponsive` composable
- [ ] Test theme switching

**Deliverables**:
- ✅ Design system active
- ✅ All 4 Pinia stores working
- ✅ Theme switching functional

**Story Points**: 10  
**Risk**: Low

---

#### **Day 5 (Wed): Curtain Component**
- [ ] Implement `Curtain.vue`
- [ ] Use `animation-parameters.js` for timings
- [ ] Connect to `useTransitionStore`
- [ ] Test enter/exit animations
- [ ] Add loading state

**Deliverables**:
- ✅ Curtain component complete
- ✅ Page transitions working

**Story Points**: 5  
**Risk**: Medium (complex GSAP animations)

---

#### **Day 6-7 (Thu-Fri): Menu Grid**
- [ ] Implement `MenuGrid.vue`
- [ ] Implement `Burger.vue` (toggle button)
- [ ] Use `animation-parameters.js` for menu animations
- [ ] Connect to `useMenuStore`
- [ ] Add keyboard shortcuts (Escape to close)
- [ ] Test mobile swipe-to-close

**Deliverables**:
- ✅ Menu grid complete
- ✅ Burger toggle working
- ✅ Keyboard navigation active

**Story Points**: 8  
**Risk**: Medium

**Sprint 1 Total**: 31 story points

---

### **Sprint 2: Home Page Core (Week 2) - Feb 13-19**
**Goal**: Implement main home page components

#### **Day 8-10 (Mon-Wed): Home Header Slider**
- [ ] Implement `HomeHeader.vue`
- [ ] Implement `Background.vue` (parallax)
- [ ] Implement `Ribbon.vue`
- [ ] Implement `Content.vue`
- [ ] Implement `Bullets.vue` (navigation)
- [ ] Use `animation-parameters.js` for all timings
- [ ] Add swipe gestures (mobile)
- [ ] Connect to `useThemeStore` (theme per slide)
- [ ] Test autoplay + manual navigation

**Deliverables**:
- ✅ Home header slider complete
- ✅ Theme switching per slide
- ✅ Mobile swipe working

**Story Points**: 13  
**Risk**: High (complex multi-timeline animations)

---

#### **Day 11-12 (Thu-Fri): Phive Clubs Section**
- [ ] Implement `PhiveClubs.vue`
- [ ] Implement `PhotoGrid.vue`
- [ ] Implement GSAP Flip animation
- [ ] Add ScrollTrigger integration
- [ ] Test grid reveal animation
- [ ] Add mobile horizontal scroll

**Deliverables**:
- ✅ Phive Clubs section complete
- ✅ GSAP Flip animation working
- ✅ Mobile scroll functional

**Story Points**: 10  
**Risk**: High (GSAP Flip complexity)

---

#### **Day 13-14 (Mon-Tue): 3D Scene**
- [ ] Implement `ThreeScene.vue`
- [ ] Load GLB model
- [ ] Setup instanced meshes
- [ ] Add click interactions
- [ ] Add GSAP animations for instances
- [ ] Optimize for mobile (reduce instance count)
- [ ] Add fallback for low-end devices

**Deliverables**:
- ✅ 3D scene working
- ✅ Click interactions active
- ✅ Mobile optimization done

**Story Points**: 13  
**Risk**: High (Three.js complexity)

**Sprint 2 Total**: 36 story points

---

### **Sprint 3: Additional Sections & CMS (Week 3) - Feb 20-26**
**Goal**: Complete remaining sections and integrate Sanity CMS

#### **Day 15-16 (Wed-Thu): Classes Showcase**
- [ ] Implement `ClassesShowcase.vue`
- [ ] Implement horizontal scroll (ScrollTrigger)
- [ ] Add card animations
- [ ] Test scroll snap behavior

**Deliverables**:
- ✅ Classes showcase complete
- ✅ Horizontal scroll working

**Story Points**: 8  
**Risk**: Medium

---

#### **Day 17 (Fri): Footer & Forms**
- [ ] Implement `Footer.vue`
- [ ] Implement contact form
- [ ] Add form validation (from `error-handling.json`)
- [ ] Test form submission

**Deliverables**:
- ✅ Footer complete
- ✅ Contact form working

**Story Points**: 5  
**Risk**: Low

---

#### **Day 18-19 (Mon-Tue): Sanity CMS Integration**
- [ ] Setup Sanity project
- [ ] Implement schemas from `sanity-schema.ts`
- [ ] Add sample data (from `mock-data.json`)
- [ ] Implement GROQ queries (from `groq-queries.ts`)
- [ ] Connect to Nuxt
- [ ] Test data fetching
- [ ] Add image optimization (Sanity CDN)

**Deliverables**:
- ✅ Sanity CMS setup
- ✅ All data fetching working
- ✅ Images optimized

**Story Points**: 10  
**Risk**: Medium

---

#### **Day 20-21 (Wed-Thu): Error Handling & Loading States**
- [ ] Implement error boundaries
- [ ] Add loading skeletons
- [ ] Add toast notifications (vue-toastification)
- [ ] Implement retry logic
- [ ] Test all error scenarios (from `error-handling.json`)

**Deliverables**:
- ✅ Error handling complete
- ✅ Loading states working
- ✅ Toast notifications active

**Story Points**: 8  
**Risk**: Low

**Sprint 3 Total**: 31 story points

---

### **Sprint 4: Polish & Launch (Week 4) - Feb 27 - Mar 6**
**Goal**: Testing, optimization, and production launch

#### **Day 22-23 (Fri-Mon): Performance Optimization**
- [ ] Implement lazy loading (from `performance-guide.json`)
- [ ] Add image optimization
- [ ] Configure bundle splitting
- [ ] Add caching headers
- [ ] Test Core Web Vitals
- [ ] Optimize animations for 60fps

**Deliverables**:
- ✅ Lighthouse score 90+
- ✅ Core Web Vitals passing

**Story Points**: 8  
**Risk**: Medium

---

#### **Day 24-25 (Tue-Wed): Responsive & Accessibility**
- [ ] Test all breakpoints (from `responsive-logic.json`)
- [ ] Fix mobile layout issues
- [ ] Add keyboard navigation
- [ ] Add ARIA labels
- [ ] Test with screen reader
- [ ] Fix color contrast issues
- [ ] Add reduced motion support

**Deliverables**:
- ✅ Mobile responsive 100%
- ✅ WCAG AA compliant

**Story Points**: 10  
**Risk**: Medium

---

#### **Day 26-27 (Thu-Fri): QA & Bug Fixes**
- [ ] Manual QA (side-by-side comparison)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Cross-device testing (iOS, Android)
- [ ] Fix critical bugs
- [ ] Fix visual discrepancies
- [ ] Performance regression testing

**Deliverables**:
- ✅ All critical bugs fixed
- ✅ Visual fidelity 99%+

**Story Points**: 10  
**Risk**: Low

---

#### **Day 28 (Mon): Pre-Launch Checklist**
- [ ] Final code review
- [ ] Update documentation
- [ ] Setup production environment
- [ ] Configure analytics (Google Analytics, Vercel Analytics)
- [ ] Setup error tracking (Sentry)
- [ ] Create deployment runbook
- [ ] Stakeholder demo

**Deliverables**:
- ✅ Production ready
- ✅ Stakeholder approval

**Story Points**: 5  
**Risk**: Low

---

#### **Day 29-30 (Tue-Wed): Launch & Monitoring**
- [ ] Deploy to production
- [ ] Monitor performance (first 24h)
- [ ] Monitor errors (Sentry)
- [ ] Fix any critical issues
- [ ] Collect user feedback
- [ ] Create post-launch report

**Deliverables**:
- ✅ Live in production
- ✅ No critical issues

**Story Points**: 5  
**Risk**: Medium (production issues)

**Sprint 4 Total**: 38 story points

---

## 📊 TOTAL PROJECT SUMMARY

| Sprint | Focus | Story Points | Risk Level |
|--------|-------|--------------|------------|
| Sprint 1 | Foundation | 31 | Low-Medium |
| Sprint 2 | Home Page Core | 36 | High |
| Sprint 3 | CMS & Error Handling | 31 | Medium |
| Sprint 4 | Polish & Launch | 38 | Medium |
| **Total** | | **136** | |

**Average Velocity**: 34 story points/sprint

---

## 🎯 MILESTONES

| Milestone | Date | Deliverable | Success Criteria |
|-----------|------|-------------|------------------|
| **M1: Foundation Complete** | Feb 12 | Dev environment + global components | Curtain + Menu working |
| **M2: Home Page Core** | Feb 19 | Header + Clubs + 3D Scene | All animations accurate |
| **M3: CMS Integration** | Feb 26 | Sanity + error handling | Data fetching working |
| **M4: Production Launch** | Mar 6 | Live website | Lighthouse 90+, no critical bugs |

---

## ⚠️ RISK MANAGEMENT

### **High-Risk Items**

#### **Risk 1: GSAP Animation Complexity**
- **Impact**: High (affects visual fidelity)
- **Probability**: Medium
- **Mitigation**: 
  - Use extracted `animation-parameters.js` (exact timings)
  - Allocate extra time for Sprint 2
  - Daily side-by-side comparison
- **Contingency**: Simplify animations if timeline slips

#### **Risk 2: Three.js Performance on Mobile**
- **Impact**: Medium (affects mobile UX)
- **Probability**: High
- **Mitigation**:
  - Implement device detection
  - Reduce instance count on mobile
  - Add fallback (static image)
- **Contingency**: Disable 3D on low-end devices

#### **Risk 3: Timeline Slippage**
- **Impact**: High (delays launch)
- **Probability**: Medium
- **Mitigation**:
  - Daily standups
  - Weekly sprint reviews
  - Buffer time in Sprint 4
- **Contingency**: Cut non-critical features (e.g., some animations)

### **Medium-Risk Items**

#### **Risk 4: Sanity CMS Learning Curve**
- **Impact**: Medium
- **Probability**: Low
- **Mitigation**: Use generated schemas + queries
- **Contingency**: Use mock data initially

#### **Risk 5: Cross-Browser Compatibility**
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**: Test early and often
- **Contingency**: Add polyfills

---

## 📋 DAILY STANDUP FORMAT

**Time**: 9:00 AM daily  
**Duration**: 15 minutes

**Agenda**:
1. What did you complete yesterday?
2. What will you work on today?
3. Any blockers?

**Tracking**: Jira board (To Do → In Progress → Review → Done)

---

## 🔄 SPRINT CEREMONIES

### **Sprint Planning** (Monday 9:00 AM, 2 hours)
- Review sprint goal
- Estimate story points
- Assign tasks
- Identify dependencies

### **Daily Standup** (Every day 9:00 AM, 15 min)
- Progress updates
- Blocker identification

### **Sprint Review** (Friday 3:00 PM, 1 hour)
- Demo completed work
- Stakeholder feedback
- Accept/reject stories

### **Sprint Retrospective** (Friday 4:00 PM, 1 hour)
- What went well?
- What could improve?
- Action items for next sprint

---

## 📊 REPORTING

### **Weekly Status Report** (Every Friday 5:00 PM)

**Template**:
```
## Week X Status Report

**Sprint Goal**: [Goal]
**Completed**: X/Y story points
**Velocity**: X%

### Accomplishments
- ✅ [Item 1]
- ✅ [Item 2]

### Blockers
- ⚠️ [Blocker 1] - [Resolution plan]

### Next Week Plan
- [ ] [Task 1]
- [ ] [Task 2]

### Risks
- 🔴 [High risk item]
- 🟡 [Medium risk item]

### Metrics
- Lighthouse Score: X
- Code Coverage: X%
- Open Bugs: X
```

---

## 🛠️ TOOLS & INFRASTRUCTURE

### **Development**
| Tool | Purpose | Cost |
|------|---------|------|
| VS Code | IDE | Free |
| Git + GitHub | Version control | Free |
| Nuxt 3 | Framework | Free |
| Vercel | Hosting + CI/CD | $20/month |

### **Project Management**
| Tool | Purpose | Cost |
|------|---------|------|
| Jira | Task tracking | $10/month |
| Slack | Communication | Free |
| Figma | Design reference | Free |

### **Testing & Monitoring**
| Tool | Purpose | Cost |
|------|---------|------|
| Vitest | Unit testing | Free |
| Playwright | E2E testing | Free |
| Lighthouse | Performance | Free |
| Sentry | Error tracking | $26/month |
| Google Analytics | Analytics | Free |

**Total Monthly Cost**: $56

---

## 📚 DOCUMENTATION DELIVERABLES

### **Technical Documentation**
- [ ] README.md (setup instructions)
- [ ] CONTRIBUTING.md (code standards)
- [ ] API.md (Sanity queries)
- [ ] DEPLOYMENT.md (deployment guide)

### **User Documentation**
- [ ] CMS Guide (for content editors)
- [ ] Style Guide (design system)

### **Project Documentation**
- [ ] Architecture Decision Records (ADRs)
- [ ] Post-Launch Report
- [ ] Handover Document

---

## ✅ DEFINITION OF DONE

A story is "Done" when:
- [ ] Code is written and reviewed
- [ ] Unit tests pass (80%+ coverage)
- [ ] Visual QA passed (99%+ match)
- [ ] Accessibility tested (WCAG AA)
- [ ] Mobile responsive tested
- [ ] Performance tested (Lighthouse 90+)
- [ ] Deployed to preview environment
- [ ] Stakeholder approved

---

## 🎯 ACCEPTANCE CRITERIA (FINAL)

### **Visual Fidelity**
- [ ] 99%+ match to original site (manual QA)
- [ ] All animations accurate (side-by-side comparison)
- [ ] Typography matches (fonts, sizes, spacing)
- [ ] Colors match (exact hex values)

### **Performance**
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 95+
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

### **Functionality**
- [ ] All components interactive
- [ ] Theme switching works
- [ ] Menu navigation works
- [ ] Forms submit correctly
- [ ] 3D scene interactive
- [ ] Mobile gestures work

### **Quality**
- [ ] Zero critical bugs
- [ ] < 5 minor bugs
- [ ] Code coverage 80%+
- [ ] WCAG AA compliant
- [ ] Cross-browser tested

---

## 📞 STAKEHOLDER COMMUNICATION

### **Weekly Demo** (Every Friday 2:00 PM)
- Show progress
- Get feedback
- Adjust priorities

### **Launch Readiness Review** (Mar 5, 2:00 PM)
- Final walkthrough
- Go/No-Go decision
- Launch plan review

---

## 🚀 LAUNCH PLAN

### **Pre-Launch (Mar 5)**
- [ ] Final QA sign-off
- [ ] Stakeholder approval
- [ ] Production environment ready
- [ ] Analytics configured
- [ ] Error tracking active

### **Launch Day (Mar 6, 10:00 AM)**
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Monitor for 1 hour
- [ ] Announce launch

### **Post-Launch (Mar 6-7)**
- [ ] Monitor performance (24h)
- [ ] Monitor errors (Sentry)
- [ ] Collect user feedback
- [ ] Fix critical issues (if any)
- [ ] Create post-launch report

---

## 📈 POST-LAUNCH SUPPORT (Week 5)

### **Support Period**: Mar 7-13 (1 week)
- [ ] Monitor production
- [ ] Fix critical bugs (P0)
- [ ] Fix high-priority bugs (P1)
- [ ] Performance tuning
- [ ] Create handover document

**Support Hours**: 20 hours (0.5 FTE)

---

## 💰 BUDGET BREAKDOWN

| Category | Item | Cost |
|----------|------|------|
| **Labor** | Tech Lead (4 weeks) | $8,000 |
| | Frontend Dev (4 weeks) | $8,000 |
| | QA Engineer (2 weeks) | $4,000 |
| | PM Overhead (10%) | $2,000 |
| **Infrastructure** | Vercel Pro (1 month) | $20 |
| | Sanity CMS Setup | $500 |
| | Sentry (1 month) | $26 |
| | Jira (1 month) | $10 |
| **Testing** | Tools & Licenses | $200 |
| **Contingency** | 10% buffer | $2,076 |
| **Total** | | **$24,832** |

---

## 📋 APPENDIX

### **A. Extracted Files Reference**
- `animation-parameters.js` - All GSAP timings
- `component-types.ts` - TypeScript interfaces
- `pinia-stores-enhanced.ts` - State management
- `groq-queries.ts` - Sanity queries
- `responsive-logic.json` - Mobile/desktop patterns
- `performance-guide.json` - Optimization strategies

### **B. Original Site**
- URL: https://phive.pt
- Lighthouse Score: 85 (Performance)
- Tech Stack: Nuxt 3, GSAP, Three.js, Sanity

### **C. Contact Information**
- **PM**: Antigravity AI
- **Tech Lead**: [TBD]
- **Stakeholder**: [TBD]

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-05  
**Next Review**: 2026-02-12 (Sprint 1 Retrospective)
