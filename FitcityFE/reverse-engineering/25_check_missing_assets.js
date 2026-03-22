const fs = require('fs');
const path = require('path');

const masterListPath = 'f:/FitcityFE/docs/master_asset_list.txt';
const baseDir = 'f:/FitcityFE/assets/downloaded';

const urls = fs.readFileSync(masterListPath, 'utf8').split('\n').filter(line => line.trim() !== '');
const folders = ['api_data', 'images', 'misc', 'models_fonts', 'videos'];

const missingUrls = [];

urls.forEach(url => {
    let fileName = url.trim().split('/').pop();
    if (fileName.includes('?')) fileName = fileName.split('?')[0];

    // MATCH DOWNLOADER LOGIC: Replace space with underscore for local file check
    fileName = fileName.replace(/ /g, '_');

    const finalFileName = fileName.includes('.') ? fileName : fileName + '.json';

    let found = false;
    for (const folder of folders) {
        if (fs.existsSync(path.join(baseDir, folder, finalFileName))) {
            found = true;
            break;
        }
    }

    if (!found) {
        missingUrls.push(url);
    }
});

fs.writeFileSync('f:/FitcityFE/docs/missing_assets.txt', missingUrls.join('\n'));

console.log(`✅ Asset check complete.`);
console.log(`❌ Truly missing: ${missingUrls.length}`);
if (missingUrls.length > 0) {
    console.log('Check docs/missing_assets.txt for details.');
}
