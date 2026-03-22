// 07_extract_component_tree.js - Extract Component Hierarchy
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(process.cwd(), 'resources', 'source_code', 'phive.pt', 'en.html');
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'analysis', 'component-tree.json');

console.log('🌳 Extracting Component Tree...\n');

// Read HTML
const html = fs.readFileSync(HTML_PATH, 'utf8');

// Component registry
const components = new Map();
const hierarchy = [];

// 1. Find all [data-component] elements
const componentRegex = /data-component="([^"]+)"[^>]*>/g;
let match;
let componentCount = 0;

while ((match = componentRegex.exec(html)) !== null) {
    const componentName = match[1];
    const startIdx = match.index;

    // Extract surrounding context (200 chars before/after)
    const contextStart = Math.max(0, startIdx - 200);
    const contextEnd = Math.min(html.length, startIdx + 400);
    const context = html.substring(contextStart, contextEnd);

    // Extract attributes
    const attrRegex = /data-([a-z-]+)="([^"]+)"/g;
    const attributes = {};
    let attrMatch;

    while ((attrMatch = attrRegex.exec(context)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2];
    }

    // Extract classes
    const classMatch = context.match(/class="([^"]+)"/);
    const classes = classMatch ? classMatch[1].split(' ') : [];

    // Detect parent component (look backwards for nearest data-component)
    const beforeContext = html.substring(Math.max(0, startIdx - 1000), startIdx);
    const parentMatch = beforeContext.match(/data-component="([^"]+)"[^>]*>(?!.*data-component)/);
    const parent = parentMatch ? parentMatch[1] : null;

    // Store component info
    if (!components.has(componentName)) {
        components.set(componentName, {
            name: componentName,
            count: 0,
            attributes: new Set(),
            classes: new Set(),
            parents: new Set(),
            children: new Set()
        });
    }

    const comp = components.get(componentName);
    comp.count++;
    Object.keys(attributes).forEach(attr => comp.attributes.add(attr));
    classes.forEach(cls => comp.classes.add(cls));
    if (parent) comp.parents.add(parent);

    componentCount++;
}

// 2. Build hierarchy
components.forEach((comp, name) => {
    comp.parents.forEach(parentName => {
        if (components.has(parentName)) {
            components.get(parentName).children.add(name);
        }
    });
});

// 3. Convert Sets to Arrays for JSON
const result = {
    summary: {
        totalComponents: components.size,
        totalInstances: componentCount,
        timestamp: new Date().toISOString()
    },
    components: {}
};

components.forEach((comp, name) => {
    result.components[name] = {
        name: comp.name,
        instanceCount: comp.count,
        attributes: Array.from(comp.attributes).sort(),
        classes: Array.from(comp.classes).sort(),
        parents: Array.from(comp.parents).sort(),
        children: Array.from(comp.children).sort()
    };
});

// 4. Build tree structure (root components)
const roots = [];
components.forEach((comp, name) => {
    if (comp.parents.size === 0) {
        roots.push(buildTree(name, components));
    }
});

result.tree = roots;

// Helper: Build tree recursively
function buildTree(name, componentsMap, visited = new Set()) {
    if (visited.has(name)) return { name, children: [], circular: true };
    visited.add(name);

    const comp = componentsMap.get(name);
    if (!comp) return { name, children: [], missing: true };

    return {
        name,
        children: Array.from(comp.children).map(childName =>
            buildTree(childName, componentsMap, new Set(visited))
        )
    };
}

// 5. Save
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));

console.log(`✅ Found ${components.size} unique components (${componentCount} instances)`);
console.log(`💾 Saved to ${OUTPUT_PATH}`);

// 6. Print summary
console.log('\n📊 Top Components:');
const sorted = Array.from(components.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

sorted.forEach(([name, comp]) => {
    console.log(`  ${name.padEnd(25)} ${comp.count} instances`);
});
