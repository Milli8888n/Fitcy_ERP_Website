const fs = require('fs');
const path = require('path');

console.log('🚀 RE-EXTRACTING ASSETS WITH IMPROVED REGEX (SPACES SUPPORT)...');

const SEARCH_DIRS = [
    'resources/source_code/phive.pt'
];

// This regex looks for URLs starting with http and ending with a known extension,
// allowing spaces since some URLs in the JSON actually have them.
const regex = /https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|svg|gif|mp4|webm|mov|glb|gltf|riv|woff|woff2|json)(?:\?[^"']*)?/gi;

const urls = new Set();

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !fullPath.includes('node_modules')) {
            walkDir(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(fullPath);
            if (['.json', '.html', '.js', '.css', '.vue'].includes(ext)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                let match;
                while ((match = regex.exec(content)) !== null) {
                    urls.add(match[0].trim());
                }
            }
        }
    }
}

SEARCH_DIRS.forEach(dir => {
    const fullPath = path.join('f:/FitcityFE', dir);
    if (fs.existsSync(fullPath)) walkDir(fullPath);
});

// Also manually add the API URLs that we know are there but might not have extensions
const manuals = [
    'https://join.phive.pt/wp-json/jet-cct/aulas_agendadas/?nome_clube=Lisboa%20Health%20Club',
    'https://join.phive.pt/wp-json/jet-cct/aulas_agendadas/?nome_clube=Phive%20Porto%20Health%20Club',
    'https://join.phive.pt/wp-json/jet-cct/aulas_agendadas/?nome_clube=Celas%20Fitness%20Club',
    'https://join.phive.pt/wp-json/jet-cct/aulas_agendadas/?nome_clube=L%C3%A1grimas%20Health%20Club',
    'https://join.phive.pt/wp-json/jet-cct/aulas_agendadas/?nome_clube=Leiria%20Health%20Club'
];
manuals.forEach(u => urls.add(u));

const urlList = Array.from(urls).filter(u => !u.includes('${')); // Remove templates
fs.writeFileSync('f:/FitcityFE/docs/master_asset_list.txt', urlList.join('\n'));

console.log(`✅ Refined: ${urlList.length} assets found.`);
