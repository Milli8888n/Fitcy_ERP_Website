// 08_extract_state_logic.js - Analyze State Management
const fs = require('fs');
const path = require('path');

const JS_PATH = path.join(process.cwd(), 'resources', 'source_code', 'phive.pt', '_nuxt', 'Bhbjo-UN.js');
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'state-flow.json');

console.log('🔄 Extracting State Logic...\n');

// Read minified JS
const jsCode = fs.readFileSync(JS_PATH, 'utf8');

const stateFlow = {
    summary: {
        timestamp: new Date().toISOString(),
        fileSize: jsCode.length
    },
    stores: [],
    reactiveVars: [],
    computedProps: [],
    watchers: [],
    eventBus: []
};

// 1. Find Pinia store definitions
// Pattern: defineStore("storeName", () => { ... })
const storeRegex = /defineStore\s*\(\s*["']([^"']+)["']\s*,/g;
let match;

while ((match = storeRegex.exec(jsCode)) !== null) {
    const storeName = match[1];
    const startIdx = match.index;

    // Extract store body (next 500 chars)
    const storeBody = jsCode.substring(startIdx, startIdx + 500);

    // Find state variables (ref, reactive)
    const refMatches = storeBody.match(/(?:ref|reactive)\s*\(\s*([^)]+)\)/g) || [];
    const stateVars = refMatches.map(m => {
        const valueMatch = m.match(/\(\s*([^)]+)\)/);
        return valueMatch ? valueMatch[1] : 'unknown';
    });

    stateFlow.stores.push({
        name: storeName,
        stateVariables: stateVars,
        location: `char ${startIdx}`
    });
}

// 2. Find reactive() calls
const reactiveRegex = /const\s+(\w+)\s*=\s*reactive\s*\(\s*\{([^}]+)\}/g;
while ((match = reactiveRegex.exec(jsCode)) !== null) {
    const varName = match[1];
    const props = match[2].split(',').map(p => p.trim().split(':')[0].trim());

    stateFlow.reactiveVars.push({
        name: varName,
        properties: props
    });
}

// 3. Find computed() calls
const computedRegex = /const\s+(\w+)\s*=\s*computed\s*\(/g;
while ((match = computedRegex.exec(jsCode)) !== null) {
    stateFlow.computedProps.push({
        name: match[1],
        location: `char ${match.index}`
    });
}

// 4. Find watch() calls
const watchRegex = /watch\s*\(\s*(?:\(\)\s*=>)?\s*([^,]+),/g;
while ((match = watchRegex.exec(jsCode)) !== null) {
    stateFlow.watchers.push({
        target: match[1].trim(),
        location: `char ${match.index}`
    });
}

// 5. Find event emitters (mitt, emitter patterns)
const emitRegex = /(?:emit|emitter\.emit)\s*\(\s*["']([^"']+)["']/g;
const events = new Set();

while ((match = emitRegex.exec(jsCode)) !== null) {
    events.add(match[1]);
}

stateFlow.eventBus = Array.from(events).map(event => ({ name: event }));

// 6. Find theme-related logic
const themeRegex = /theme["\s]*[:=]\s*["']([^"']+)["']/gi;
const themes = new Set();

while ((match = themeRegex.exec(jsCode)) !== null) {
    themes.add(match[1]);
}

stateFlow.themes = Array.from(themes);

// 7. Find route guards/navigation
const routeRegex = /(?:beforeEach|afterEach|onBeforeRouteUpdate)\s*\(/g;
const routeGuards = [];

while ((match = routeRegex.exec(jsCode)) !== null) {
    const guardType = jsCode.substring(match.index - 20, match.index).match(/(\w+)\s*\($/);
    routeGuards.push({
        type: guardType ? guardType[1] : 'unknown',
        location: `char ${match.index}`
    });
}

stateFlow.routeGuards = routeGuards;

// Save
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stateFlow, null, 2));

console.log(`✅ Found:`);
console.log(`   ${stateFlow.stores.length} Pinia stores`);
console.log(`   ${stateFlow.reactiveVars.length} reactive variables`);
console.log(`   ${stateFlow.computedProps.length} computed properties`);
console.log(`   ${stateFlow.watchers.length} watchers`);
console.log(`   ${stateFlow.eventBus.length} event types`);
console.log(`   ${stateFlow.themes.length} themes`);
console.log(`   ${stateFlow.routeGuards.length} route guards`);
console.log(`\n💾 Saved to ${OUTPUT_PATH}`);

// Print stores
if (stateFlow.stores.length > 0) {
    console.log('\n📦 Pinia Stores:');
    stateFlow.stores.forEach(store => {
        console.log(`  ${store.name}`);
        console.log(`    State: ${store.stateVariables.join(', ')}`);
    });
}

// Print themes
if (stateFlow.themes.length > 0) {
    console.log('\n🎨 Themes Found:');
    stateFlow.themes.forEach(theme => console.log(`  - ${theme}`));
}
