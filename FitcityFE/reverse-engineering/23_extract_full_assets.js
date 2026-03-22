const fs = require('fs');
const path = require('path');

console.log('🚀 ĐANG KHỞI CHẠY HỆ THỐNG TRÍCH XUẤT TÀI NGUYÊN TOÀN DIỆN...');

const SEARCH_DIRS = [
    'resources/source_code/phive.pt',
    'reverse-engineering'
];

const URL_PATTERNS = [
    /https?:\/\/cdn\.sanity\.io\/images\/[^\s"']+/g,
    /https?:\/\/cdn\.sanity\.io\/files\/[^\s"']+/g,
    /https?:\/\/burospaces1\.fra1\.cdn\.digitaloceanspaces\.com\/[^\s"']+/g,
    /https?:\/\/join\.phive\.pt\/wp-json\/[^\s"']+/g
];

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
                URL_PATTERNS.forEach(pattern => {
                    const matches = content.match(pattern);
                    if (matches) {
                        matches.forEach(url => urls.add(url.replace(/[\\"]+$/, '')));
                    }
                });
            }
        }
    }
}

SEARCH_DIRS.forEach(dir => {
    const fullPath = path.join('f:/FitcityFE', dir);
    if (fs.existsSync(fullPath)) walkDir(fullPath);
});

const urlList = Array.from(urls);
fs.writeFileSync('f:/FitcityFE/docs/master_asset_list.txt', urlList.join('\n'));

console.log(`✅ Đã tìm thấy: ${urlList.length} tài nguyên độc lập.`);
console.log(`📝 Danh sách đã lưu tại: docs/master_asset_list.txt`);
