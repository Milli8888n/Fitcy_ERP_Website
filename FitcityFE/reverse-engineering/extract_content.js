
// extract_content.js
const fs = require('fs');
const path = require('path');

const BASE_DIR = process.cwd();
const HTML_PATH = path.join(BASE_DIR, 'resources', 'source_code', 'phive.pt', 'en.html');
const JSON_PATH = path.join(BASE_DIR, 'reverse-engineering', 'extracted_pro', 'resources.json');
const CSS_PATH = path.join(BASE_DIR, 'assets', 'css', 'design-system.css');
const OUTPUT_CONTENT = path.join(BASE_DIR, 'assets', 'content.json');
const OUTPUT_ICONS = path.join(BASE_DIR, 'assets', 'missing_icons.txt');
const IMAGES_DIR = path.join(BASE_DIR, 'assets', 'images');

console.log('🔍 Starting Extraction (Node.js)...');

const contentData = {
    translations: {},
    headings: [],
    audit: {}
};

// 1. Extract Translations
try {
    if (fs.existsSync(JSON_PATH)) {
        const jsonRaw = fs.readFileSync(JSON_PATH, 'utf8').replace(/^\uFEFF/, '');
        const json = JSON.parse(jsonRaw);
        const scriptContent = json.scripts.inline[0].content;

        // Regex for stringTranslations:{ ... }
        const match = scriptContent.match(/stringTranslations:(\{.*?\})(?:,audio|,\}\})/s);
        if (match) {
            let transStr = match[1];
            // Fix unquoted keys: {key: "val"} -> {"key": "val"}
            transStr = transStr.replace(/([a-zA-Z0-9_]+):/g, '"$1":');
            try {
                contentData.translations = JSON.parse(transStr);
                console.log('✅ Extracted UI Translations');
            } catch (e) {
                console.error('⚠️ Failed to parse translations JSON:', e.message);
            }
        }
    }
} catch (e) {
    console.error('❌ Error reading resources.json:', e.message);
}

// 2. Extract Headings & Copy
try {
    if (fs.existsSync(HTML_PATH)) {
        const html = fs.readFileSync(HTML_PATH, 'utf8');

        // H1-H6
        const headingsRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
        let match;
        while ((match = headingsRegex.exec(html)) !== null) {
            const tag = `h${match[1]}`;
            const text = match[2].trim().replace(/<[^>]*>/g, '');
            if (text) {
                contentData.headings.push({ tag, text });
                contentData.audit[tag] = (contentData.audit[tag] || 0) + 1;
            }
        }

        // Classes
        const classRegex = /class="[^"]*?(title|label|description|hero-text)[^"]*?"[^>]*>([^<]+?)</gi;
        while ((match = classRegex.exec(html)) !== null) {
            const type = match[1];
            const text = match[2].trim();
            if (text && text.length > 2) {
                contentData.headings.push({ type, text });
            }
        }
        console.log(`✅ Extracted ${contentData.headings.length} text elements`);
    }
} catch (e) {
    console.error('❌ Error reading en.html:', e.message);
}

// Save Content
fs.writeFileSync(OUTPUT_CONTENT, JSON.stringify(contentData, null, 2));
console.log(`💾 Saved content to ${OUTPUT_CONTENT}`);

// 3. Find Missing Icons
try {
    const iconExts = ['.svg', '.ico', '.png', '.webp'];
    const foundIcons = new Set();

    [HTML_PATH, CSS_PATH].forEach(file => {
        if (fs.existsSync(file)) {
            const text = fs.readFileSync(file, 'utf8');
            const urlRegex = /(?:url\(|src="|href=")(\/[^"\)]+?)(?:"|\))/g;
            let match;
            while ((match = urlRegex.exec(text)) !== null) {
                const url = match[1];
                const ext = path.extname(url).toLowerCase();
                if (iconExts.includes(ext)) {
                    foundIcons.add(url);
                }
            }
        }
    });

    const missing = [];
    foundIcons.forEach(url => {
        const filename = path.basename(url);
        const localPath = path.join(IMAGES_DIR, filename);
        if (!fs.existsSync(localPath)) {
            missing.push(url);
        }
    });

    fs.writeFileSync(OUTPUT_ICONS, missing.join('\n'));
    console.log(`✅ Found ${foundIcons.size} icon refs. ${missing.length} missing.`);
    console.log(`💾 Saved missing list to ${OUTPUT_ICONS}`);

} catch (e) {
    console.error('❌ Error finding icons:', e.message);
}
