const fs = require('fs');
const path = require('path');

console.log('🔍 PHÂN TÍCH CẤU TRÚC TRANG - KIỂM TRA ĐẦY ĐỦ\n');
console.log('='.repeat(70));

// 1. Đọc HTML gốc
const htmlPath = path.join(__dirname, '../resources/source_code/phive.pt/en.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// 2. Extract components từ HTML
const componentMatches = html.match(/data-component="[^"]+"/g) || [];
const uniqueComponents = [...new Set(componentMatches.map(c => c.match(/data-component="([^"]+)"/)[1]))];

// 3. Đọc component tree đã extract
const treeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/analysis/component-tree.json'), 'utf-8'));
const extractedComponents = Object.keys(treeData.components);

// 4. So sánh
console.log('\n📊 THỐNG KÊ:\n');
console.log(`✅ Components trong HTML gốc: ${uniqueComponents.length}`);
console.log(`✅ Components đã extract: ${extractedComponents.length}`);
console.log(`✅ Tỷ lệ hoàn thành: ${Math.round(extractedComponents.length / uniqueComponents.length * 100)}%`);

// 5. Tìm components thiếu
const missingComponents = uniqueComponents.filter(c => !extractedComponents.includes(c));
const extraComponents = extractedComponents.filter(c => !uniqueComponents.includes(c));

console.log('\n' + '='.repeat(70));
console.log('\n❌ COMPONENTS THIẾU (chưa extract):');
if (missingComponents.length === 0) {
    console.log('   ✅ KHÔNG CÓ - ĐÃ EXTRACT ĐẦY ĐỦ!');
} else {
    missingComponents.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c}`);
    });
}

console.log('\n⚠️  COMPONENTS THỪA (extract nhầm):');
if (extraComponents.length === 0) {
    console.log('   ✅ KHÔNG CÓ - CHÍNH XÁC 100%!');
} else {
    extraComponents.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c}`);
    });
}

// 6. Phân tích cấu trúc trang chi tiết
console.log('\n' + '='.repeat(70));
console.log('\n📋 CẤU TRÚC TRANG CHI TIẾT:\n');

// Tìm sections chính
const sections = [
    { name: 'Home Header (Hero Slider)', component: 'home-header', required: true },
    { name: 'Phive Clubs Section', component: 'phive-clubs', required: true },
    { name: '3D Scene Section', component: 'three-scene', required: true },
    { name: 'Classes Showcase', component: 'classes-showcase', required: true },
    { name: 'Footer', component: 'footer', required: true },
    { name: 'Menu Grid', component: 'menu-grid', required: true },
    { name: 'Curtain (Page Transition)', component: 'curtain', required: true },
    { name: 'Form Modal', component: 'form-modal', required: false },
    { name: 'Class Modal', component: 'class-modal', required: false },
];

sections.forEach((section, i) => {
    const exists = extractedComponents.includes(section.component);
    const status = exists ? '✅' : (section.required ? '❌' : '⚠️');
    const label = section.required ? 'BẮT BUỘC' : 'TÙY CHỌN';
    console.log(`${status} [${label}] ${section.name}`);
    console.log(`   Component: ${section.component}`);
    console.log(`   Trạng thái: ${exists ? 'ĐÃ EXTRACT' : 'CHƯA EXTRACT'}`);
    console.log('');
});

// 7. Phân tích UI components
console.log('='.repeat(70));
console.log('\n🎨 UI COMPONENTS:\n');

const uiComponents = [
    { name: 'Buttons', components: ['content-button', 'button-variable', 'button-round-variable', 'circle-btn'] },
    { name: 'Navigation', components: ['burger', 'menu-grid', 'bar', 'items', 'sub-items', 'anchors'] },
    { name: 'Media', components: ['image-asset', 'media-asset', 'rive-asset', 'background'] },
    { name: 'Layout', components: ['scroller', 'page', 'ribbon', 'content'] },
    { name: 'Forms', components: ['input', 'input-wrapper', 'legal-notice'] },
    { name: 'Transitions', components: ['curtain', 'loading'] },
];

uiComponents.forEach(category => {
    const found = category.components.filter(c => extractedComponents.includes(c));
    const percentage = Math.round(found.length / category.components.length * 100);
    console.log(`${category.name}: ${found.length}/${category.components.length} (${percentage}%)`);
    category.components.forEach(c => {
        const exists = extractedComponents.includes(c);
        console.log(`   ${exists ? '✅' : '❌'} ${c}`);
    });
    console.log('');
});

// 8. Tổng kết
console.log('='.repeat(70));
console.log('\n📝 TỔNG KẾT:\n');

const completeness = Math.round(extractedComponents.length / uniqueComponents.length * 100);
let verdict = '';
let recommendation = '';

if (completeness === 100 && missingComponents.length === 0) {
    verdict = '🎉 HOÀN HẢO - ĐÃ EXTRACT ĐẦY ĐỦ 100%!';
    recommendation = '✅ Sẵn sàng bắt đầu development ngay!';
} else if (completeness >= 95) {
    verdict = '✅ RẤT TỐT - Đã extract hầu hết components';
    recommendation = `⚠️  Cần extract thêm ${missingComponents.length} components còn thiếu`;
} else if (completeness >= 85) {
    verdict = '⚠️  TỐT - Đã extract phần lớn components';
    recommendation = `⚠️  Cần extract thêm ${missingComponents.length} components để đầy đủ`;
} else {
    verdict = '❌ CẦN CẢI THIỆN - Còn nhiều components chưa extract';
    recommendation = `❌ Cần extract thêm ${missingComponents.length} components`;
}

console.log(`Độ hoàn thiện: ${completeness}%`);
console.log(`Verdict: ${verdict}`);
console.log(`Recommendation: ${recommendation}`);

// 9. Chi tiết components thiếu (nếu có)
if (missingComponents.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('\n🔧 HÀNH ĐỘNG CẦN THIẾT:\n');
    console.log('Cần extract các components sau:');
    missingComponents.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c}`);
    });
}

// 10. Lưu báo cáo
const report = {
    timestamp: new Date().toISOString(),
    completeness: completeness + '%',
    verdict,
    recommendation,
    stats: {
        totalInHTML: uniqueComponents.length,
        totalExtracted: extractedComponents.length,
        missing: missingComponents.length,
        extra: extraComponents.length
    },
    missingComponents,
    extraComponents,
    sections: sections.map(s => ({
        name: s.name,
        component: s.component,
        required: s.required,
        extracted: extractedComponents.includes(s.component)
    }))
};

fs.writeFileSync(
    path.join(__dirname, '../docs/STRUCTURE_ANALYSIS.json'),
    JSON.stringify(report, null, 2)
);

console.log('\n' + '='.repeat(70));
console.log('\n💾 Báo cáo đã lưu: docs/STRUCTURE_ANALYSIS.json');
console.log('');
