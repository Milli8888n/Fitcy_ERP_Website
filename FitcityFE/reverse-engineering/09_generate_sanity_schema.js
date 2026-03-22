// 09_generate_sanity_schema.js - Generate TypeScript Schemas
const fs = require('fs');
const path = require('path');

const CONTENT_PATH = path.join(process.cwd(), 'assets', 'content.json');
const OUTPUT_TS = path.join(process.cwd(), 'docs', 'analysis', 'sanity-schema.ts');
const OUTPUT_MOCK = path.join(process.cwd(), 'docs', 'analysis', 'mock-data.json');

console.log('📐 Generating Sanity Schemas...\n');

// Read content
const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));

// Analyze content structure
const schemas = {
    Club: {
        fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'slug', required: true },
            { name: 'location', type: 'string' },
            { name: 'heroImage', type: 'image' },
            { name: 'description', type: 'text' },
            { name: 'openingHours', type: 'string' },
            { name: 'facilities', type: 'array', of: 'string' }
        ]
    },
    Class: {
        fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'slug', required: true },
            { name: 'description', type: 'text' },
            { name: 'duration', type: 'number' },
            { name: 'intensity', type: 'string' },
            { name: 'instructor', type: 'reference', to: 'Instructor' },
            { name: 'image', type: 'image' }
        ]
    },
    Instructor: {
        fields: [
            { name: 'name', type: 'string', required: true },
            { name: 'bio', type: 'text' },
            { name: 'photo', type: 'image' },
            { name: 'specialties', type: 'array', of: 'string' }
        ]
    },
    HomeSlide: {
        fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'subtitle', type: 'string' },
            { name: 'backgroundImage', type: 'image' },
            { name: 'theme', type: 'string', options: ['light', 'dark', 'stream', 'pilates', 'nutrition'] },
            {
                name: 'cta', type: 'object', fields: [
                    { name: 'label', type: 'string' },
                    { name: 'url', type: 'string' }
                ]
            }
        ]
    }
};

// Generate TypeScript interfaces
let tsContent = `// Auto-generated Sanity Schema Types
// Generated: ${new Date().toISOString()}

`;

Object.entries(schemas).forEach(([schemaName, schema]) => {
    tsContent += `\n// ${schemaName} Interface\n`;
    tsContent += `export interface ${schemaName} {\n`;

    schema.fields.forEach(field => {
        const optional = field.required ? '' : '?';
        let tsType = 'string';

        switch (field.type) {
            case 'number': tsType = 'number'; break;
            case 'array': tsType = `${field.of}[]`; break;
            case 'image': tsType = 'SanityImage'; break;
            case 'reference': tsType = field.to; break;
            case 'object': tsType = `{\n    ${field.fields.map(f => `${f.name}: ${f.type}`).join(';\n    ')}\n  }`; break;
            case 'slug': tsType = '{ current: string }'; break;
            default: tsType = 'string';
        }

        tsContent += `  ${field.name}${optional}: ${tsType};\n`;
    });

    tsContent += `}\n`;
});

// Add Sanity Image type
tsContent += `\n// Sanity Image Type\nexport interface SanityImage {\n`;
tsContent += `  asset: {\n    _ref: string;\n    _type: 'reference';\n  };\n`;
tsContent += `  hotspot?: { x: number; y: number };\n`;
tsContent += `  crop?: { top: number; bottom: number; left: number; right: number };\n`;
tsContent += `}\n`;

// Generate Sanity schema definitions
tsContent += `\n// Sanity Schema Definitions\n`;
tsContent += `import { defineType, defineField } from 'sanity';\n\n`;

Object.entries(schemas).forEach(([schemaName, schema]) => {
    const lowerName = schemaName.toLowerCase();
    tsContent += `export const ${lowerName}Schema = defineType({\n`;
    tsContent += `  name: '${lowerName}',\n`;
    tsContent += `  title: '${schemaName}',\n`;
    tsContent += `  type: 'document',\n`;
    tsContent += `  fields: [\n`;

    schema.fields.forEach(field => {
        tsContent += `    defineField({\n`;
        tsContent += `      name: '${field.name}',\n`;
        tsContent += `      title: '${field.name.charAt(0).toUpperCase() + field.name.slice(1)}',\n`;
        tsContent += `      type: '${field.type}',\n`;
        if (field.required) tsContent += `      validation: Rule => Rule.required(),\n`;
        if (field.options) tsContent += `      options: { list: ${JSON.stringify(field.options)} },\n`;
        if (field.of) tsContent += `      of: [{ type: '${field.of}' }],\n`;
        if (field.to) tsContent += `      to: [{ type: '${field.to.toLowerCase()}' }],\n`;
        if (field.fields) {
            tsContent += `      fields: [\n`;
            field.fields.forEach(subField => {
                tsContent += `        { name: '${subField.name}', type: '${subField.type}' },\n`;
            });
            tsContent += `      ],\n`;
        }
        tsContent += `    }),\n`;
    });

    tsContent += `  ],\n`;
    tsContent += `});\n\n`;
});

// Generate mock data
const mockData = {
    clubs: [
        {
            _id: 'club-porto',
            _type: 'club',
            title: 'Phive Porto',
            slug: { current: 'porto' },
            location: 'Boavista',
            heroImage: { asset: { _ref: 'image-porto-hero' } },
            description: 'Modern fitness club in Porto',
            openingHours: '06:30 - 22:00',
            facilities: ['Swimming Pool', 'Sauna', 'Pilates Studio', 'Gym']
        },
        {
            _id: 'club-lisbon',
            _type: 'club',
            title: 'Phive Lisbon',
            slug: { current: 'lisbon' },
            location: 'Avenida 5 de Outubro',
            heroImage: { asset: { _ref: 'image-lisbon-hero' } },
            description: 'Premium fitness in Lisbon',
            openingHours: '06:30 - 22:00',
            facilities: ['Swimming Pool', 'Turkish Bath', 'Jacuzzi', 'Gym']
        }
    ],
    homeSlides: [
        {
            _id: 'slide-1',
            _type: 'homeSlide',
            title: 'Train every day',
            subtitle: 'from 06:30am to 10pm',
            backgroundImage: { asset: { _ref: 'image-slide-1' } },
            theme: 'light',
            cta: { label: 'Discover the Club', url: '/clubs' }
        }
    ]
};

// Save files
fs.mkdirSync(path.dirname(OUTPUT_TS), { recursive: true });
fs.writeFileSync(OUTPUT_TS, tsContent);
fs.writeFileSync(OUTPUT_MOCK, JSON.stringify(mockData, null, 2));

console.log(`✅ Generated:`);
console.log(`   ${Object.keys(schemas).length} TypeScript interfaces`);
console.log(`   ${Object.keys(schemas).length} Sanity schema definitions`);
console.log(`   ${mockData.clubs.length} mock clubs`);
console.log(`   ${mockData.homeSlides.length} mock slides`);
console.log(`\n💾 Saved to:`);
console.log(`   ${OUTPUT_TS}`);
console.log(`   ${OUTPUT_MOCK}`);

console.log(`\n📋 Schemas Generated:`);
Object.keys(schemas).forEach(name => console.log(`  - ${name}`));
