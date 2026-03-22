# 🎨 ADVANCED ANIMATIONS - PHIVE.PT

> Advanced animation techniques và creative patterns

---

## 📋 ADVANCED TECHNIQUES

### 1. Scroll-Linked Animations

```javascript
// Parallax with different speeds
gsap.to('.layer-1', {
  y: -100,
  scrollTrigger: {
    scrub: true
  }
})

gsap.to('.layer-2', {
  y: -200,
  scrollTrigger: {
    scrub: true
  }
})
```

### 2. Morphing SVG

```javascript
gsap.to('.shape', {
  morphSVG: '.target-shape',
  duration: 1.5,
  ease: 'power2.inOut'
})
```

### 3. Text Reveal

```javascript
// Split text into characters
const chars = new SplitText('.text', { type: 'chars' })

// Animate each character
gsap.from(chars.chars, {
  opacity: 0,
  y: 50,
  stagger: 0.05,
  duration: 0.8
})
```

### 4. Magnetic Buttons

```javascript
const button = document.querySelector('.magnetic-btn')

button.addEventListener('mousemove', (e) => {
  const rect = button.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  
  gsap.to(button, {
    x: x * 0.3,
    y: y * 0.3,
    duration: 0.3
  })
})

button.addEventListener('mouseleave', () => {
  gsap.to(button, {
    x: 0,
    y: 0,
    duration: 0.5
  })
})
```

### 5. Page Transitions

```javascript
// Curtain transition
const curtainTransition = () => {
  const tl = gsap.timeline()
  
  tl.to('.curtain-top', {
      scaleY: 1,
      transformOrigin: 'bottom',
      duration: 0.5
    })
    .to('.curtain-bottom', {
      scaleY: 1,
      transformOrigin: 'top',
      duration: 0.5
    }, '-=0.3')
    .to('.curtain-line', {
      scaleX: 1,
      duration: 0.3
    }, '-=0.2')
    
  return tl
}
```

---

**Created by:** Animation Team  
**Date:** 05/02/2026  
**Status:** ✅ Complete
