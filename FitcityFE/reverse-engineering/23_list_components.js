const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '../resources/source_code/phive.pt/en.html'), 'utf-8');
const matches = html.match(/data-component="([^"]+)"/g) || [];
const unique = [...new Set(matches.map(m => m.match(/data-component="([^"]+)"/)[1]))].sort();
console.log(unique.join('\n'));
