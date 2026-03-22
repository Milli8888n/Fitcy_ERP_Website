// 12_extract_interactions.js - Extract Interaction Patterns
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(process.cwd(), 'resources', 'source_code', 'phive.pt', 'en.html');
const CSS_PATH = path.join(process.cwd(), 'assets', 'css', 'design-system.css');
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'interactions.json');

console.log('🎮 Extracting Interaction Patterns...\n');

const interactions = {
    hover: [],
    click: [],
    scroll: [],
    gestures: [],
    keyboard: []
};

// 1. Extract hover states from CSS
if (fs.existsSync(CSS_PATH)) {
    const css = fs.readFileSync(CSS_PATH, 'utf8');

    // Find @media (hover:hover) blocks
    const hoverRegex = /@media\s*\(hover:\s*hover\)\s*\{([^}]+)\}/g;
    let match;

    while ((match = hoverRegex.exec(css)) !== null) {
        const hoverBlock = match[1];

        // Extract selectors and properties
        const selectorRegex = /([.#\w-]+):hover\s*\{([^}]+)\}/g;
        let selectorMatch;

        while ((selectorMatch = selectorRegex.exec(hoverBlock)) !== null) {
            const selector = selectorMatch[1];
            const properties = selectorMatch[2].trim();

            interactions.hover.push({
                selector,
                properties: properties.split(';').map(p => p.trim()).filter(Boolean),
                type: 'css-hover'
            });
        }
    }

    // Find transition properties
    const transitionRegex = /([.#\w-]+)\s*\{[^}]*transition:\s*([^;]+);/g;
    while ((match = transitionRegex.exec(css)) !== null) {
        const existing = interactions.hover.find(h => h.selector === match[1]);
        if (existing) {
            existing.transition = match[2].trim();
        } else {
            interactions.hover.push({
                selector: match[1],
                transition: match[2].trim(),
                type: 'css-transition'
            });
        }
    }
}

// 2. Extract click handlers from HTML
if (fs.existsSync(HTML_PATH)) {
    const html = fs.readFileSync(HTML_PATH, 'utf8');

    // Find data-component elements (likely interactive)
    const componentRegex = /data-component="([^"]+)"[^>]*class="([^"]+)"/g;
    let match;

    while ((match = componentRegex.exec(html)) !== null) {
        const component = match[1];
        const classes = match[2];

        // Identify clickable components
        if (component.includes('button') || component.includes('btn') ||
            component.includes('cta') || component.includes('burger')) {
            interactions.click.push({
                component,
                classes: classes.split(' ').filter(Boolean),
                type: 'component-click',
                description: `Interactive ${component} component`
            });
        }
    }
}

// 3. Define scroll interactions (from known patterns)
interactions.scroll = [
    {
        component: 'home-header',
        trigger: 'ScrollTrigger',
        description: 'Parallax background scaling on scroll',
        params: {
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    },
    {
        component: 'phive-clubs',
        trigger: 'ScrollTrigger + GSAP Flip',
        description: 'Grid animation on scroll into view',
        params: {
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    },
    {
        component: 'classes-showcase',
        trigger: 'ScrollTrigger',
        description: 'Horizontal scroll section',
        params: {
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1
        }
    },
    {
        component: 'bar (menu)',
        trigger: 'Scroll direction',
        description: 'Hide CTA button on scroll down',
        params: {
            threshold: 50,
            direction: 'down'
        }
    }
];

// 4. Define gesture interactions (mobile)
interactions.gestures = [
    {
        component: 'home-header',
        gesture: 'swipe-horizontal',
        description: 'Swipe to change slides',
        sensitivity: 'medium',
        threshold: 50,
        implementation: 'Custom touch handlers or Swiper.js'
    },
    {
        component: 'phive-clubs',
        gesture: 'drag-horizontal',
        description: 'Drag to scroll club grid',
        sensitivity: 'high',
        snap: true,
        implementation: 'Native overflow-x: scroll with snap-points'
    },
    {
        component: 'menu-grid',
        gesture: 'swipe-down',
        description: 'Swipe down to close menu',
        threshold: 100,
        implementation: 'Custom touch handler'
    }
];

// 5. Define keyboard interactions
interactions.keyboard = [
    {
        key: 'Escape',
        action: 'Close menu',
        component: 'menu-grid',
        priority: 'high'
    },
    {
        key: 'Tab',
        action: 'Navigate focusable elements',
        component: 'all',
        priority: 'high',
        description: 'Accessibility keyboard navigation'
    },
    {
        key: 'ArrowLeft / ArrowRight',
        action: 'Navigate slides',
        component: 'home-header',
        priority: 'medium'
    },
    {
        key: 'Space',
        action: 'Toggle menu',
        component: 'burger',
        priority: 'low'
    }
];

// Generate implementation guide
const implementationGuide = {
    hover: {
        library: 'CSS only',
        notes: 'Use @media (hover:hover) for desktop-only hover states'
    },
    click: {
        library: 'Vue @click',
        notes: 'Use native Vue event handlers with proper accessibility (role, aria-label)'
    },
    scroll: {
        library: 'GSAP ScrollTrigger + Lenis',
        notes: 'All scroll animations use ScrollTrigger. Lenis provides smooth scrolling.'
    },
    gestures: {
        library: 'Swiper.js (recommended) or Hammer.js',
        notes: 'Use Swiper for carousels, custom handlers for menu gestures'
    },
    keyboard: {
        library: 'Vue @keydown',
        notes: 'Implement keyboard shortcuts for accessibility'
    }
};

// Save
const output = {
    summary: {
        timestamp: new Date().toISOString(),
        totalInteractions: Object.values(interactions).flat().length,
        breakdown: {
            hover: interactions.hover.length,
            click: interactions.click.length,
            scroll: interactions.scroll.length,
            gestures: interactions.gestures.length,
            keyboard: interactions.keyboard.length
        }
    },
    interactions,
    implementationGuide
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

console.log(`✅ Extracted interaction patterns:`);
console.log(`   ${interactions.hover.length} hover states`);
console.log(`   ${interactions.click.length} click handlers`);
console.log(`   ${interactions.scroll.length} scroll triggers`);
console.log(`   ${interactions.gestures.length} gesture patterns`);
console.log(`   ${interactions.keyboard.length} keyboard shortcuts`);
console.log(`\n💾 Saved to ${OUTPUT_PATH}`);

// Print implementation recommendations
console.log(`\n📚 Implementation Libraries:`);
Object.entries(implementationGuide).forEach(([type, guide]) => {
    console.log(`  ${type.padEnd(12)} → ${guide.library}`);
});
