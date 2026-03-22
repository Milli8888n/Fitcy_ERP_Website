const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('🔍 EXTRACTING MISSING COMPONENTS\n');
console.log('='.repeat(70));

// Read HTML
const htmlPath = path.join(__dirname, '../resources/source_code/phive.pt/en.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Components to extract
const componentsToExtract = [
    'three-scene',
    'button-variable',
    'input',
    'input-wrapper',
    'legal-notice',
    'form-modal',
    'class-modal'
];

const extractedData = {
    timestamp: new Date().toISOString(),
    components: {}
};

componentsToExtract.forEach(componentName => {
    console.log(`\n[${componentName}] Extracting...`);

    const elements = document.querySelectorAll(`[data-component="${componentName}"]`);

    if (elements.length === 0) {
        console.log(`   ⚠️  Not found in HTML`);
        extractedData.components[componentName] = {
            found: false,
            instances: 0
        };
        return;
    }

    console.log(`   ✅ Found ${elements.length} instance(s)`);

    const componentData = {
        found: true,
        instances: elements.length,
        examples: []
    };

    // Extract first 2 examples
    const exampleCount = Math.min(2, elements.length);
    for (let i = 0; i < exampleCount; i++) {
        const el = elements[i];

        // Get attributes
        const attributes = {};
        for (let attr of el.attributes) {
            if (attr.name !== 'data-component') {
                attributes[attr.name] = attr.value;
            }
        }

        // Get classes
        const classes = Array.from(el.classList);

        // Get structure (simplified)
        const structure = {
            tag: el.tagName.toLowerCase(),
            attributes,
            classes,
            childrenCount: el.children.length,
            textContent: el.textContent.trim().substring(0, 100) // First 100 chars
        };

        // Get parent component
        let parent = el.parentElement;
        let parentComponent = null;
        while (parent && !parentComponent) {
            if (parent.hasAttribute('data-component')) {
                parentComponent = parent.getAttribute('data-component');
            }
            parent = parent.parentElement;
        }

        // Get child components
        const childComponents = Array.from(el.querySelectorAll('[data-component]'))
            .map(child => child.getAttribute('data-component'))
            .filter((v, i, a) => a.indexOf(v) === i); // unique

        componentData.examples.push({
            structure,
            parentComponent,
            childComponents,
            innerHTML: el.innerHTML.substring(0, 500) // First 500 chars
        });
    }

    extractedData.components[componentName] = componentData;
});

// Save to file
const outputPath = path.join(__dirname, '../docs/analysis/missing-components.json');
fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));

console.log('\n' + '='.repeat(70));
console.log('\n📊 SUMMARY:\n');

let foundCount = 0;
let notFoundCount = 0;

componentsToExtract.forEach(name => {
    const data = extractedData.components[name];
    if (data.found) {
        foundCount++;
        console.log(`✅ ${name}: ${data.instances} instance(s)`);
    } else {
        notFoundCount++;
        console.log(`❌ ${name}: Not found`);
    }
});

console.log(`\n✅ Found: ${foundCount}/${componentsToExtract.length}`);
console.log(`❌ Not found: ${notFoundCount}/${componentsToExtract.length}`);

console.log('\n💾 Saved to: docs/analysis/missing-components.json');
console.log('');
