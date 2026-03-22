# ♿ ACCESSIBILITY AUDIT - PHIVE.PT

> Accessibility analysis và WCAG compliance guide

---

## 📋 WCAG 2.1 CHECKLIST

### Level A (Must Have)

**1. Text Alternatives**
- [ ] All images have alt text
- [ ] Decorative images use alt=""
- [ ] Complex images have long descriptions

**2. Keyboard Accessible**
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Visible focus indicators

**3. Enough Time**
- [ ] No time limits or adjustable
- [ ] Pause, stop, hide for moving content

**4. Seizures**
- [ ] No content flashes more than 3 times/second

**5. Navigable**
- [ ] Skip links provided
- [ ] Page titles descriptive
- [ ] Focus order logical
- [ ] Link purpose clear

**6. Input Assistance**
- [ ] Error identification
- [ ] Labels or instructions
- [ ] Error suggestions

---

## 🎯 IMPLEMENTATION

### Semantic HTML

```html
<!-- ✅ Good -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>
  <p>&copy; 2026</p>
</footer>

<!-- ❌ Bad -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
```

### ARIA Labels

```html
<!-- Buttons without text -->
<button aria-label="Close menu">
  <CloseIcon />
</button>

<!-- Form inputs -->
<label for="email">Email</label>
<input 
  id="email" 
  type="email"
  aria-required="true"
  aria-describedby="email-help"
>
<span id="email-help">We'll never share your email</span>

<!-- Dynamic content -->
<div 
  role="status" 
  aria-live="polite"
  aria-atomic="true"
>
  {{ statusMessage }}
</div>
```

### Keyboard Navigation

```vue
<script setup>
const handleKeydown = (event) => {
  switch (event.key) {
    case 'Escape':
      closeModal()
      break
    case 'ArrowDown':
      focusNext()
      break
    case 'ArrowUp':
      focusPrevious()
      break
  }
}
</script>
```

### Focus Management

```css
/* Visible focus indicators */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}

/* Skip to main content */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Color Contrast

```css
/* Minimum contrast ratios:
   - Normal text: 4.5:1
   - Large text (18pt+): 3:1
   - UI components: 3:1
*/

/* ✅ Good contrast */
.text {
  color: #000000; /* Black */
  background: #FFFFFF; /* White */
  /* Contrast: 21:1 */
}

/* ❌ Poor contrast */
.text-bad {
  color: #777777; /* Gray */
  background: #FFFFFF; /* White */
  /* Contrast: 4.47:1 - fails for normal text */
}
```

### Screen Reader Support

```html
<!-- Visually hidden but available to screen readers -->
<span class="sr-only">
  Navigate to homepage
</span>

<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

---

## 🧪 TESTING

### Automated Tools

```bash
# Lighthouse
npm run lighthouse

# axe-core
npm install @axe-core/cli
axe https://yoursite.com

# Pa11y
npm install pa11y
pa11y https://yoursite.com
```

### Manual Testing

```javascript
// Keyboard navigation test
const keyboardTest = () => {
  // 1. Tab through all interactive elements
  // 2. Verify focus indicators visible
  // 3. Test keyboard shortcuts
  // 4. Verify no keyboard traps
}

// Screen reader test
const screenReaderTest = () => {
  // 1. Test with NVDA (Windows)
  // 2. Test with JAWS (Windows)
  // 3. Test with VoiceOver (Mac/iOS)
  // 4. Test with TalkBack (Android)
}
```

---

## 📊 COMMON ISSUES

### Phive.pt Issues Found

**1. Missing Alt Text**
- Some decorative images have descriptive alt text
- Should use alt="" for decorative images

**2. Color Contrast**
- Some text fails WCAG AA (4.5:1)
- Yellow on white background: 1.07:1 ❌

**3. Keyboard Navigation**
- Some interactive elements not keyboard accessible
- Missing focus indicators on some buttons

**4. ARIA Usage**
- Overuse of ARIA where semantic HTML would suffice
- Some ARIA labels not descriptive enough

**5. Form Labels**
- Some inputs missing associated labels
- Error messages not programmatically associated

---

## ✅ RECOMMENDATIONS

### For FitCity

**1. Use Semantic HTML First**
```html
<!-- Instead of -->
<div class="button" onclick="...">

<!-- Use -->
<button type="button">
```

**2. Provide Text Alternatives**
```html
<img src="gym.jpg" alt="Modern gym with cardio equipment">
```

**3. Ensure Keyboard Access**
```javascript
// Make custom components keyboard accessible
<div 
  role="button"
  tabindex="0"
  @click="handleClick"
  @keydown.enter="handleClick"
  @keydown.space.prevent="handleClick"
>
```

**4. Test with Real Users**
- Include users with disabilities in testing
- Use actual assistive technologies
- Get feedback early and often

**5. Document Accessibility**
```markdown
# Accessibility Statement

We are committed to ensuring digital accessibility for people with disabilities.
We are continually improving the user experience for everyone.

## Conformance Status
This website is partially conformant with WCAG 2.1 level AA.

## Feedback
We welcome your feedback on the accessibility of this site.
Contact: accessibility@fitcity.com
```

---

**Created by:** Accessibility Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete  
**Next:** Implement fixes
